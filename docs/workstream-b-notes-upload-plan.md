# Workstream B — Interview Notes PDF Upload: Implementation Plan

Scope: implement the **Notes** sub-step of `/interview/[applicantRecordId]/assessment`. Users can upload, view, replace, and (implicitly via replace) clean up a single PDF attached to one `InterviewedApplicantRecord`.

This plan reflects the actual state of the repo (verified) and is more concrete than §4 of `docs/interview-assessment-feature-plan.md`. Where this conflicts with the master plan, this document wins for workstream B.

---

## 0. What's already in place (verified)

Backend:
- `FirebaseFile` model (`backend/typescript/models/firebaseFile.model.ts`) with columns: `id` (UUID), `storage_path`, `original_file_name`, `uploaded_user_id` (FK → `users.id`), `size_bytes`. Migration already applied (`2026.05.12T04.39.49.create-firebase-file-table.ts`).
- `interviewed_applicant_record.interview_notes_id` FK → `firebase_files.id` (model has `@BelongsTo(() => FirebaseFile)` mapping → `interview_notes`).
- `FileStorageService` (`services/implementations/fileStorageService.ts`) with `getFile(name) → signedUrl`, `createFile(name, localPath, contentType)`, `updateFile`, `deleteFile`.
- **`graphql-upload` is already wired** — `apollo-server-express` v2.22 auto-mounts the upload middleware. `scalar Upload` is already declared in `graphql/types/entityType.ts`, and `entityResolvers.ts` already consumes `FileUpload` via `createReadStream`. ✅ Nothing to wire up in `server.ts` or root `graphql/index.ts`.
- `InterviewCompositeService` + `interviewPageResolvers` exist (currently `Mutation: {}`).
- `InterviewedApplicantRecordsService.updateInterviewedApplicantRecord` accepts `interviewNotesId` — but note **side-effect bug**: it unconditionally writes `status`, `interview_date`, `interview_notes_id` from the input even when `undefined`. In practice Sequelize `.update({ x: undefined })` is a no-op for that field, so calling it with only `{ interviewNotesId }` is safe. Confirm by writing a test before relying on it.

Frontend:
- Routes already restructured under `/interview/[applicantRecordId]/...`.
- `frontend/pages/interview/[applicantRecordId]/assessment/index.tsx` already renders the SCORES sub-step via `<ScoresPanel/>` (workstream A in progress). NOTES sub-step currently shows a `<p>Assessment Notes content goes here.</p>` placeholder — **this is your insertion point**.
- Apollo client at `frontend/client.ts` uses `HttpLink`. Will need to swap to `createUploadLink` from `apollo-upload-client`.
- Codegen config at `frontend/codegen.ts` already auto-discovers types from `backend/.../graphql/types/**`. The `Upload` scalar is in `entityType.ts` and is currently scalar-mapped by the codegen `client` preset — confirm by running `yarn codegen` and checking the generated types. If `Upload` lands as `any`, add `config: { scalars: { Upload: 'File' } }` in `codegen.ts`.
- API client pattern: see `frontend/APIClients/InterviewPageAPIClient.ts` — uses `BaseAPIClient.handleAuthRefresh()` then `client.query/mutate` with codegen `Document` + `QueryVariables` types.

---

## 1. Backend changes

### 1.1 New: FirebaseFile DTO + interface

**File: `backend/typescript/types/firebaseFile.ts`** (new)
```ts
export type FirebaseFileDTO = {
  id: string;
  storagePath: string;
  originalFileName: string;
  uploadedUserId: number;
  sizeBytes: number;
};

export type CreateFirebaseFileDTO = {
  originalFileName: string;
  uploadedUserId: number;
  sizeBytes: number;
  localFilePath: string;      // path on disk where the upload was streamed
  contentType: string;
};
```
Re-export from `backend/typescript/types/index.ts`.

**File: `backend/typescript/services/interfaces/IFirebaseFileService.ts`** (new)
```ts
interface IFirebaseFileService {
  getFirebaseFileById(id: string): Promise<FirebaseFileDTO>;
  createFirebaseFile(input: CreateFirebaseFileDTO): Promise<FirebaseFileDTO>;
  deleteFirebaseFileById(id: string): Promise<void>;
  getSignedUrl(storagePath: string, expirationMinutes?: number): Promise<string>;
}
```

