import JSZip from 'jszip';

export interface PptxTable {
  rows: string[][];
}

export interface PptxImage {
  url: string;
  alt: string;
}

export interface PptxSlide {
  slideNumber: number;
  title: string;
  paragraphs: string[];
  tables: PptxTable[];
  images: PptxImage[];
  notes: string[];
}

export interface ParsedPptxDeck {
  slides: PptxSlide[];
  blobUrls: string[];
}

function getElementsByLocalName(root: Element | Document, localName: string): Element[] {
  const matches: Element[] = [];
  const all = root.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    if (el.localName === localName) {
      matches.push(el);
    }
  }
  return matches;
}

function extractParagraphText(pEl: Element): string {
  const textNodes = getElementsByLocalName(pEl, 't');
  let combined = '';
  for (const node of textNodes) {
    combined += node.textContent ?? '';
  }
  return combined.replace(/\s+/g, ' ').trim();
}

function resolveZipTarget(baseDir: string, target: string): string {
  const normalizedTarget = target.replace(/^\/+/, '');
  if (target.startsWith('/')) {
    return normalizedTarget;
  }
  const parts = baseDir.split('/').filter(Boolean);
  for (const seg of normalizedTarget.split('/')) {
    if (seg === '..') {
      parts.pop();
    } else if (seg && seg !== '.') {
      parts.push(seg);
    }
  }
  return parts.join('/');
}

function inferImageMime(path: string): string | null {
  const lower = path.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return null;
}

export async function parsePptxBytes(bytes: Uint8Array): Promise<ParsedPptxDeck> {
  const zip = await JSZip.loadAsync(bytes);
  const parser = new DOMParser();

  const slidePaths = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/i.test(p))
    .sort((a, b) => {
      const numA = Number(a.match(/slide(\d+)\.xml$/i)?.[1] ?? 0);
      const numB = Number(b.match(/slide(\d+)\.xml$/i)?.[1] ?? 0);
      return numA - numB;
    });

  if (slidePaths.length === 0) {
    throw new Error('No slides could be found inside this PPTX presentation.');
  }

  const blobUrls: string[] = [];
  const slides: PptxSlide[] = [];

  for (let idx = 0; idx < slidePaths.length; idx++) {
    const slidePath = slidePaths[idx];
    const slideNum = Number(slidePath.match(/slide(\d+)\.xml$/i)?.[1] ?? idx + 1);
    const slideXmlStr = await zip.file(slidePath)?.async('string');
    if (!slideXmlStr) continue;

    const slideDoc = parser.parseFromString(slideXmlStr, 'application/xml');
    let title = '';
    const paragraphs: string[] = [];
    const tables: PptxTable[] = [];

    // Extract shapes (title vs body content)
    const shapes = getElementsByLocalName(slideDoc, 'sp');
    for (const sp of shapes) {
      const ph = getElementsByLocalName(sp, 'ph')[0];
      const phType = ph?.getAttribute('type') ?? '';
      if (phType === 'sldNum' || phType === 'ftr' || phType === 'dt') {
        continue;
      }

      const pList = getElementsByLocalName(sp, 'p');
      const shapeLines: string[] = [];
      for (const pEl of pList) {
        const line = extractParagraphText(pEl);
        if (line) shapeLines.push(line);
      }

      if (shapeLines.length === 0) continue;

      if (!title && (phType === 'title' || phType === 'ctrTitle')) {
        title = shapeLines.join(' ');
      } else {
        for (const line of shapeLines) {
          if (line !== title && !paragraphs.includes(line)) {
            paragraphs.push(line);
          }
        }
      }
    }

    // Fallback title if no placeholder title was explicitly tagged
    if (!title && paragraphs.length > 0) {
      title = paragraphs.shift() ?? `Slide ${slideNum}`;
    }

    // Extract tables
    const tableEls = getElementsByLocalName(slideDoc, 'tbl');
    for (const tbl of tableEls) {
      const rows: string[][] = [];
      const rowEls = getElementsByLocalName(tbl, 'tr');
      for (const tr of rowEls) {
        const cells: string[] = [];
        const cellEls = getElementsByLocalName(tr, 'tc');
        for (const tc of cellEls) {
          const pList = getElementsByLocalName(tc, 'p');
          const cellText = pList
            .map(extractParagraphText)
            .filter(Boolean)
            .join(' ');
          cells.push(cellText);
        }
        if (cells.some((c) => c.length > 0)) {
          rows.push(cells);
        }
      }
      if (rows.length > 0) {
        tables.push({ rows });
      }
    }

    // Parse slide relationships for embedded images and speaker notes
    const relsPath = slidePath.replace(
      /ppt\/slides\/(slide\d+\.xml)$/i,
      'ppt/slides/_rels/$1.rels'
    );
    const images: PptxImage[] = [];
    const notes: string[] = [];

    const relsStr = await zip.file(relsPath)?.async('string');
    if (relsStr) {
      const relsDoc = parser.parseFromString(relsStr, 'application/xml');
      const relEls = getElementsByLocalName(relsDoc, 'Relationship');
      const seenTargets = new Set<string>();

      for (const rel of relEls) {
        const relType = rel.getAttribute('Type') ?? '';
        const target = rel.getAttribute('Target') ?? '';
        if (!target) continue;

        const resolvedPath = resolveZipTarget('ppt/slides', target);
        if (relType.includes('/image') && !seenTargets.has(resolvedPath)) {
          seenTargets.add(resolvedPath);
          const mime = inferImageMime(resolvedPath);
          const mediaFile = zip.file(resolvedPath);
          if (mime && mediaFile) {
            const imgData = await mediaFile.async('uint8array');
            const blob = new Blob([imgData.slice()], { type: mime });
            const url = URL.createObjectURL(blob);
            blobUrls.push(url);
            images.push({
              url,
              alt: `Slide ${slideNum} visual asset`,
            });
          }
        } else if (relType.includes('/notesSlide')) {
          const notesXmlStr = await zip.file(resolvedPath)?.async('string');
          if (notesXmlStr) {
            const notesDoc = parser.parseFromString(notesXmlStr, 'application/xml');
            const noteShapes = getElementsByLocalName(notesDoc, 'sp');
            for (const nsp of noteShapes) {
              const ph = getElementsByLocalName(nsp, 'ph')[0];
              const phType = ph?.getAttribute('type') ?? '';
              if (phType === 'sldNum' || phType === 'sldImg') continue;
              const pList = getElementsByLocalName(nsp, 'p');
              for (const pEl of pList) {
                const txt = extractParagraphText(pEl);
                if (txt) notes.push(txt);
              }
            }
          }
        }
      }
    }

    slides.push({
      slideNumber: slideNum,
      title: title || `Slide ${slideNum}`,
      paragraphs,
      tables,
      images,
      notes,
    });
  }

  return { slides, blobUrls };
}
