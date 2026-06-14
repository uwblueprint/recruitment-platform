# Interview Assessment Flow — Implementation Plan

Ticket goal: build the 3-page interview assessment flow at `/interview/[applicantRecordId]/assessment`, exposing two E2E features:

1. **Score submission** (Scores page → Submitted state)
2. **Interview notes upload** (Notes page) — PDF only, with replace + delete behavior

We'll work on a single feature branch (`feat/interview-assessment`) and open two PRs into it (one per E2E feature), then a final PR from the feature branch into `main`.

---

## 0. Current state of the code (what already exists)

Backend:
- `interviewedApplicantRecord` generic CRUD service + resolver (get, create, update, delete) — `backend/typescript/services/implementations/interviewedApplicantRecordService.ts`, `graphql/resolvers/interviewedApplicantRecordResolvers.ts`. Update already supports `interviewJson` (passionFSG / teamPlayer / desireToLearn / skill / skillCategory / comments), `status`, `interviewNotesId`, `interviewDate`. **Score is auto-derived** from `interviewJson` inside the service — we must not pass `score` directly.
- `FirebaseFile` model + table (`interviewed_applicant_record.interview_notes_id` FK → `firebase_files.id`). No service/resolver wraps it yet.
- `FileStorageService` (`getFile` signed URL, `createFile`, `updateFile`, `deleteFile`) wrapping firebase-admin storage — already present.
- `InterviewCompositeService` (with resolver `interviewPageResolvers`) — this is where we'll add the "get interview notes file" composite query (DB record + Firebase signed URL/name).
- `graphql-upload` is already in `backend/typescript/package.json` but **not wired** into `server.ts` (no `graphqlUploadExpress` middleware, no `Upload` scalar in schema).

Frontend:
- Page shell at `frontend/pages/interview/assessment/index.tsx` with sub-step state machine (`SCORES | NOTES | SUBMITTED`) driven by `InterviewProgressContext`. The two sub-pages are placeholders ("...content goes here.").
- Routing today is `/interview/assessment` (no `[applicantRecordId]` segment yet). The ticket explicitly requires `/interview/[applicantRecordId]/assessment`, so we'll restructure routes.
- API clients pattern in `frontend/APIClients/` — one per resolver group, each calling `client.query/mutate` with codegen-generated typed documents from `frontend/graphql/operations/*.graphql`.
- No dropzone / file uploader exists yet. `@mui/material` v5 already a dep, so we can use `react-dropzone` (lightweight) with MUI styling, mirroring the POC linked in the ticket.

---

## 1. Branching strategy

```
main
 └── feat/interview-assessment              (long-lived feature branch)
      ├── feat/interview-assessment-scores  (PR #1 → feat/interview-assessment)
      └── feat/interview-assessment-notes   (PR #2 → feat/interview-assessment)
```

Final integration PR: `feat/interview-assessment → main` once both sub-PRs are merged and squashed.

---

## 2. Route restructuring (shared prerequisite, lands first on the feature branch)

Move the existing pages under a dynamic segment. This is a small commit on `feat/interview-assessment` before either sub-feature branch is cut.

- Move:
  - `frontend/pages/interview/profile/index.tsx` → `frontend/pages/interview/[applicantRecordId]/profile/index.tsx`
  - `frontend/pages/interview/assessment/index.tsx` → `frontend/pages/interview/[applicantRecordId]/assessment/index.tsx`
  - `frontend/pages/interview/report/index.tsx` → `frontend/pages/interview/[applicantRecordId]/report/index.tsx`
- Update `INTERVIEW_NAV_ITEMS` in `frontend/pages/interview/_components/constants.ts` so each `path` is a function `(applicantRecordId: string) => string`, OR keep the static path and switch the comparison in `InterviewProgressContext` to use `router.pathname` patterns like `/interview/[applicantRecordId]/assessment` (Next.js gives you the template in `pathname`, the value in `query.applicantRecordId`). The latter is less invasive — recommended.
- Update `InterviewNavPanel` link generation to use `router.query.applicantRecordId` when constructing hrefs.
- Update `frontend/pages/interview/index.tsx` (the dashboard) to link into `/interview/${applicantRecordId}/profile`.

Acceptance: visiting `/interview/123/assessment` renders the existing scores/notes/submitted state machine unchanged.

---

## 3. PR #1 — Score submission E2E

### 3.1 Backend

**File: `backend/typescript/services/interfaces/IInterviewCompositeService.ts`**

Add:
```ts
submitInterviewScores(
  interviewedApplicantRecordId: string,
  scores: Interview,
): Promise<InterviewedApplicantRecordDTO>;
```

**File: `backend/typescript/services/implementations/interviewCompositeService.ts`**

Implement `submitInterviewScores` as a thin wrapper that delegates to the generic update service:

