export const CREDENTIAL_CATEGORIES = [
  'Resume',
  'Projects',
  'Certificates',
  'Other',
] as const;

export type CredentialCategory = (typeof CREDENTIAL_CATEGORIES)[number];

export interface CredentialRecord {
  id: string;
  name: string;
  category: CredentialCategory;
  fileName: string;
  mimeType: string;
  fileSize: number;
  chunkCount: number;
  notes?: string;
  ownerUid: string;
  createdAtMs: number;
}

export const MAX_CREDENTIAL_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const CHUNK_CHAR_SIZE = 450_000;
export const MAX_CHUNK_COUNT = 32;

const PPTX_MIME =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation';

export function canDownloadCredential(category: CredentialCategory): boolean {
  return category === 'Resume';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export type PreviewKind = 'pdf' | 'pptx' | 'image' | 'text' | 'unsupported';

export function isPreviewableMime(
  mimeType: string,
  fileName = ''
): PreviewKind {
  const normalized = (mimeType || '').toLowerCase().trim();
  const lowerName = (fileName || '').toLowerCase().trim();

  if (normalized === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return 'pdf';
  }
  if (normalized === PPTX_MIME || lowerName.endsWith('.pptx')) {
    return 'pptx';
  }
  if (
    normalized.startsWith('image/') ||
    /\.(png|jpe?g|webp|gif|svg)$/.test(lowerName)
  ) {
    return 'image';
  }
  if (
    normalized.startsWith('text/') ||
    normalized === 'application/json' ||
    normalized === 'application/csv' ||
    /\.(txt|md|csv|json)$/.test(lowerName)
  ) {
    return 'text';
  }
  return 'unsupported';
}

export function inferMimeTypeFromMeta(fileType: string, fileName: string): string {
  if (fileType && fileType !== 'application/octet-stream') {
    return fileType;
  }
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.pptx')) return PPTX_MIME;
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.md')) return 'text/markdown';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.txt')) return 'text/plain';
  if (lower.endsWith('.json')) return 'application/json';
  return fileType || 'application/octet-stream';
}

export function chunkBase64String(
  base64: string,
  chunkSize = CHUNK_CHAR_SIZE
): string[] {
  if (!base64) return [];
  const chunks: string[] = [];
  for (let i = 0; i < base64.length; i += chunkSize) {
    chunks.push(base64.slice(i, i + chunkSize));
  }
  return chunks;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const blockSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += blockSize) {
    const slice = bytes.subarray(i, i + blockSize);
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const cleaned = base64.replace(/\s+/g, '');
  const binary = atob(cleaned);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
