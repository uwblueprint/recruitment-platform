export type FirebaseShortAnswerQuestion = {
  question: string;
  response?: string | string[];
};

export type FirebaseRoleSpecificQuestions = {
  id?: string;
  role: string;
  questions?: FirebaseShortAnswerQuestion[];
};

/** A single application as stored in the UWBlueprint Firebase Realtime DB. */
export type FirebaseApplication = {
  academicOrCoop: string;
  academicYear: string;
  email: string;
  firstChoiceRole: string;
  firstName: string;
  heardFrom: string;
  lastName: string;
  locationPreference: string;
  program: string;
  pronouns: string;
  pronounsSpecified?: string;
  resumeUrl: string;
  roleSpecificQuestions: FirebaseRoleSpecificQuestions[];
  secondChoiceRole?: string;
  shortAnswerQuestions: FirebaseShortAnswerQuestion[];
  term: string;
  timesApplied: string;
  timestamp: number;
};

export type PopulateApplicantRecordsResult = {
  term: string;
  applicantsCreated: number;
  applicantRecordsCreated: number;
  /** Emails of applicants already ingested for this term, left untouched. */
  skippedExistingEmails: string[];
};
