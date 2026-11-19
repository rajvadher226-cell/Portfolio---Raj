import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  canDownloadCredential,
  isPreviewableMime,
  type CredentialRecord,
} from '../utils/credentialPreviewHelpers';
import { parsePptxBytes, type PptxSlide } from '../utils/pptxParser';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfCanvasPreviewProps {
  bytes: Uint8Array;
  downloadable: boolean;
}

const PdfCanvasPreview: React.FC<PdfCanvasPreviewProps> = ({
  bytes,
  downloadable,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.15);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    const renderPdf = async () => {
      setLoading(true);
      setRenderError(null);

      try {
        loadingTask = pdfjsLib.getDocument({ data: bytes.slice() });
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        setNumPages(pdfDoc.numPages);
        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = '';

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (cancelled) break;
          const page = await pdfDoc.getPage(pageNum);
          if (cancelled) break;

          const baseViewport = page.getViewport({ scale });
          const outputScale = dpr;

          const pageWrapper = document.createElement('div');
          pageWrapper.className =
            'bg-white rounded-lg shadow-md border border-[#DCE2EC] overflow-hidden mx-auto';
          pageWrapper.style.width = `${Math.floor(baseViewport.width)}px`;
          pageWrapper.style.maxWidth = '100%';

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          canvas.width = Math.floor(baseViewport.width * outputScale);
          canvas.height = Math.floor(baseViewport.height * outputScale);
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';

          const transform =
            outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

          await page.render({
            canvas,
            canvasContext: ctx,
            viewport: baseViewport,
            transform,
          }).promise;

          const footer = document.createElement('div');
          footer.className =
            'px-4 py-1.5 bg-[#F5F6F8] border-t border-[#DCE2EC] text-[11px] font-mono-num text-[#5E6D87] flex justify-between';
          footer.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;

          pageWrapper.appendChild(canvas);
          pageWrapper.appendChild(footer);
          container.appendChild(pageWrapper);
        }
      } catch (err) {
        if (!cancelled) {
          setRenderError(
            err instanceof Error
              ? err.message
              : 'Unable to render this PDF document.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void renderPdf();

    return () => {
      cancelled = true;
      if (loadingTask) {
        void loadingTask.destroy();
      }
    };
  }, [bytes, scale]);

  return (
    <div
      className={`w-full h-full flex flex-col ${downloadable ? '' : 'select-none'}`}
      onContextMenu={(e) => {
        if (!downloadable) e.preventDefault();
      }}
    >
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-[#DCE2EC] rounded-lg mb-3 shrink-0 shadow-xs">
        <div className="text-xs font-mono-num text-[#5E6D87] flex items-center gap-2">
          <span>{numPages > 0 ? `${numPages} Page${numPages > 1 ? 's' : ''}` : 'PDF Document'}</span>
          {!downloadable && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#19B7A5]">
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>View-only</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.75, Number((s - 0.15).toFixed(2))))}
            aria-label="Zoom out PDF"
            className="p-1.5 rounded border border-[#DCE2EC] bg-[#F5F6F8] text-[#10192D] hover:border-[#4776FF] cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono-num text-[#10192D] min-w-[46px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.0, Number((s + 0.15).toFixed(2))))}
            aria-label="Zoom in PDF"
            className="p-1.5 rounded border border-[#DCE2EC] bg-[#F5F6F8] text-[#10192D] hover:border-[#4776FF] cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {renderError ? (
        <div className="p-6 rounded-lg bg-white border border-[#FECACA] text-sm text-[#991B1B] max-w-md mx-auto my-auto text-center">
          {renderError}
        </div>
      ) : (
        <div className="flex-1 overflow-auto relative px-1 py-2">
          {loading && (
            <div className="flex items-center justify-center py-8 gap-2 text-xs font-mono-num text-[#5E6D87]">
              <div className="w-4 h-4 border-2 border-[#4776FF] border-t-transparent rounded-full animate-spin" />
              <span>Rendering PDF pages...</span>
            </div>
          )}
          <div ref={containerRef} className="space-y-4 pb-4" />
        </div>
      )}
    </div>
  );
};

