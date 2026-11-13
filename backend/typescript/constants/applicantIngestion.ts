// Mappings from the UWBlueprint applicant Firebase export to our own schema.
// Shared by the ingestion service and the applicant seed factory so both stay
// in sync.

export const TIMES_APPLIED_MAP = {
  "This is my first time!": 1,
  Once: 2,
  Twice: 3,
  "3 or more": 4,
} as const;

/**
 * Firebase export role labels whose `positions.title` (FK target) differs.
 * Any label not listed here is assumed to match `positions.title` exactly.
 */
export const POSITION_TITLE_BY_EXPORT_ROLE: Record<string, string> = {
  "Product Designer": "Designer",
  "Project Developer": "Developer",
  "VP Finance & Operations": "VP Finance",
  "VP Project Scoping": "VP Scoping",
};

export const positionTitleForExportRole = (exportRole: string): string =>
  POSITION_TITLE_BY_EXPORT_ROLE[exportRole] ?? exportRole;
