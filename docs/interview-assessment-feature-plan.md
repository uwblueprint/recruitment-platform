# Interview Assessment Flow — Implementation Plan

Ticket goal: build the 3-page interview assessment flow at `/interview/[applicantRecordId]/assessment`, exposing two E2E features:

1. **Score submission** (Scores page → Submitted state)
2. **Interview notes upload** (Notes page) — PDF only, with replace + delete behavior

Both contributors will work directly on a single shared feature branch (`feat/interview-assessment`), then open one PR from that branch into `main` when both E2E features are done.

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
 └── feat/interview-assessment   (single shared branch — both devs commit here)
```

One PR at the end: `feat/interview-assessment → main`.

Working agreement for two people on one branch:
- `git pull --rebase` before starting any work session and before every push.
- Push small, frequently. Don't sit on local commits for hours.
- Coordinate (Slack/DM) before touching any of the shared files called out in §8 below.
- Run `yarn codegen` locally and commit the generated output in the **same commit** as the `.graphql` change that triggered it — never in a separate commit.
- If you hit a non-trivial conflict on pull, stop and resolve together rather than guessing.

---

## 2. Route restructuring (shared prerequisite, do this first, together)

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

## 3. Workstream A — Score submission E2E (one dev)

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

### 3.3 Workstream A acceptance

- Navigate to `/interview/<applicantRecordId>/assessment`.
- Scores form pre-populates if the record already has `interviewJson` values.
- Submitting persists; reloading the page shows the new values.
- Invalid scores (outside 1–5) rejected by backend with a user-visible error.

---

## 4. Workstream B — Interview notes PDF upload E2E (other dev)

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

**API client** `frontend/APIClients/InterviewAssessmentAPIClient.ts` (extend from Workstream A — see §8 for how to avoid conflicting on this file):
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

### 4.7 Workstream B acceptance

- Drop a PDF on the Notes page → file uploads, name appears, signed URL viewable.
- Drop a non-PDF → blocked client-side with error message; never reaches backend.
- Reload page → existing file's name shown.
- Drop a new PDF over an existing one → DB row + Firebase blob for the old file are deleted, new one is attached.
- The `interviewedApplicantRecord.interviewNotesId` column is updated via the **generic** `updateInterviewedApplicantRecord` service path.

---

## 5. Final PR (`feat/interview-assessment` → `main`)

- Both devs do a manual smoke test of the full flow end-to-end (Scores → Notes → Submitted).
- Verify route param `applicantRecordId` is plumbed everywhere; deep links work.
- Verify codegen output is committed and matches a fresh `yarn codegen` run.
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

## 7. Suggested commit ordering (all on `feat/interview-assessment`)

Done together / first, before splitting the work:
1. `chore(interview): move pages under [applicantRecordId] dynamic segment`
2. `chore(backend): wire graphql-upload middleware and Upload scalar` — landing this up front (even though only Workstream B needs it) avoids both devs editing `server.ts` / `resolvers/index.ts` / `types/index.ts` later.

Workstream A (scores):
3. `feat(backend): add submitInterviewScores composite mutation + by-applicantRecordId getter`
4. `feat(frontend): scores panel with load + submit wired to GraphQL`
5. `test(backend): cover submitInterviewScores`

Workstream B (notes):
6. `feat(backend): FirebaseFile service + interviewNotes composite query/mutation`
7. `feat(frontend): apollo-upload-client + NotesUploader (PDF-only dropzone)`
8. `test(backend): cover upload, replace, non-PDF rejection`

Each commit small, scoped, and revertible — matches the PR/Commits Grooming Guidelines linked in the ticket.

---

## 8. Conflict hotspots (read this before you start)

Because both devs are touching the interview-assessment area on the same branch, these files **will** be edited by both workstreams. Be deliberate about them.

### 8.1 High-risk shared files (coordinate before editing)

| File | Why both workstreams touch it | Mitigation |
|---|---|---|
| `backend/typescript/graphql/types/interviewPageType.ts` | A adds `submitInterviewScores`; B adds `interviewNotes` query + `uploadInterviewNotes` mutation + `InterviewNotes` type. | Append-only: each dev adds their `extend type Query` / `extend type Mutation` block at the bottom in a contiguous chunk. Don't reorder existing fields. |
| `backend/typescript/graphql/resolvers/interviewPageResolvers.ts` | Same as above — both add resolver functions. | Add new resolver keys at the end of `Query` / `Mutation` objects. Avoid touching existing ones. |
| `backend/typescript/services/interfaces/IInterviewCompositeService.ts` | Both add new method signatures. | Append new methods at the bottom of the interface. |
| `backend/typescript/services/implementations/interviewCompositeService.ts` | Both add new method implementations + new constructor-injected services (`InterviewedApplicantRecordsService`, `FirebaseFileService`). | Agree up front on constructor signature. Easiest: instantiate sub-services as `private readonly` fields initialized inline (no constructor changes). Add methods at the bottom of the class. |
| `backend/typescript/graphql/resolvers/index.ts` and `backend/typescript/graphql/types/index.ts` | B registers `Upload` scalar + `firebaseFileResolvers`; both may register new type files. | Landed in commit #2 (shared prerequisite). After that, only B adds the firebaseFile resolver entry — A shouldn't need to touch these. |
| `backend/typescript/server.ts` | B adds `graphqlUploadExpress` middleware + `uploads: false` on ApolloServer. | Same — done in shared commit #2 so only one dev touches it. |
| `frontend/APIClients/InterviewAssessmentAPIClient.ts` | A creates it with score methods; B extends it with notes methods. | A lands this file first. B adds notes functions as **new exports at the bottom** of the file, doesn't refactor A's exports. |
| `frontend/pages/interview/[applicantRecordId]/assessment/index.tsx` | A wires Scores submit + load; B wires Notes load/upload + disables footer during upload. | Split clearly: A owns SCORES sub-step + the state-machine transitions, B owns NOTES sub-step. The page should compose two child panels (`<ScoresPanel/>`, `<NotesUploader/>`) so most logic lives in those component files, minimizing edits to `index.tsx` itself. |
| `frontend/graphql/generated/*` (codegen output) | Regenerated by both workstreams. | Always commit codegen output **in the same commit** as the `.graphql` change. Rebase before running codegen. If you hit a conflict here, delete the generated folder and re-run `yarn codegen` rather than hand-merging. |
| `frontend/package.json` / `yarn.lock` | B adds `react-dropzone` + `apollo-upload-client`. | B installs deps in a single dedicated commit, pushes immediately, and pings A to pull + `yarn install`. |
| `frontend/apolloClient.ts` (or wherever `HttpLink` lives) | B swaps `HttpLink` → `createUploadLink`. | Single-line swap by B; A shouldn't need to touch it. |
| `frontend/pages/interview/_components/constants.ts` and `InterviewProgressContext` / `InterviewNavPanel` | Touched by the route-restructuring commit. | Done together in commit #1; afterward, neither workstream should need to edit these. |

### 8.2 Low-risk (each workstream owns its own files)

These are new files; no overlap expected:
- A: `frontend/pages/interview/_components/assessment/ScoresPanel.tsx`, `frontend/graphql/operations/interviewedApplicantRecord.graphql`, `frontend/graphql/operations/submitInterviewScores.graphql`, score-related test files.
- B: `frontend/pages/interview/_components/assessment/NotesUploader.tsx`, `frontend/graphql/operations/interviewNotes.graphql`, `frontend/graphql/operations/uploadInterviewNotes.graphql`, `backend/typescript/services/implementations/firebaseFileService.ts` (+ interface, DTO, resolver, type, tests), `backend/typescript/graphql/types/uploadType.ts`.

### 8.3 Logical (non-textual) conflicts to watch for

These won't show up as git merge conflicts but can still break things:

- **`InterviewedApplicantRecord` GraphQL query shape.** A defines `query InterviewedApplicantRecord` in `interviewedApplicantRecord.graphql`. If B also needs fields from that record on the Notes page, B should **reuse A's query / API client method** rather than defining a second overlapping query — otherwise codegen produces duplicate hooks and the client cache may diverge.
- **`getInterviewedApplicantRecordByApplicantRecordId` resolver.** Added by A but consumed by both sub-pages. B depends on this existing; if A's commit lands late, B will be blocked. Land A's backend commit (#3) before B starts the frontend wire-up.
- **Constructor of `InterviewCompositeService`.** If both devs independently add constructor params for their new sub-services, the resolver instantiation site will conflict. Agree to use inline field initializers (no constructor params) for the new sub-services.
- **`status` transitions on submit.** Both workstreams might independently decide to set `status = COMPLETE` on "Submit & Finish". Per §6, this is out of scope — leave it alone in both workstreams unless explicitly agreed.
- **`apollo-upload-client` upgrade side effects.** Swapping `HttpLink` for `createUploadLink` changes headers (adds `Apollo-Require-Preflight`). A's score mutations go through the same link — A should smoke-test their flow after B lands the swap.
- **Database migrations.** Neither workstream is planned to add a migration (the `firebase_files` table and FK already exist per §0). If you discover you need one, stop and coordinate — concurrent migration files with overlapping timestamps are painful.
- **Tests touching shared mocks/fixtures.** If both workstreams add to a shared `__mocks__` or fixture file for `InterviewedApplicantRecord`, keep additions append-only.

### 8.4 Recommended daily rhythm

1. `git pull --rebase origin feat/interview-assessment`
2. `yarn install` (in `frontend/` and `backend/typescript/`) if `yarn.lock` changed.
3. `yarn codegen` in `frontend/` if any `.graphql` files changed.
4. Work on your slice. Commit. `git pull --rebase` again. Push.
5. If your push is rejected, rebase, re-run codegen, re-run tests, push again.
