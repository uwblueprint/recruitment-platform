// Mapping from the UWBlueprint applicant Firebase export to our own schema.
// Shared by the ingestion service and the applicant seed factory so both stay
// in sync.

/* eslint-disable-next-line import/prefer-default-export */
export const TIMES_APPLIED_MAP = {
  "This is my first time!": 1,
  Once: 2,
  Twice: 3,
  "3 or more": 4,
} as const;
