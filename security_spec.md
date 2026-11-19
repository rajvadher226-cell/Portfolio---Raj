# Security Specification — Credentials & Document Vault

## 1. Data Invariants
1. **Owner-Only Mutations**: Only the authenticated, email-verified portfolio owner (`rajvadher226@gmail.com`) may create, update, or delete records in `/credentials/{credentialId}` or `/credentials/{credentialId}/chunks/{chunkId}`.
2. **Public Read for In-Website Preview**: Website visitors may list and read `/credentials` and `/credentials/{credentialId}/chunks` to render previews directly in the website. No PII (personal phone, address, private email) is stored in `CredentialDocument`.
3. **Master Gate on Chunks**: Every chunk write under `/credentials/{credentialId}/chunks/{chunkId}` requires the parent `/credentials/{credentialId}` document to exist (or be created atomically in the same batch using `existsAfter`) and share the exact `ownerUid`.
4. **Strict Schema & Boundary Enforcement**: `name` (1..160), `category` (`Resume | Projects | Certificates | Other`), `fileName` (1..255), `mimeType` (1..128), `fileSize` (`1..10485760`), `chunkCount` (`1..32`), `notes` (`0..500`), and chunk `data` (`1..600000`).
5. **Immutable Identity & Temporal Integrity**: `ownerUid` and `createdAt` are immutable on update; `createdAt` and `updatedAt` must equal `request.time`.

## 2. The "Dirty Dozen" Rejection Payloads
1. Unauthenticated `create` on `/credentials/doc1` -> `PERMISSION_DENIED`
2. Non-owner authenticated user (`other@gmail.com`, `email_verified: true`) `create` on `/credentials/doc1` -> `PERMISSION_DENIED`
3. Email spoofing (`rajvadher226@gmail.com` with `email_verified: false`) `create` on `/credentials/doc1` -> `PERMISSION_DENIED`
4. Shadow field injection (`isAdmin: true` or `extraField: "hack"`) -> `PERMISSION_DENIED` (`hasOnly`)
5. Invalid `category` (`"SalarySlip"`) -> `PERMISSION_DENIED`
6. Oversized `name` (> 160 chars) or empty `name` (`""`) -> `PERMISSION_DENIED`
7. Client-forged timestamp (`createdAt` != `request.time`) -> `PERMISSION_DENIED`
8. Identity spoofing (`ownerUid` != `request.auth.uid`) -> `PERMISSION_DENIED`
9. ID poisoning (`credentialId` > 128 chars or containing invalid chars like `$`) -> `PERMISSION_DENIED`
10. Update mutating immutable `createdAt` or `ownerUid` -> `PERMISSION_DENIED`
11. Orphaned chunk write under a non-existent parent `/credentials/missing/chunks/0` -> `PERMISSION_DENIED`
12. Oversized chunk `data` (> 600,000 chars) or `fileSize` > 10 MB -> `PERMISSION_DENIED`