```ts
private interviewedApplicantRecordsService = new InterviewedApplicantRecordsService();

async submitInterviewScores(id, scores) {
  // Validation of 1–5 already lives in updateInterviewedApplicantRecord; reuse it.
  return this.interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
    id,
    { interviewJson: scores },
  );
}
```

This satisfies "the query should use the generic `interviewed_applicant_record` update service function". Score recalculation is already handled inside `updateInterviewedApplicantRecord`.

**File: `backend/typescript/graphql/resolvers/interviewPageResolvers.ts`**

Add mutation `submitInterviewScores(id, interviewJson)` calling the new composite method.

**File: `backend/typescript/graphql/types/interviewPageType.ts`**

Extend with:
```graphql
extend type Mutation {
  submitInterviewScores(
    id: ID!
    interviewJson: InterviewInput!
  ): InterviewedApplicantRecord!
}
```
(Reuses `InterviewInput` defined in `interviewedApplicantRecordsType.ts`.)

For the **load existing scores** part of the AC, no new query is needed — the existing `interviewedApplicantRecord(id)` query already returns `interviewJson`.

**Tests** (`backend/typescript/services/implementations/__tests__/`):
- `submitInterviewScores` happy path updates `interview_json` and recomputes `score`.
- Rejects scores outside [1, 5].
- Throws on missing record.

### 3.2 Frontend

**New GraphQL ops** under `frontend/graphql/operations/`:
- `interviewedApplicantRecord.graphql` — `query InterviewedApplicantRecord($id: ID!) { ... id interviewJson { passionFSG teamPlayer desireToLearn skill skillCategory comments } status interviewNotesId ... }`
- `submitInterviewScores.graphql` — `mutation SubmitInterviewScores($id: ID!, $interviewJson: InterviewInput!) { ... }`

Run `yarn codegen` in `frontend/`.

**New API client** `frontend/APIClients/InterviewAssessmentAPIClient.ts`:
- `getInterviewedApplicantRecord(id)` → returns DTO (used by both Scores + Notes sub-pages).
- `submitInterviewScores(id, interviewJson)` → returns updated DTO.

**Score card component** at `frontend/pages/interview/_components/assessment/ScoresPanel.tsx`:
- Rebuild the Figma scoring card. Four 1–5 score selectors (Passion FSG, Team Player, Desire to Learn, Skill), a `SkillCategory` select (enum already exists in schema — confirm in `applicantRecordType.ts`), and a `comments` textarea.
- Local form state initialized from the loaded `interviewJson` (so existing scores show on page load — AC requirement).
- Disable "Submit & Continue" until required fields are filled (mirror Figma).

**Wire-up in `frontend/pages/interview/[applicantRecordId]/assessment/index.tsx`**:
- On mount: read `applicantRecordId` from `router.query`.
- ⚠️ The route param is the `applicantRecordId`, but the API works on `interviewedApplicantRecord.id`. Two options:
  1. Add a backend query `interviewedApplicantRecordByApplicantRecordId(applicantRecordId)` (cleaner — recommended; one tiny extra resolver method).
  2. Resolve it client-side from the existing `interviewedApplicantsByUserId` list. This couples assessment to the dashboard data; avoid.
  
  Going with option 1: add `getInterviewedApplicantRecordByApplicantRecordId` to `IInterviewedApplicantRecordsService` and a `Query.interviewedApplicantRecordByApplicantRecordId(applicantRecordId: ID!)` resolver. Use `InterviewedApplicantRecord.findOne({ where: { applicant_record_id } })`.
- `useEffect` loads the record, hydrates form state.
- On "Submit & Continue": call `submitInterviewScores`, then `setCurrentSubStep(NOTES)`.
- On error: show toast / inline error and stay on SCORES.
- On "Submit & Finish" (from NOTES): the final submit also happens through `submitInterviewScores` only if the user edited scores on NOTES re-entry; otherwise it's a no-op. The "submitted" state is purely UI — backend status transition (e.g., to `COMPLETE`) is **out of scope** for this ticket per the acceptance criteria, but flag this in the PR description for product confirmation.

### 3.3 PR #1 acceptance

- Navigate to `/interview/<applicantRecordId>/assessment`.
- Scores form pre-populates if the record already has `interviewJson` values.
- Submitting persists; reloading the page shows the new values.
- Invalid scores (outside 1–5) rejected by backend with a user-visible error.

---

## 4. PR #2 — Interview notes PDF upload E2E

### 4.1 Backend infrastructure (one-time)

