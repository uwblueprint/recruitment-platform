// Single source of truth for interview-notes upload validation and storage
// layout on the backend. The frontend duplicates the size and mimetype
// constants at
// `frontend/pages/interview/_components/assessment/constants.ts` so the
// dropzone can reject obviously-bad files locally without a round trip.
// The server is the trust boundary — if you change a value here, mirror it
// on the frontend.

/** Maximum size of a single uploaded notes PDF, in bytes. */
export const INTERVIEW_NOTES_MAX_BYTES = 25 * 1024 * 1024;

/** Only mimetype accepted for interview notes uploads. */
export const INTERVIEW_NOTES_ACCEPTED_MIME_TYPE = "application/pdf";

/** Only file extension accepted (lowercased; matched case-insensitively). */
export const INTERVIEW_NOTES_ACCEPTED_EXTENSION = ".pdf";

/** Object-key prefix inside the Firebase Storage bucket. */
export const INTERVIEW_NOTES_STORAGE_PREFIX = "interview-notes";

/** Prefix for the per-upload scratch directory under /tmp. Intentionally
 *  distinct from the storage prefix so `ls /tmp` / `lsof` output stays
 *  unambiguous when debugging in-flight uploads. */
export const INTERVIEW_NOTES_TMP_DIR_PREFIX = "interview-notes-";