interface PptxDeckPreviewProps {
  bytes: Uint8Array;
  downloadable: boolean;
}

const PptxDeckPreview: React.FC<PptxDeckPreviewProps> = ({
  bytes,
  downloadable,
}) => {
  const [slides, setSlides] = useState<PptxSlide[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let createdBlobUrls: string[] = [];

    const loadDeck = async () => {
      setLoading(true);
      setError(null);
      try {
        const parsed = await parsePptxBytes(bytes);
        createdBlobUrls = parsed.blobUrls;
        if (!active) {
          createdBlobUrls.forEach((u) => URL.revokeObjectURL(u));
          return;
        }
        setSlides(parsed.slides);
        setCurrentIdx(0);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to parse PPTX presentation slides.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDeck();

    return () => {
      active = false;
      createdBlobUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [bytes]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIdx((i) => Math.min(slides.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  if (loading) {
    return (
      <div className="text-center space-y-3 my-auto">
        <div className="w-8 h-8 border-2 border-[#4776FF] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono-num text-[#5E6D87]">
          Parsing presentation deck slides...
        </p>
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-white border border-[#FECACA] text-sm text-[#991B1B] max-w-md my-auto text-center">
        {error || 'No readable slide content found in this PPTX file.'}
      </div>
    );
  }

  const slide = slides[currentIdx] ?? slides[0];

  return (
    <div
      className={`w-full h-full flex flex-col gap-3 ${downloadable ? '' : 'select-none'}`}
      onContextMenu={(e) => {
        if (!downloadable) e.preventDefault();
      }}
    >
      {/* Slide Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white border border-[#DCE2EC] rounded-lg shrink-0 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono-num text-[#10192D]">
          <span className="px-2 py-0.5 rounded bg-[#10192D] text-[#F5F6F8]">
            SLIDE {currentIdx + 1} / {slides.length}
          </span>
          {!downloadable && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#19B7A5]">
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>In-Website Deck Preview</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#DCE2EC] bg-[#F5F6F8] text-xs font-semibold text-[#10192D] hover:border-[#4776FF] disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <button
            type="button"
            disabled={currentIdx >= slides.length - 1}
            onClick={() => setCurrentIdx((i) => Math.min(slides.length - 1, i + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#DCE2EC] bg-[#F5F6F8] text-xs font-semibold text-[#10192D] hover:border-[#4776FF] disabled:opacity-40 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Slide Viewport */}
      <div className="flex-1 overflow-auto space-y-4 pr-1">
        <div className="bg-white rounded-xl border border-[#DCE2EC] shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-[#10192D] text-[#F5F6F8] border-b border-[#243B67] flex items-center justify-between gap-4">
            <h4 className="font-editorial text-xl sm:text-2xl font-semibold text-[#F5F6F8]">
              {slide.title}
            </h4>
            <span className="text-[11px] font-mono-num text-[#D7AE68] shrink-0">
              #{String(slide.slideNumber).padStart(2, '0')}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {slide.paragraphs.length > 0 && (
              <ul className="space-y-2.5 text-sm text-[#192438] leading-relaxed">
                {slide.paragraphs.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#4776FF] mt-2 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}

            {slide.tables.map((tbl, tIdx) => (
              <div
                key={tIdx}
                className="overflow-x-auto rounded-lg border border-[#DCE2EC]"
              >
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {tbl.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={
                          rIdx === 0
                            ? 'bg-[#10192D] text-[#F5F6F8] font-semibold'
                            : rIdx % 2 === 1
                              ? 'bg-white text-[#192438]'
                              : 'bg-[#F5F6F8] text-[#192438]'
                        }
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-3 py-2 border-b border-[#DCE2EC]"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {slide.images.length > 0 && (
              <div
                className={`grid gap-4 ${
                  slide.images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {slide.images.map((img, iIdx) => (
                  <div
                    key={iIdx}
                    className="rounded-lg border border-[#DCE2EC] bg-[#F5F6F8] p-3 flex items-center justify-center"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      draggable={downloadable}
                      onContextMenu={(e) => {
                        if (!downloadable) e.preventDefault();
                      }}
                      className="max-h-[340px] w-auto object-contain rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            {slide.paragraphs.length === 0 &&
              slide.tables.length === 0 &&
              slide.images.length === 0 && (
                <p className="text-xs text-[#5E6D87] italic">
                  Visual layout slide — no additional text blocks extracted.
                </p>
              )}
          </div>
        </div>

        {slide.notes.length > 0 && (
          <div className="rounded-lg bg-white border border-[#DCE2EC] p-4 space-y-1.5">
            <div className="text-[11px] font-mono-num text-[#4776FF] uppercase">
              Speaker Notes
            </div>
            <p className="text-xs text-[#5E6D87] leading-relaxed">
              {slide.notes.join(' ')}
            </p>
          </div>
        )}
      </div>

      {/* Slide Quick Index Strip */}
      {slides.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
          {slides.map((s, idx) => (
            <button
              key={s.slideNumber}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-num whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                idx === currentIdx
                  ? 'bg-[#10192D] text-[#F5F6F8] border-[#10192D]'
                  : 'bg-white text-[#5E6D87] border-[#DCE2EC] hover:border-[#4776FF]'
              }`}
            >
              {idx + 1}. {s.title.slice(0, 22)}
              {s.title.length > 22 ? '…' : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface VaultDocumentPreviewerProps {
  item: CredentialRecord;
  bytes: Uint8Array;
  blobUrl: string;
  textContent: string | null;
}

export const VaultDocumentPreviewer: React.FC<VaultDocumentPreviewerProps> = ({
  item,
  bytes,
  blobUrl,
  textContent,
}) => {
  const kind = isPreviewableMime(item.mimeType, item.fileName);
  const downloadable = canDownloadCredential(item.category);

  if (kind === 'pdf') {
    return <PdfCanvasPreview bytes={bytes} downloadable={downloadable} />;
  }

  if (kind === 'pptx') {
    return <PptxDeckPreview bytes={bytes} downloadable={downloadable} />;
  }

  if (kind === 'image') {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-auto">
        <img
          src={blobUrl}
          alt={item.name}
          draggable={downloadable}
          onContextMenu={(e) => {
            if (!downloadable) e.preventDefault();
          }}
          className={`max-w-full max-h-full object-contain rounded-lg shadow-lg border border-[#DCE2EC] bg-white ${
            downloadable ? '' : 'select-none'
          }`}
        />
      </div>
    );
  }

  if (kind === 'text' && textContent !== null) {
    return (
      <pre
        className={`w-full h-full overflow-auto p-6 rounded-lg bg-white border border-[#DCE2EC] text-xs sm:text-sm font-mono-num text-[#192438] whitespace-pre-wrap leading-relaxed ${
          downloadable ? '' : 'select-none'
        }`}
      >
        {textContent}
      </pre>
    );
  }

  return (
    <div className="p-8 rounded-xl bg-white border border-[#DCE2EC] max-w-md text-center space-y-3 my-auto">
      <FileText className="w-10 h-10 text-[#4776FF] mx-auto" aria-hidden="true" />
      <h4 className="font-editorial text-xl font-semibold text-[#10192D]">
        Preview Format Not Supported Directly
      </h4>
      <p className="text-xs text-[#5E6D87] leading-relaxed">
        {downloadable
          ? 'You can download this Resume directly using the Download Resume button above.'
          : 'Supported in-website preview formats are PDF, PPTX, PNG, JPG, WEBP, TXT, CSV, and MD.'}
      </p>
    </div>
  );
};