**Wire up `graphql-upload` in `backend/typescript/server.ts`:**
```ts
import { graphqlUploadExpress } from "graphql-upload";
// ...
app.use("/graphql", graphqlUploadExpress({ maxFileSize: 25 * 1024 * 1024, maxFiles: 1 }));
const server = new ApolloServer({ schema, uploads: false, /* ... */ });
```
(`uploads: false` because we use the middleware explicitly, per apollo-server-express v2/v3 conventions.)

**Add `Upload` scalar to schema** — `backend/typescript/graphql/types/uploadType.ts`:
```ts
export default gql`scalar Upload`;
```
And register the resolver in `graphql/resolvers/index.ts`:
```ts
import { GraphQLUpload } from "graphql-upload";
// merge into Query/Mutation root: { Upload: GraphQLUpload, ... }
```

### 4.2 FirebaseFile service & DTOs

**New** `backend/typescript/types/firebaseFile.ts`:
```ts
export type FirebaseFileDTO = {
  id: string;
  storagePath: string;
  originalFileName: string;
  uploadedUserId: number;
  sizeBytes: number;
};
```

**New** `backend/typescript/services/interfaces/IFirebaseFileService.ts`:
- `getFirebaseFileById(id)` → `FirebaseFileDTO`
- `createFirebaseFile(input, fileBuffer, contentType)` → `FirebaseFileDTO`
- `deleteFirebaseFileById(id)` → `void` (deletes from Firebase Storage + DB row)

**New** `backend/typescript/services/implementations/firebaseFileService.ts`:
- Constructor takes a `FileStorageService` instance (bucket from env, same pattern as elsewhere).
- `createFirebaseFile`: persist a stream to a temp path (graphql-upload gives a `createReadStream`), generate `storage_path = interview-notes/${uuid}-${originalFilename}`, call `fileStorageService.createFile(...)`, then insert the `FirebaseFile` row.
- `deleteFirebaseFileById`: load row, call `fileStorageService.deleteFile(storage_path)`, then `row.destroy()`.

**Add resolver** `backend/typescript/graphql/resolvers/firebaseFileResolvers.ts` exposing `firebaseFile(id)` (used internally by the composite query). Not strictly required to be a public endpoint, but useful for tests.

### 4.3 Composite query: get interview notes file

Per the ticket: "you may want to add a new query for this under `interviewComposite`."

**Add to `IInterviewCompositeService`:**
```ts
getInterviewNotesByApplicantRecordId(
  interviewedApplicantRecordId: string,
): Promise<{ fileId: string; fileName: string; signedUrl: string } | null>;
```

**Implementation flow:**
1. `interviewedApplicantRecordsService.getInterviewedApplicantRecordById(id)`.
2. If `interviewNotesId` is null → return `null`.
3. `firebaseFileService.getFirebaseFileById(interviewNotesId)` → grab `original_file_name` + `storage_path`.
4. `fileStorageService.getFile(storage_path)` → signed URL.
5. Return shape above.

**Resolver:** add `interviewNotes(interviewedApplicantRecordId: ID!): InterviewNotes` (where `InterviewNotes { fileId, fileName, signedUrl }`) into `interviewPageResolvers` + `interviewPageType`.

### 4.4 Composite mutation: upload (and replace) interview notes

A single mutation handles both create and replace. Logic must be transactional from the user's perspective: if anything fails, the previous file should remain attached.

**Mutation:** `uploadInterviewNotes(interviewedApplicantRecordId: ID!, file: Upload!): InterviewNotes!`

**Service method `uploadInterviewNotes` on `InterviewCompositeService`:**
1. Read existing `interviewedApplicantRecord`. Capture `existingNotesId = record.interviewNotesId`.
2. Validate file:
   - `mimetype === "application/pdf"` (and check filename ends in `.pdf` as defense in depth).
   - Reject otherwise with a clear error.
3. `await firebaseFileService.createFirebaseFile(...)` → returns new `FirebaseFile`.
4. `await interviewedApplicantRecordsService.updateInterviewedApplicantRecord(id, { interviewNotesId: newFile.id })` (uses the **generic update** service — explicit ticket requirement).
5. If `existingNotesId` was present: `await firebaseFileService.deleteFirebaseFileById(existingNotesId)`. Done **after** step 4 so a failure during upload doesn't orphan the user's notes. Errors here are logged but don't fail the mutation (the new file is already attached).
6. Return `{ fileId, fileName, signedUrl }` like the getter.

Add the mutation to `interviewPageResolvers` + `interviewPageType`.

### 4.5 Tests

- Service: upload happy path inserts row + sets FK; replace path deletes old Firebase file & row; non-PDF rejection.
- Mock `FileStorageService` and `FirebaseFile` model.

### 4.6 Frontend

**Dependencies:** add `react-dropzone` and `apollo-upload-client` to `frontend/package.json`. The existing `client.ts` Apollo setup uses an `HttpLink`; swap to `createUploadLink` from `apollo-upload-client` (drop-in compatible with non-upload ops).

