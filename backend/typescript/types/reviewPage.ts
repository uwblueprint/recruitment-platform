import { ShortAnswerQuestion } from "./applicantRecord";
import { ReviewStatus } from "./reviewedApplicantRecord";

export type ApplicationDTO = {
    id: string;
    academicOrCoop: string;
    academicYear: string;
    email: string;
    firstName: string;
    heardFrom: string;
    lastName: string;
    locationPreference: string;
    program: string;
    pronouns: string;
    pronounsSpecified: string;
    resumeUrl: string;
    shortAnswerQuestions: ShortAnswerQuestion[];
    roleSpecificQuestions: ShortAnswerQuestion[];
    status: string;
    term: string;
    timesApplied: string;
    submittedAt: Date;
  };

  export type ReviewedApplicantsDTO = {
    applicantRecordId: string;
    reviewStatus: ReviewStatus;
    applicantFirstName: string;
    applicantLastName: string;
  };
