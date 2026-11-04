import { PopulateApplicantRecordsResult } from "../../types";

interface IApplicantIngestionService {
  /**
   * Fetch all applications for a term from the UWBlueprint Firebase Realtime
   * Database and persist them as applicants and applicant records. The import
   * is all-or-nothing, and applicants already ingested for the term (matched on
   * email) are skipped, so re-running a term is safe.
   * @param term the recruitment term to ingest, e.g. "Fall 2023"
   * @returns counts of what was created and which applicants were skipped
   * @throws Error if the term is blank, the fetch fails, an application cannot
   * be parsed, or an applied-for role has no matching position
   */
  populateApplicantRecords(
    term: string,
  ): Promise<PopulateApplicantRecordsResult>;
}

export default IApplicantIngestionService;