### 1.2 New: FirebaseFileService implementation

**File: `backend/typescript/services/implementations/firebaseFileService.ts`** (new)

Responsibilities:
- Constructor takes a `IFileStorageService` (inject from resolver, same pattern as `EntityService`).
- `createFirebaseFile`:
  1. Generate `storagePath = \`interview-notes/${uuidv4()}-${originalFileName}\``. Use `uuid` (already a transitive dep — verify with `grep '"uuid"' package.json`; if missing, replace with `crypto.randomUUID()`).
  2. `await fileStorageService.createFile(storagePath, localFilePath, contentType)`.
  3. Insert `FirebaseFile` row: `await FirebaseFile.create({ storage_path, original_file_name, uploaded_user_id, size_bytes })`.
  4. If DB insert fails, roll back Firebase: `await fileStorageService.deleteFile(storagePath).catch(log)`.
  5. Return DTO via `toFirebaseFileDTO`.
- `getFirebaseFileById`: `findByPk` → throw if not found → map to DTO.
- `deleteFirebaseFileById`: load row → `fileStorageService.deleteFile(storage_path)` → `row.destroy()`. Best-effort: if storage delete fails, still destroy the DB row and log (per master plan §4.4 step 5 — replace semantics shouldn't fail the user's upload because cleanup hiccupped).
- `getSignedUrl`: thin wrapper over `fileStorageService.getFile`.

Add `toFirebaseFileDTO(model)` in `backend/typescript/utilities/dtoUtils.ts`.

### 1.3 Extend `InterviewCompositeService`

**File: `backend/typescript/services/interfaces/IInterviewCompositeService.ts`**

Append (do **not** reorder existing methods — workstream A may also append here):
```ts
getInterviewNotesByApplicantRecordId(
  interviewedApplicantRecordId: string,
): Promise<InterviewNotesDTO | null>;

uploadInterviewNotes(
  interviewedApplicantRecordId: string,
  uploadedUserId: number,
  upload: { localFilePath: string; originalFileName: string; sizeBytes: number; contentType: string },
): Promise<InterviewNotesDTO>;
```

Add a small DTO in `backend/typescript/types/firebaseFile.ts`:
```ts
export type InterviewNotesDTO = {
  fileId: string;
  fileName: string;     // original_file_name
  signedUrl: string;
};
```

**File: `backend/typescript/services/implementations/interviewCompositeService.ts`**

⚠️ **Conflict mitigation**: do **not** add constructor params. Instantiate as inline `private readonly` fields so workstream A's edits to the same class don't clash:
```ts
private readonly firebaseFileService: IFirebaseFileService =
  new FirebaseFileService(
    new FileStorageService(process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || ""),
  );
private readonly interviewedApplicantRecordsService: IInterviewedApplicantRecordsService =
  new InterviewedApplicantRecordsService();
```

Append two methods (at the bottom of the class):

`getInterviewNotesByApplicantRecordId(id)`:
1. `const record = await this.interviewedApplicantRecordsService.getInterviewedApplicantRecordById(id)`.
2. If `!record.interviewNotesId` → return `null`.
3. `const file = await this.firebaseFileService.getFirebaseFileById(record.interviewNotesId)`.
4. `const signedUrl = await this.firebaseFileService.getSignedUrl(file.storagePath)`.
5. Return `{ fileId: file.id, fileName: file.originalFileName, signedUrl }`.

⚠️ Note: the master plan says "by applicantRecordId" but the existing generic getter takes the `InterviewedApplicantRecord.id`. Workstream A is adding `getInterviewedApplicantRecordByApplicantRecordId`. **Depend on A's resolver here** — change the arg semantics once A lands. To unblock yourself, accept `interviewedApplicantRecordId` (the record's own PK) for now; rename later. Document this in the PR.