**New GraphQL ops:**
- `interviewNotes.graphql` — `query InterviewNotes($interviewedApplicantRecordId: ID!) { interviewNotes(...) { fileId fileName signedUrl } }`
- `uploadInterviewNotes.graphql` — `mutation UploadInterviewNotes($interviewedApplicantRecordId: ID!, $file: Upload!) { uploadInterviewNotes(...) { fileId fileName signedUrl } }`

Add `scalar Upload` handling to codegen if needed (`scalars: { Upload: 'File' }` in `codegen.ts`).

**API client** `frontend/APIClients/InterviewAssessmentAPIClient.ts` (extend from PR #1):
- `getInterviewNotes(interviewedApplicantRecordId)` → metadata + signed URL or null.
- `uploadInterviewNotes(interviewedApplicantRecordId, file: File)` → returns metadata.

**Component** `frontend/pages/interview/_components/assessment/NotesUploader.tsx`:
- Wraps `react-dropzone` with `accept: { "application/pdf": [".pdf"] }`, `maxFiles: 1`.
- States rendered (driven by local + server state):
  1. **Empty / dropzone idle** — shows the Figma "Drag & drop or browse" UI.
  2. **Dragging** — highlighted dropzone.
  3. **Uploading** — spinner + filename.
  4. **Filled** — shows `fileName` from server, with a "Replace" action that re-opens the dropzone (or directly triggers file picker), and a "View" link to the signed URL.
  5. **Error** — non-PDF, oversized, or network error.
- Client-side guard rejects non-`application/pdf` before hitting the network (matches AC: "Users should only be able to upload PDF files").

**Wire-up in the assessment page:**
- On entering NOTES sub-step, call `getInterviewNotes(...)` to populate initial state.
- On a new file drop: call `uploadInterviewNotes`. While in flight, disable footer's "Submit & Finish".
- After success: refetch / update local cache so the filled state shows the new filename.

### 4.7 PR #2 acceptance

- Drop a PDF on the Notes page → file uploads, name appears, signed URL viewable.
- Drop a non-PDF → blocked client-side with error message; never reaches backend.
- Reload page → existing file's name shown.
- Drop a new PDF over an existing one → DB row + Firebase blob for the old file are deleted, new one is attached.
- The `interviewedApplicantRecord.interviewNotesId` column is updated via the **generic** `updateInterviewedApplicantRecord` service path.

---

## 5. Final integration PR (`feat/interview-assessment` → `main`)

- Manual smoke test of the full flow end-to-end (Scores → Notes → Submitted).
- Verify route param `applicantRecordId` is plumbed everywhere; deep links work.
- Verify codegen output is committed.
- Update `docs/` if any new GraphQL conventions were added (e.g., `Upload` scalar).
- Squash merge into `main`.

---

## 6. Risk & follow-up notes

- **`graphql-upload` + apollo-server v2:** the project pins an older Apollo. Verify CSRF prevention requirements; may need to set `csrfPrevention: false` or include `Apollo-Require-Preflight` header from the client (apollo-upload-client adds it automatically since v17).
- **File size limit / virus scanning:** out of scope, but worth noting in the PR for follow-up.
- **Auth:** `uploaded_user_id` on `firebase_files` requires the current user. Pull from the existing auth context (`req.cookies` / `verifyToken` middleware pattern used in `authResolvers.ts`).
- **"Submitted" terminal state:** confirm with PM whether reaching the SUBMITTED screen should set `status = COMPLETE` on the record. If yes, add a single `updateInterviewedApplicantRecord(id, { status: COMPLETE })` call on "Submit & Finish" (still using the generic update service).
- **`/interview/[applicantRecordId]/assessment`:** make sure the dashboard at `frontend/pages/interview/index.tsx` links into the new dynamic route, otherwise users have no way to reach it.

---

## 7. Suggested commit ordering

On `feat/interview-assessment` (base):
1. `chore(interview): move pages under [applicantRecordId] dynamic segment`

On `feat/interview-assessment-scores` (PR #1):
2. `feat(backend): add submitInterviewScores composite mutation + by-applicantRecordId getter`
3. `feat(frontend): scores panel with load + submit wired to GraphQL`
4. `test(backend): cover submitInterviewScores`

On `feat/interview-assessment-notes` (PR #2):
5. `chore(backend): wire graphql-upload middleware and Upload scalar`
6. `feat(backend): FirebaseFile service + interviewNotes composite query/mutation`
7. `feat(frontend): apollo-upload-client + NotesUploader (PDF-only dropzone)`
8. `test(backend): cover upload, replace, non-PDF rejection`

Each commit small, scoped, and revertible — matches the PR/Commits Grooming Guidelines linked in the ticket.
