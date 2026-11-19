import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  FileCheck2,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  auth,
  isVerifiedPortfolioOwner,
  onAuthStateChanged,
  OWNER_EMAIL,
  signInOwnerWithGoogle,
  signOutOwner,
  type User,
} from '../firebase';
import {
  canDownloadCredential,
  CREDENTIAL_CATEGORIES,
  deleteCredentialDocument,
  fetchCredentialPreviewContent,
  formatFileSize,
  isPreviewableMime,
  MAX_CREDENTIAL_FILE_BYTES,
  subscribeToCredentials,
  updateCredentialMetadata,
  uploadCredentialDocument,
  type CredentialCategory,
  type CredentialRecord,
} from '../utils/credentialVault';
import { ScrollReveal } from './ScrollReveal';
import { VaultDocumentPreviewer } from './VaultDocumentPreviewer';

function formatVaultError(err: unknown, fallback: string): string {
  const raw = err instanceof Error ? err.message : String(err ?? '');
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as { error?: string };
    if (parsed && typeof parsed.error === 'string' && parsed.error.trim()) {
      return parsed.error;
    }
  } catch {
    // Plain error message string
  }
  return raw;
}

const FILTER_TABS = ['All', ...CREDENTIAL_CATEGORIES] as const;

export const CredentialVaultSection: React.FC = () => {
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [listError, setListError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_TABS)[number]>('All');

  // Auth & Owner management state
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [manageOpen, setManageOpen] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Upload form state
  const [docName, setDocName] = useState<string>('');
  const [docCategory, setDocCategory] = useState<CredentialCategory>('Resume');
  const [docNotes, setDocNotes] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit / Delete inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editCategory, setEditCategory] = useState<CredentialCategory>('Resume');
  const [editNotes, setEditNotes] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // In-website preview modal state
  const [previewItem, setPreviewItem] = useState<CredentialRecord | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const isOwner = isVerifiedPortfolioOwner(currentUser);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    setLoadingList(true);
    const unsubDocs = subscribeToCredentials(
      (items) => {
        setCredentials(items);
        setLoadingList(false);
        setListError(null);
      },
      (err) => {
        setListError(err.message);
        setLoadingList(false);
      }
    );
    return () => unsubDocs();
  }, []);

  // Clean up blob URLs & handle Escape key for preview modal
  useEffect(() => {
    if (!previewItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePreviewModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewItem, previewBlobUrl]);

  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  const closePreviewModal = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setPreviewItem(null);
    setPreviewBytes(null);
    setPreviewBlobUrl(null);
    setPreviewText(null);
    setPreviewError(null);
    setPreviewLoading(false);
  };

  const handleOpenPreview = async (item: CredentialRecord) => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    setListError(null);
    setPreviewItem(item);
    setPreviewBytes(null);
    setPreviewText(null);
    setPreviewError(null);
    setPreviewLoading(true);

    try {
      const result = await fetchCredentialPreviewContent(
        item.id,
        item.mimeType,
        item.chunkCount,
        item.fileName
      );
      setPreviewBytes(result.bytes);
      setPreviewBlobUrl(result.blobUrl);
      setPreviewText(result.textContent ?? null);
    } catch (err) {
      setPreviewError(
        formatVaultError(err, 'Unable to load preview right now.')
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadResume = async (item: CredentialRecord) => {
    if (!canDownloadCredential(item.category)) return;
    setListError(null);
    setDownloadingId(item.id);
    try {
      let url = previewItem?.id === item.id ? previewBlobUrl : null;
      let shouldRevoke = false;
      if (!url) {
        const res = await fetchCredentialPreviewContent(
          item.id,
          item.mimeType,
          item.chunkCount,
          item.fileName
        );
        url = res.blobUrl;
        shouldRevoke = true;
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = item.fileName || `${item.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (shouldRevoke) {
        setTimeout(() => URL.revokeObjectURL(url!), 2000);
      }
    } catch (err) {
      const msg = formatVaultError(err, 'Failed to download resume file.');
      if (previewItem?.id === item.id) {
        setPreviewError(msg);
      } else {
        setListError(msg);
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOwnerSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const user = await signInOwnerWithGoogle();
      if (!isVerifiedPortfolioOwner(user)) {
        setAuthError(
          `Signed in as ${user.email ?? 'unknown account'}. Only ${OWNER_EMAIL} is authorized to upload or manage credentials.`
        );
      }
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Google sign-in was cancelled or failed.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOwnerSignOut = async () => {
    await signOutOwner();
    setAuthError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_CREDENTIAL_FILE_BYTES) {
      setUploadError('File exceeds the 10 MB upload limit.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    if (!docName.trim()) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      setDocName(baseName);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner || !currentUser) return;
    if (!docName.trim()) {
      setUploadError('Please enter a display name for this credential.');
      return;
    }
    if (!selectedFile) {
      setUploadError('Please select a PDF, image, or document file to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(5);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      await uploadCredentialDocument({
        name: docName,
        category: docCategory,
        notes: docNotes,
        file: selectedFile,
        ownerUid: currentUser.uid,
        onProgress: setUploadProgress,
      });
      setUploadSuccess(`"${docName.trim()}" uploaded to the ${docCategory} vault.`);
      setDocName('');
      setDocNotes('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (item: CredentialRecord) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditNotes(item.notes ?? '');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setSavingEdit(true);
    try {
      await updateCredentialMetadata(id, {
        name: editName,
        category: editCategory,
        notes: editNotes,
      });
      setEditingId(null);
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : 'Unable to update credential details.'
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async (item: CredentialRecord) => {
    setDeletingId(item.id);
    try {
      await deleteCredentialDocument(item.id, item.chunkCount);
      setConfirmDeleteId(null);
      if (previewItem?.id === item.id) {
        closePreviewModal();
      }
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : 'Unable to delete credential.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCredentials =
    activeFilter === 'All'
      ? credentials
      : credentials.filter((c) => c.category === activeFilter);

  const getCategoryMeta = (category: CredentialCategory) => {
    switch (category) {
      case 'Resume':
        return {
          badge: 'bg-[#D7AE68]/20 text-[#D7AE68] border-[#D7AE68]/50',
          icon: FileText,
          accent: 'border-t-[#D7AE68]',
        };
      case 'Projects':
        return {
          badge: 'bg-[#4776FF]/20 text-[#4776FF] border-[#4776FF]/45',
          icon: FolderKanban,
          accent: 'border-t-[#4776FF]',
        };
      case 'Certificates':
        return {
          badge: 'bg-[#19B7A5]/20 text-[#19B7A5] border-[#19B7A5]/45',
          icon: Award,
          accent: 'border-t-[#19B7A5]',
        };
      default:
        return {
          badge: 'bg-[#5E6D87]/20 text-[#F5F6F8] border-[#5E6D87]/50',
          icon: FileCheck2,
          accent: 'border-t-[#5E6D87]',
        };
    }
  };

  return (
    <section
      id="credential-vault"
      className="py-14 lg:py-20 border-b border-[#DCE2EC] bg-[#F5F6F8] bg-architectural-grid"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-8 lg:space-y-10">
        {/* Section Header + Owner Manage Toggle */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#DCE2EC]">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-num font-semibold tracking-wider text-[#4776FF]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
              <span>07. CREDENTIALS &amp; DOCUMENT VAULT</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#10192D] leading-[1.12]">
              Verified <span className="text-[#4776FF]">Resume, Projects</span> &amp;{' '}
              <span className="text-[#19B7A5]">Certificates</span> Repository.
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
              Browse and preview uploaded academic certificates, project dossiers, and credentials directly inside the website. Downloads are permitted exclusively for the Resume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setManageOpen((prev) => !prev)}
              aria-expanded={manageOpen}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                manageOpen || isOwner
                  ? 'bg-[#10192D] text-[#F5F6F8] border-[#243B67] shadow-md'
                  : 'bg-white text-[#10192D] border-[#DCE2EC] hover:border-[#4776FF]'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
              <span>
                {isOwner
                  ? manageOpen
                    ? 'Hide Owner Upload Panel'
                    : 'Upload & Manage Credentials'
                  : manageOpen
                    ? 'Close Owner Panel'
                    : 'Owner Upload / Manage'}
              </span>
            </button>
          </div>
        </ScrollReveal>

        {/* Owner Authentication & Upload Workspace */}
        {manageOpen && (
          <div className="rounded-xl bg-[#10192D] text-[#F5F6F8] border border-[#243B67] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#243B67]">
              <div className="space-y-1">
                <div className="text-[11px] font-mono-num text-[#D7AE68] uppercase tracking-wider">
                  PORTFOLIO OWNER WORKSPACE
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#F5F6F8]">
                  Upload &amp; Organize Verified Credentials
                </h3>
                <p className="text-xs text-[#F5F6F8]/70">
                  Uploaded documents are immediately previewable by visitors on the website. Only items tagged as <strong className="text-[#D7AE68]">Resume</strong> can be downloaded.
                </p>
              </div>

              {currentUser && (
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[#F5F6F8]">
                      {currentUser.displayName || 'Signed In'}
                    </div>
                    <div className="text-[11px] font-mono-num text-[#19B7A5]">
                      {currentUser.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOwnerSignOut}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-[#172C50] border border-[#243B67] text-[#F5F6F8] hover:border-[#4776FF] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {!isOwner ? (
              <div className="p-5 rounded-lg bg-[#172C50]/75 border border-[#243B67] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-num text-[#19B7A5]">
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>OWNER VERIFICATION REQUIRED</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F5F6F8]/85">
                    Sign in with the owner Google account (<span className="font-mono-num text-[#D7AE68]">{OWNER_EMAIL}</span>) to upload, rename, or remove documents in the vault.
                  </p>
                  {authError && (
                    <p className="text-xs text-[#F87171] pt-1">{authError}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOwnerSignIn}
                  disabled={authLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold bg-[#4776FF] text-[#F5F6F8] hover:bg-[#3865ED] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>{authLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="credential-name"
                      className="block text-xs font-mono-num text-[#D7AE68]"
                    >
                      CREDENTIAL NAME *
                    </label>
                    <input
                      id="credential-name"
                      type="text"
                      required
                      maxLength={160}
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Rajkumar Vadher — Executive Resume"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#172C50] border border-[#243B67] text-sm text-[#F5F6F8] placeholder-[#F5F6F8]/40 focus:outline-none focus:border-[#4776FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="credential-category"
                      className="block text-xs font-mono-num text-[#D7AE68]"
                    >
                      CATEGORY *
                    </label>
                    <select
                      id="credential-category"
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value as CredentialCategory)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#172C50] border border-[#243B67] text-sm text-[#F5F6F8] focus:outline-none focus:border-[#4776FF]"
                    >
                      {CREDENTIAL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'Resume'
                            ? 'Resume (Visitor Preview + Download)'
                            : `${cat} (In-Website Preview Only)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="credential-notes"
                      className="block text-xs font-mono-num text-[#19B7A5]"
                    >
                      ISSUER / CONTEXT NOTE (OPTIONAL)
                    </label>
                    <input
                      id="credential-notes"
                      type="text"
                      maxLength={500}
                      value={docNotes}
                      onChange={(e) => setDocNotes(e.target.value)}
                      placeholder="e.g. CFA Institute · Cleared August 2025"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#172C50] border border-[#243B67] text-sm text-[#F5F6F8] placeholder-[#F5F6F8]/40 focus:outline-none focus:border-[#4776FF]"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <span className="block text-xs font-mono-num text-[#D7AE68]">
                      FILE ATTACHMENT (PDF, PPTX, PNG, JPG, WEBP, TXT, CSV, MD · MAX 10 MB) *
                    </span>
                    <label
                      htmlFor="credential-file"
                      className="flex-1 min-h-[156px] rounded-lg border-2 border-dashed border-[#243B67] hover:border-[#4776FF] bg-[#172C50]/50 p-5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-6 h-6 text-[#4776FF]" aria-hidden="true" />
                      {selectedFile ? (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-[#F5F6F8]">
                            {selectedFile.name}
                          </div>
                          <div className="text-xs font-mono-num text-[#19B7A5]">
                            {formatFileSize(selectedFile.size)} · Ready to upload
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-[#F5F6F8]">
                            Click to choose a file from your device
                          </div>
                          <div className="text-xs text-[#F5F6F8]/65">
                            PDFs, PowerPoint decks (.pptx), and high-resolution images render natively inside the website previewer
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        id="credential-file"
                        type="file"
                        accept=".pdf,.pptx,.png,.jpg,.jpeg,.webp,.txt,.md,.csv,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {uploading && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono-num text-[#19B7A5]">
                        <span>Uploading encrypted chunks to vault...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#172C50] overflow-hidden">
                        <div
                          className="h-full bg-[#19B7A5] transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="text-xs text-[#F87171] bg-[#7F1D1D]/30 border border-[#F87171]/40 rounded-md px-3.5 py-2">
                      {uploadError}
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="text-xs text-[#19B7A5] bg-[#19B7A5]/15 border border-[#19B7A5]/40 rounded-md px-3.5 py-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{uploadSuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold bg-[#D7AE68] text-[#10192D] hover:bg-[#E2BD7B] disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>{uploading ? 'Uploading...' : 'Publish to Credential Vault'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filter Tabs + Policy Legend */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Filter uploaded credentials by category"
            className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-lg border border-[#DCE2EC] shadow-xs"
          >
            {FILTER_TABS.map((tab) => {
              const count =
                tab === 'All'
                  ? credentials.length
                  : credentials.filter((c) => c.category === tab).length;
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#10192D] text-[#F5F6F8] shadow-xs'
                      : 'text-[#5E6D87] hover:text-[#10192D] hover:bg-[#F5F6F8]'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`font-mono-num text-[10px] px-1.5 py-0.5 rounded ${
                      active ? 'bg-[#4776FF]/30 text-[#F5F6F8]' : 'bg-[#F5F6F8] text-[#5E6D87]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-[#5E6D87]">
            <span className="inline-flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#D7AE68]" aria-hidden="true" />
              <span>Resume: Preview &amp; Download</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
              <span>Projects &amp; Certificates: Website Preview Only</span>
            </span>
          </div>
        </div>

        {listError && (
          <div className="p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
            {listError}
          </div>
        )}

        {/* Vault Grid */}
        {loadingList ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((skeleton) => (
              <div
                key={skeleton}
                className="h-52 rounded-xl bg-white border border-[#DCE2EC] p-6 animate-pulse space-y-4"
              >
                <div className="h-4 w-24 bg-[#DCE2EC] rounded" />
                <div className="h-6 w-3/4 bg-[#DCE2EC] rounded" />
                <div className="h-4 w-1/2 bg-[#DCE2EC] rounded" />
              </div>
            ))}
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="rounded-xl bg-white border border-[#DCE2EC] p-10 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#10192D]/5 text-[#4776FF]">
              <FileText className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-editorial text-2xl font-semibold text-[#10192D]">
              {activeFilter === 'All'
                ? 'Credential Vault Ready for Uploads'
                : `No ${activeFilter} Documents Uploaded Yet`}
            </h3>
            <p className="text-xs sm:text-sm text-[#5E6D87] max-w-md mx-auto">
              {isOwner
                ? 'Use the Owner Upload Workspace above to publish your Resume, Project Reports, and Certificates.'
                : 'Documents uploaded by Rajkumar Vadher will appear here for direct in-website preview.'}
            </p>
            {!manageOpen && (
              <button
                type="button"
                onClick={() => setManageOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-[#10192D] text-[#F5F6F8] hover:bg-[#4776FF] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open Owner Upload Panel</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {filteredCredentials.map((item) => {
              const meta = getCategoryMeta(item.category);
              const IconComp = meta.icon;
              const downloadable = canDownloadCredential(item.category);
              const isEditing = editingId === item.id;
              const isConfirmingDelete = confirmDeleteId === item.id;
              const mimeKind = isPreviewableMime(item.mimeType, item.fileName);

              return (
                <article
                  key={item.id}
                  className={`card-interactive rounded-xl bg-white border border-[#DCE2EC] border-t-4 ${meta.accent} overflow-hidden flex flex-col justify-between shadow-xs`}
                >
                  <div>
                    {/* Dark Slate Top Strip */}
                    <div className="px-5 py-4 bg-[#10192D] text-[#F5F6F8] flex items-center justify-between gap-2 border-b border-[#243B67]">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono-num font-semibold border ${meta.badge}`}
                      >
                        <IconComp className="w-3 h-3" aria-hidden="true" />
                        <span>{item.category}</span>
                      </span>

                      {downloadable ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono-num text-[#D7AE68]">
                          <Download className="w-3 h-3" aria-hidden="true" />
                          <span>PREVIEW &amp; DOWNLOAD</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono-num text-[#19B7A5]">
                          <Lock className="w-3 h-3" aria-hidden="true" />
                          <span>PREVIEW ONLY</span>
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editName}
                            maxLength={160}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded border border-[#DCE2EC] text-sm font-semibold text-[#10192D]"
                            aria-label="Edit credential name"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) =>
                              setEditCategory(e.target.value as CredentialCategory)
                            }
                            className="w-full px-3 py-1.5 rounded border border-[#DCE2EC] text-xs text-[#10192D]"
                            aria-label="Edit credential category"
                          >
                            {CREDENTIAL_CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editNotes}
                            maxLength={500}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Optional issuer or context note"
                            className="w-full px-3 py-1.5 rounded border border-[#DCE2EC] text-xs text-[#5E6D87]"
                            aria-label="Edit credential notes"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={savingEdit}
                              onClick={() => handleSaveEdit(item.id)}
                              className="px-3 py-1.5 rounded text-xs font-semibold bg-[#10192D] text-[#F5F6F8] hover:bg-[#4776FF] cursor-pointer"
                            >
                              {savingEdit ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 rounded text-xs font-semibold border border-[#DCE2EC] text-[#5E6D87] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#10192D] leading-snug">
                            {item.name}
                          </h3>
                          {item.notes && (
                            <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
                              {item.notes}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono-num text-[#5E6D87]">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F5F6F8] border border-[#DCE2EC]">
                              {mimeKind === 'image' ? (
                                <ImageIcon className="w-3 h-3 text-[#4776FF]" aria-hidden="true" />
                              ) : (
                                <FileText className="w-3 h-3 text-[#4776FF]" aria-hidden="true" />
                              )}
                              <span>{item.fileName.split('.').pop()?.toUpperCase() || 'FILE'}</span>
                            </span>
                            <span>{formatFileSize(item.fileSize)}</span>
                            {item.createdAtMs > 0 && (
                              <span>
                                · {new Date(item.createdAtMs).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 sm:px-6 py-4 bg-[#F5F6F8]/80 border-t border-[#DCE2EC] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#10192D] text-[#F5F6F8] hover:bg-[#4776FF] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Preview in Website</span>
                      </button>

                      {/* STRICT RULE: Download allowed ONLY for Resume category */}
                      {downloadable ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadResume(item)}
                          disabled={downloadingId === item.id}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#D7AE68] text-[#10192D] hover:bg-[#E2BD7B] disabled:opacity-60 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {downloadingId === item.id ? 'Preparing...' : 'Download Resume'}
                          </span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono-num text-[#5E6D87] inline-flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#19B7A5]" aria-hidden="true" />
                          <span>View-only</span>
                        </span>
                      )}
                    </div>

                    {isOwner && !isEditing && (
                      <div className="pt-2.5 border-t border-[#DCE2EC] flex items-center justify-between text-xs">
                        {isConfirmingDelete ? (
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="text-[#991B1B] font-medium">
                              Delete permanently?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={deletingId === item.id}
                                onClick={() => handleConfirmDelete(item)}
                                className="px-2.5 py-1 rounded bg-[#991B1B] text-white font-semibold cursor-pointer"
                              >
                                {deletingId === item.id ? 'Deleting...' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-1 rounded border border-[#DCE2EC] text-[#5E6D87] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditing(item)}
                              className="inline-flex items-center gap-1 text-[#4776FF] hover:underline font-medium cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Rename / Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="inline-flex items-center gap-1 text-[#991B1B] hover:underline font-medium cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* IN-WEBSITE DOCUMENT PREVIEW MODAL */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vault-preview-title"
          className="fixed inset-0 z-50 bg-[#10192D]/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-[#F5F6F8] rounded-xl border border-[#243B67] max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#10192D] text-[#F5F6F8] border-b border-[#243B67] flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono-num text-[#19B7A5]">
                  <span>{previewItem.category.toUpperCase()}</span>
                  <span>·</span>
                  <span>{formatFileSize(previewItem.fileSize)}</span>
                  {!canDownloadCredential(previewItem.category) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#172C50] border border-[#243B67] text-[#D7AE68]">
                      <Lock className="w-3 h-3" aria-hidden="true" />
                      <span>In-Website Preview Only</span>
                    </span>
                  )}
                </div>
                <h3
                  id="vault-preview-title"
                  className="font-editorial text-xl sm:text-2xl font-semibold text-[#F5F6F8] truncate"
                >
                  {previewItem.name}
                </h3>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {canDownloadCredential(previewItem.category) && (
                  <button
                    type="button"
                    onClick={() => handleDownloadResume(previewItem)}
                    disabled={downloadingId === previewItem.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#D7AE68] text-[#10192D] hover:bg-[#E2BD7B] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Download Resume</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={closePreviewModal}
                  aria-label="Close document preview"
                  className="p-2 rounded-md border border-[#243B67] bg-[#172C50] text-[#F5F6F8] hover:border-[#4776FF] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Viewport */}
            <div
              className="flex-1 bg-[#172C50]/10 overflow-auto flex items-center justify-center p-3 sm:p-5 relative"
              onContextMenu={(e) => {
                if (!canDownloadCredential(previewItem.category)) {
                  e.preventDefault();
                }
              }}
            >
              {previewLoading ? (
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#4776FF] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono-num text-[#5E6D87]">
                    Loading secure in-website preview...
                  </p>
                </div>
              ) : previewError ? (
                <div className="p-6 rounded-lg bg-white border border-[#FECACA] text-sm text-[#991B1B] max-w-md text-center">
                  {previewError}
                </div>
              ) : previewBytes && previewBlobUrl ? (
                <VaultDocumentPreviewer
                  item={previewItem}
                  bytes={previewBytes}
                  blobUrl={previewBlobUrl}
                  textContent={previewText}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
