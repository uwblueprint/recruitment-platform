// Single source of truth for interview-notes upload validation and storage
// layout on the backend. The frontend duplicates the size and mimetype
// constants at
// `frontend/pages/interview/_components/assessment/constants.ts` so the
// dropzone can reject obviously-bad files locally without a round trip.
// The server is the trust boundary — if you change a value here, mirror it
// on the frontend.

export const INTERVIEW_NOTES_MAX_BYTES = 25 * 1024 * 1024;

export const INTERVIEW_NOTES_ACCEPTED_MIME_TYPE = "application/pdf";

export const INTERVIEW_NOTES_ACCEPTED_EXTENSION = ".pdf";

export const INTERVIEW_NOTES_STORAGE_PREFIX = "interview-notes";

export const INTERVIEW_NOTES_TMP_DIR_PREFIX = "interview-notes-";
