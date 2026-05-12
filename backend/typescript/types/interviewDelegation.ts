import { ValueOf } from "../utilities/typingUtils";

export const InterviewConflictEnum = {
  APPLICANT_CONFLICT: "APPLICANT_CONFLICT", // Conflict of interest with the applicant
  APPLICANT_NO_RESPONSE: "APPLICANT_NO_RESPONSE", // Applicant did not respond to the interview request
  PARTNER_NO_RESPONSE: "PARTNER_NO_RESPONSE", // Partner did not respond to the interview request
  CANNOT_ATTEND: "CANNOT_ATTEND", // Cannot make interview
} as const;

export type InterviewConflict = ValueOf<typeof InterviewConflictEnum>;
