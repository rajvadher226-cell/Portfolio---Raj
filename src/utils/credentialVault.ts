import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

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

export function canDownloadCredential(category: CredentialCategory): boolean {
  return category === 'Resume';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function isPreviewableMime(
  mimeType: string
): 'pdf' | 'image' | 'text' | 'unsupported' {
  const normalized = mimeType.toLowerCase();
  if (normalized === 'application/pdf') return 'pdf';
  if (normalized.startsWith('image/')) return 'image';
  if (
    normalized.startsWith('text/') ||
    normalized === 'application/json' ||
    normalized === 'application/csv'
  ) {
    return 'text';
  }
  return 'unsupported';
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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const blockSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += blockSize) {
    const slice = bytes.subarray(i, i + blockSize);
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function inferMimeType(file: File): string {
  if (file.type) return file.type;
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.md')) return 'text/markdown';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.txt')) return 'text/plain';
  return 'application/octet-stream';
}

export function subscribeToCredentials(
  onData: (items: CredentialRecord[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const path = 'credentials';
  const q = query(
    collection(db, path),
    where('category', 'in', [...CREDENTIAL_CATEGORIES])
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: CredentialRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        const createdAtTs = d.createdAt as { toMillis?: () => number } | undefined;
        return {
          id: docSnap.id,
          name: String(d.name ?? ''),
          category: (d.category as CredentialCategory) ?? 'Other',
          fileName: String(d.fileName ?? ''),
          mimeType: String(d.mimeType ?? 'application/octet-stream'),
          fileSize: Number(d.fileSize ?? 0),
          chunkCount: Number(d.chunkCount ?? 1),
          notes: typeof d.notes === 'string' ? d.notes : undefined,
          ownerUid: String(d.ownerUid ?? ''),
          createdAtMs: createdAtTs?.toMillis ? createdAtTs.toMillis() : 0,
        };
      });
      items.sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function uploadCredentialDocument(params: {
  name: string;
  category: CredentialCategory;
  notes?: string;
  file: File;
  ownerUid: string;
  onProgress?: (pct: number) => void;
}): Promise<string> {
  const { name, category, notes, file, ownerUid, onProgress } = params;
  const trimmedName = name.trim();
  const trimmedNotes = (notes ?? '').trim();

  if (!trimmedName || trimmedName.length > 160) {
    throw new Error('Please provide a credential name (1–160 characters).');
  }
  if (file.size <= 0 || file.size > MAX_CREDENTIAL_FILE_BYTES) {
    throw new Error('File must be between 1 byte and 10 MB.');
  }

  onProgress?.(10);
  const buffer = await file.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  const chunks = chunkBase64String(base64, CHUNK_CHAR_SIZE);

  if (chunks.length < 1 || chunks.length > MAX_CHUNK_COUNT) {
    throw new Error('File exceeds the maximum supported chunk count (32 chunks).');
  }

  const mimeType = inferMimeType(file);
  const credentialId = `cred_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const parentPath = `credentials/${credentialId}`;
  const parentRef = doc(db, 'credentials', credentialId);

  const parentPayload: Record<string, unknown> = {
    name: trimmedName,
    category,
    fileName: file.name.slice(0, 255),
    mimeType: mimeType.slice(0, 128),
    fileSize: file.size,
    chunkCount: chunks.length,
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (trimmedNotes) {
    parentPayload.notes = trimmedNotes.slice(0, 500);
  }

  onProgress?.(25);

  // Batch parent + first group of chunks, then subsequent groups (keeps every RPC well below 10 MiB)
  const batchSize = 8;
  const firstSlice = chunks.slice(0, batchSize);

  try {
    const firstBatch = writeBatch(db);
    firstBatch.set(parentRef, parentPayload);
    firstSlice.forEach((chunkData, idx) => {
      const chunkRef = doc(db, 'credentials', credentialId, 'chunks', String(idx));
      firstBatch.set(chunkRef, {
        index: idx,
        data: chunkData,
        ownerUid,
        createdAt: serverTimestamp(),
      });
    });
    await firstBatch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, parentPath);
  }

  onProgress?.(Math.min(95, Math.round((firstSlice.length / chunks.length) * 75) + 25));

  for (let offset = batchSize; offset < chunks.length; offset += batchSize) {
    const slice = chunks.slice(offset, offset + batchSize);
    const chunkBatch = writeBatch(db);
    slice.forEach((chunkData, i) => {
      const idx = offset + i;
      const chunkRef = doc(db, 'credentials', credentialId, 'chunks', String(idx));
      chunkBatch.set(chunkRef, {
        index: idx,
        data: chunkData,
        ownerUid,
        createdAt: serverTimestamp(),
      });
    });
    try {
      await chunkBatch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${parentPath}/chunks`);
    }
    onProgress?.(
      Math.min(95, Math.round(((offset + slice.length) / chunks.length) * 75) + 25)
    );
  }

  onProgress?.(100);
  return credentialId;
}

export async function fetchCredentialPreviewContent(
  credentialId: string,
  mimeType: string
): Promise<{ blobUrl: string; textContent?: string }> {
  const chunksPath = `credentials/${credentialId}/chunks`;
  let snap;
  try {
    const q = query(
      collection(db, chunksPath),
      where('index', '>=', 0),
      where('index', '<', MAX_CHUNK_COUNT)
    );
    snap = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, chunksPath);
  }

  const ordered = snap.docs
    .map((d) => ({
      index: Number(d.data().index ?? 0),
      data: String(d.data().data ?? ''),
    }))
    .sort((a, b) => a.index - b.index);

  if (ordered.length === 0) {
    throw new Error('Credential file content could not be found.');
  }

  const fullBase64 = ordered.map((c) => c.data).join('');
  const bytes = base64ToUint8Array(fullBase64);
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);

  let textContent: string | undefined;
  if (isPreviewableMime(mimeType) === 'text') {
    textContent = new TextDecoder('utf-8').decode(bytes);
  }

  return { blobUrl, textContent };
}

export async function updateCredentialMetadata(
  credentialId: string,
  updates: { name: string; category: CredentialCategory; notes?: string }
): Promise<void> {
  const path = `credentials/${credentialId}`;
  const payload: Record<string, unknown> = {
    name: updates.name.trim().slice(0, 160),
    category: updates.category,
    notes: (updates.notes ?? '').trim().slice(0, 500),
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(doc(db, 'credentials', credentialId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCredentialDocument(
  credentialId: string,
  chunkCount: number
): Promise<void> {
  const path = `credentials/${credentialId}`;
  try {
    const batch = writeBatch(db);
    for (let i = 0; i < Math.max(1, chunkCount); i++) {
      batch.delete(doc(db, 'credentials', credentialId, 'chunks', String(i)));
    }
    batch.delete(doc(db, 'credentials', credentialId));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