`uploadInterviewNotes(id, uploadedUserId, upload)`:
1. `const record = await this.interviewedApplicantRecordsService.getInterviewedApplicantRecordById(id)` — also validates existence.
2. **Validate**: `if (upload.contentType !== "application/pdf" || !upload.originalFileName.toLowerCase().endsWith(".pdf")) throw new Error("Only PDF files are accepted.");`
3. `const newFile = await this.firebaseFileService.createFirebaseFile({ originalFileName, uploadedUserId, sizeBytes, localFilePath, contentType: "application/pdf" })`.
4. `await this.interviewedApplicantRecordsService.updateInterviewedApplicantRecord(id, { interviewNotesId: newFile.id })` — **must use the generic update service** (ticket requirement).
5. If `record.interviewNotesId` was set: `await this.firebaseFileService.deleteFirebaseFileById(record.interviewNotesId).catch(log)`. Best-effort cleanup (don't fail mutation if old file already gone).
6. `const signedUrl = await this.firebaseFileService.getSignedUrl(newFile.storagePath)`.
7. Return `{ fileId: newFile.id, fileName: newFile.originalFileName, signedUrl }`.

### 1.4 GraphQL schema additions

**File: `backend/typescript/graphql/types/interviewPageType.ts`** (extend; append at bottom of the `gql` template — don't touch existing fields):
```graphql
type InterviewNotes {
  fileId: ID!
  fileName: String!
  signedUrl: String!
}

extend type Query {
  interviewNotes(interviewedApplicantRecordId: ID!): InterviewNotes
}

extend type Mutation {
  uploadInterviewNotes(
    interviewedApplicantRecordId: ID!
    file: Upload!
  ): InterviewNotes!
}
```

Note: `scalar Upload` is already declared in `entityType.ts` — do **not** redeclare it (will cause a schema error). If you'd like, move it to a new shared `uploadType.ts` later, but for this PR leave it as-is to minimize conflict surface.

**File: `backend/typescript/graphql/resolvers/interviewPageResolvers.ts`**

Append (don't reorder existing resolvers):
```ts
import fs from "fs";
import path from "path";
import os from "os";
import { FileUpload } from "graphql-upload";

// helper — write the upload stream to a temp file and return its path + size
async function streamUploadToTemp(file: FileUpload) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "interview-notes-"));
  const localFilePath = path.join(tempDir, file.filename);
  await new Promise<void>((resolve, reject) => {
    const out = fs.createWriteStream(localFilePath);
    file.createReadStream().pipe(out);
    out.on("finish", () => resolve());
    out.on("error", reject);
  });
  const { size } = fs.statSync(localFilePath);
  return { localFilePath, sizeBytes: size };
}
```

Add to `Query`:
```ts
interviewNotes: (_p, { interviewedApplicantRecordId }) =>
  interviewCompositeService.getInterviewNotesByApplicantRecordId(interviewedApplicantRecordId),
```

Add to `Mutation`:
```ts
uploadInterviewNotes: async (_p, { interviewedApplicantRecordId, file }, context) => {
  const { createReadStream, filename, mimetype } = await file; // FileUpload promise
  const tmp = await streamUploadToTemp({ createReadStream, filename, mimetype } as FileUpload);
  try {
    // userId from context — see auth note below
    const uploadedUserId = await getUserIdFromContext(context);
    return await interviewCompositeService.uploadInterviewNotes(
      interviewedApplicantRecordId,
      uploadedUserId,
      {
        localFilePath: tmp.localFilePath,
        originalFileName: filename,
        sizeBytes: tmp.sizeBytes,
        contentType: mimetype,
      },
    );
  } finally {
    fs.rmSync(tmp.localFilePath, { force: true });
    fs.rmdirSync(path.dirname(tmp.localFilePath));
  }
},
```

Auth: `context.req` is available (see `server.ts`). Use `getAccessToken(req)` from `middlewares/auth.ts` + `AuthService.getUserIdByAccessToken` (or whatever exists — grep `getUserIdByAuthId` callers in `authResolvers.ts` for the pattern). If a clean helper doesn't exist, add `getUserIdFromContext(context)` to a new `backend/typescript/utilities/authUtils.ts`.

### 1.5 Register middleware (`graphql/index.ts`)

Add the two new endpoints to `graphQLMiddlewares.Query` / `Mutation`:
```ts
Query:    { ..., interviewNotes: authorizedByAllRoles() }
Mutation: { ..., uploadInterviewNotes: authorizedByAllRoles() }
```

### 1.6 Tests (`backend/typescript/services/implementations/__tests__/`)

New file `interviewCompositeService.notes.test.ts` (or extend existing test file if one exists for this service):
- `uploadInterviewNotes` happy path → creates `FirebaseFile`, sets `interview_notes_id`, calls `fileStorageService.createFile`.
- Replace path → on second upload, old `FirebaseFile` row destroyed + `fileStorageService.deleteFile` called with old `storage_path`.
- Non-PDF mimetype rejected → no DB row, no storage call, no FK update.
- Old-file cleanup failure does **not** fail the mutation (mock `deleteFile` to throw).
- `getInterviewNotesByApplicantRecordId` returns `null` when `interview_notes_id` is null.

Mock `FirebaseFile` (sequelize model) and `FileStorageService`. Pattern: see existing `interviewedApplicantRecordService.test.ts` for sequelize model mocking.

### 1.7 Backend file checklist

New:
- `types/firebaseFile.ts`
- `services/interfaces/IFirebaseFileService.ts`
- `services/implementations/firebaseFileService.ts`
- `utilities/authUtils.ts` (if no helper exists)
- `services/implementations/__tests__/interviewCompositeService.notes.test.ts`

Modified:
- `types/index.ts` (re-export FirebaseFile DTOs)
- `utilities/dtoUtils.ts` (`toFirebaseFileDTO`)
- `services/interfaces/IInterviewCompositeService.ts` ⚠️ shared w/ A — append only
- `services/implementations/interviewCompositeService.ts` ⚠️ shared w/ A — append only
- `graphql/types/interviewPageType.ts` ⚠️ shared w/ A — append only
- `graphql/resolvers/interviewPageResolvers.ts` ⚠️ shared w/ A — append only
- `graphql/index.ts` ⚠️ shared w/ A — add two middleware entries

---

## 2. Frontend changes

### 2.1 Dependencies

In `frontend/package.json`:
```
"apollo-upload-client": "^17.0.0",
"react-dropzone": "^14.2.3",
"@types/apollo-upload-client": "^17.0.2" (devDep)
```

Run `yarn install` and commit `yarn.lock` in the **same commit** as the `package.json` change. Ping partner immediately so they can `yarn install`.

### 2.2 Swap Apollo `HttpLink` → `createUploadLink`

**File: `frontend/client.ts`**
```ts
import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  headers: { "Apollo-Require-Preflight": "true" }, // CSRF preflight
});

// authLink unchanged

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, uploadLink as any]),
});
```

`createUploadLink` is drop-in compatible with non-upload ops, so workstream A's score mutation continues to work. Smoke-test the existing dashboard queries after this swap before pushing.

### 2.3 Codegen

If `Upload` ends up typed as `any` (run `yarn codegen` and check `graphql/__generated__/types.ts`):
```ts
// codegen.ts
generates: {
  "./graphql/__generated__/": {
    preset: "client",
    presetConfig: { gqlTagName: "gql" },
    config: { scalars: { Upload: "File" } },
  },
  // also add { scalars: { Upload: "File" } } under the typescript / typescript-operations blocks
}
```

### 2.4 GraphQL operations

**File: `frontend/graphql/operations/interviewNotes.graphql`** (new)
```graphql
query InterviewNotes($interviewedApplicantRecordId: ID!) {
  interviewNotes(interviewedApplicantRecordId: $interviewedApplicantRecordId) {
    fileId
    fileName
    signedUrl
  }
}
```

**File: `frontend/graphql/operations/uploadInterviewNotes.graphql`** (new)
```graphql
mutation UploadInterviewNotes($interviewedApplicantRecordId: ID!, $file: Upload!) {
  uploadInterviewNotes(interviewedApplicantRecordId: $interviewedApplicantRecordId, file: $file) {
    fileId
    fileName
    signedUrl
  }
}
```

Run `yarn codegen`. Commit the generated diff in the **same commit** as the `.graphql` files.

### 2.5 API client

**File: `frontend/APIClients/InterviewAssessmentAPIClient.ts`**

⚠️ Workstream A will also create / extend this file. To avoid conflicts, either:
- (a) If A has already created it: append your two static methods at the bottom of the class, don't touch their imports/methods, OR
- (b) If A hasn't created it: use a **separate** file `InterviewNotesAPIClient.ts` to fully decouple. Recommended.

Suggested approach: separate `InterviewNotesAPIClient.ts`:
```ts
class InterviewNotesAPIClient {
  static async getInterviewNotes(interviewedApplicantRecordId: string) {
    await BaseAPIClient.handleAuthRefresh();
    const { data } = await client.query<...>({
      query: InterviewNotesDocument,
      variables: { interviewedApplicantRecordId },
      fetchPolicy: "network-only",
    });
    return data?.interviewNotes ?? null;
  }

  static async uploadInterviewNotes(interviewedApplicantRecordId: string, file: File) {
    await BaseAPIClient.handleAuthRefresh();
    const { data } = await client.mutate<...>({
      mutation: UploadInterviewNotesDocument,
      variables: { interviewedApplicantRecordId, file },
      context: { hasUpload: true }, // not strictly required but explicit
    });
    if (!data?.uploadInterviewNotes) throw new Error("Upload failed");
    return data.uploadInterviewNotes;
  }
}
```

### 2.6 `NotesUploader` component

**File: `frontend/pages/interview/_components/assessment/NotesUploader.tsx`** (new)

Props:
```ts
type Props = {
  interviewedApplicantRecordId: string;
  onUploadingChange?: (isUploading: boolean) => void; // lets parent disable footer
};
```

State machine (local React state):
- `IDLE` (no existing notes, dropzone empty)
- `FILLED` (notes present — show filename + View + Replace)
- `UPLOADING` (spinner + filename)
- `ERROR` (non-PDF, oversized, or server error — show message + retry)

Lifecycle:
1. `useEffect` on mount: `InterviewNotesAPIClient.getInterviewNotes(id)` → `setNotes(...)` → either `IDLE` or `FILLED`.
2. `react-dropzone` config:
   ```ts
   const { getRootProps, getInputProps, isDragActive } = useDropzone({
     accept: { "application/pdf": [".pdf"] },
     maxFiles: 1,
     maxSize: 25 * 1024 * 1024, // mirror backend cap; document if backend doesn't enforce
     onDropAccepted: handleDrop,
     onDropRejected: handleReject,
     disabled: state === "UPLOADING",
   });
   ```
3. `handleDrop(files)`:
   - Set `UPLOADING`. `onUploadingChange?.(true)`.
   - `await InterviewNotesAPIClient.uploadInterviewNotes(id, files[0])`.
   - On success: `setNotes(result)` → `FILLED`. `onUploadingChange?.(false)`.
   - On error: `ERROR` with message. `onUploadingChange?.(false)`.
4. `handleReject(rejections)`: show "Only PDF files are accepted." error, stay in current state.
5. **Replace** button in `FILLED` view: programmatically opens picker (`open()` from `useDropzone`) — the existing file stays visible until the new one resolves.
6. **View** button: opens `notes.signedUrl` in new tab.

Styling per Figma. Use MUI (already present) + Tailwind classes consistent with `ScoresPanel.tsx`.

### 2.7 Wire-up in the assessment page

**File: `frontend/pages/interview/[applicantRecordId]/assessment/index.tsx`**

⚠️ Shared with workstream A. Minimize edits:
- Replace the `<p>Assessment Notes content goes here.</p>` block with:
  ```tsx
  case NOTES: {
    const applicantRecordId = router.query.applicantRecordId as string;
    // TODO: once A's `getInterviewedApplicantRecordByApplicantRecordId` resolver lands,
    // resolve the InterviewedApplicantRecord.id here. For now you can either:
    //   (a) accept that the route param IS the interviewedApplicantRecordId (temporary), OR
    //   (b) call A's getInterviewedApplicantRecord(applicantRecordId) and pass `.id` down.
    return (
      <PanelLayout title="Interview Assessment" subtitle="Upload interview notes">
        <NotesUploader
          interviewedApplicantRecordId={resolvedId}
          onUploadingChange={setIsUploading}
        />
      </PanelLayout>
    );
  }
  ```
- Wire `isUploading` into the `<AssessmentFooter/>` to disable "Submit & Finish" while a PDF is mid-flight. The current `AssessmentFooter` is internal to this file — add an `isContinueDisabled` prop on `InterviewFooter` (check if it already exists) or lift state via context.

If `InterviewFooter` doesn't support disabling continue, that's a one-line prop add — coordinate with partner if they touched `_components/layout` recently.

### 2.8 Frontend file checklist

New:
- `frontend/graphql/operations/interviewNotes.graphql`
- `frontend/graphql/operations/uploadInterviewNotes.graphql`
- `frontend/APIClients/InterviewNotesAPIClient.ts`
- `frontend/pages/interview/_components/assessment/NotesUploader.tsx`

Modified:
- `frontend/client.ts` (HttpLink → createUploadLink)
- `frontend/package.json`, `frontend/yarn.lock` (new deps)
- `frontend/codegen.ts` (scalar map, if needed)
- `frontend/graphql/__generated__/*` (regenerated)
- `frontend/pages/interview/[applicantRecordId]/assessment/index.tsx` ⚠️ shared w/ A — small surgical edit to NOTES case + footer wiring
- (Maybe) `frontend/pages/interview/_components/layout/InterviewFooter.tsx` to add `continueDisabled` prop

---

## 3. Suggested commit order on `feat/interview-assessment`

1. `feat(backend): firebase file service + DTO`
2. `feat(backend): interview notes composite query + upload mutation`
3. `test(backend): cover upload, replace, non-PDF rejection`
4. `chore(frontend): add apollo-upload-client + react-dropzone, swap to upload link`  ← push & ping partner immediately
5. `feat(frontend): interview notes graphql ops + api client`
6. `feat(frontend): NotesUploader component + assessment page wire-up`

Keep each commit independently buildable. Run `yarn tsc` / `yarn lint` before pushing.

---

## 4. Risks & open questions

- **Auth context helper**: confirm there's a clean way to get the current user id inside a resolver. If not, add `getUserIdFromContext` once and use it. Don't reinvent per-resolver.
- **`updateInterviewedApplicantRecord` side-effects**: writing `{ interviewNotesId: newId }` should not clobber `status` etc., but verify with a test before relying on it. If it does clobber, fix the service to spread-only-defined-fields before calling `.update`.
- **Max file size**: backend currently has no hard cap (apollo-server v2 default is generous). Add `?` — check `apollo-server-express` v2 defaults; if needed, configure `uploads: { maxFileSize: 25 * 1024 * 1024 }` on the `ApolloServer` constructor. Note this is a `server.ts` edit, which workstream A may also touch — coordinate.
- **`Apollo-Require-Preflight` header**: required by graphql-upload v12+ for CSRF. Without it, the backend rejects multipart uploads. apollo-upload-client v17 sets it automatically; set explicitly to be safe.
- **Temp file cleanup on error**: the resolver uses `try/finally` to remove temp files — make sure all paths hit the `finally` (including validation failures inside the service).
- **Concurrent uploads on the same record**: if a user double-clicks Replace, the second upload may race the first cleanup. Either disable the dropzone while `UPLOADING` (planned — §2.6) or accept the eventual-consistency outcome.
- **PDF "validation" is just mimetype**: not a real PDF parse. Acceptable per ticket AC, but a malicious renamed file would slip through. Out of scope.

---

## 5. Coordination reminders for shared files with workstream A

Per `docs/interview-assessment-feature-plan.md` §8:
- `interviewPageType.ts`, `interviewPageResolvers.ts`, `IInterviewCompositeService.ts`, `interviewCompositeService.ts`, `graphql/index.ts` — **append only**, never reorder.
- `interviewCompositeService.ts` constructor — **don't add params**, use inline `private readonly` fields.
- `assessment/index.tsx` — surgical edit to the NOTES case only.
- `InterviewAssessmentAPIClient.ts` — use a **separate** `InterviewNotesAPIClient.ts` file instead.
- `client.ts` swap to `createUploadLink` — push early and notify A, since it affects A's mutations too (smoke-test together).
- Codegen output — commit alongside the `.graphql` change; never split.
