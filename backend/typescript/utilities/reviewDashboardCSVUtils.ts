import ApplicantRecord from "../models/applicantRecord.model";
import { Review } from "../types";

/** The dashboard always shows two reviewer columns, so the CSV keeps at least two. */
const MIN_REVIEWER_SLOTS = 2;

const APPLICANT_FIELDS = [
  "First Name",
  "Last Name",
  "Email",
  "Pronouns",
  "Program",
  "Academic Year",
  "Academic or Co-op",
  "Term",
  "Times Applied",
  "Resume URL",
  "Role",
  "Choice",
  "Status",
  "Skill Category",
  "Bookmarked",
  "Total Review Score",
];

const REVIEWER_FIELD_SUFFIXES = [
  "Name",
  "Email",
  "Review Status",
  "PFSG",
  "Team Player",
  "D2L",
  "Skill",
  "Skill Category",
  "Comments",
];

type CSVValue = string | number;
export type ReviewDashboardCSVRow = Record<string, CSVValue>;

/** Missing values become blank cells rather than "null" or "undefined". */
const toCell = (value: string | number | null | undefined): CSVValue =>
  value ?? "";

export const getReviewerSlotCount = (
  applicantRecords: ApplicantRecord[],
): number =>
  Math.max(
    MIN_REVIEWER_SLOTS,
    ...applicantRecords.map(
      (record) => record.reviewed_applicant_records?.length ?? 0,
    ),
  );

export const getReviewDashboardCSVFields = (
  reviewerSlots: number,
): string[] => [
  ...APPLICANT_FIELDS,
  ...Array.from({ length: reviewerSlots }, (_, index) =>
    REVIEWER_FIELD_SUFFIXES.map((suffix) => `Reviewer ${index + 1} ${suffix}`),
  ).flat(),
];

/**
 * Flattens an applicant record (with its applicant and reviews loaded) into one
 * CSV row. Reviews fill `Reviewer N` slots in the order they were loaded;
 * unused slots are left blank so every row has the same columns.
 */
export const toReviewDashboardCSVRow = (
  applicantRecord: ApplicantRecord,
  reviewerSlots: number,
): ReviewDashboardCSVRow => {
  const { applicant } = applicantRecord;
  const row: ReviewDashboardCSVRow = {
    "First Name": toCell(applicant.first_name),
    "Last Name": toCell(applicant.last_name),
    Email: toCell(applicant.email),
    Pronouns: toCell(applicant.pronouns),
    Program: toCell(applicant.program),
    "Academic Year": toCell(applicant.academic_year),
    "Academic or Co-op": toCell(applicant.academic_or_coop),
    Term: toCell(applicant.term),
    "Times Applied": toCell(applicant.times_applied),
    "Resume URL": toCell(applicant.resume_url),
    Role: toCell(applicantRecord.position),
    Choice: toCell(applicantRecord.choice),
    Status: toCell(applicantRecord.status),
    "Skill Category": toCell(applicantRecord.skill_category),
    Bookmarked: String(applicantRecord.is_applicant_flagged),
    "Total Review Score": toCell(applicantRecord.combined_review_score),
  };

  const reviews = applicantRecord.reviewed_applicant_records ?? [];
  for (let index = 0; index < reviewerSlots; index += 1) {
    const reviewedRecord = reviews[index];
    const reviewer = reviewedRecord?.reviewer;
    const review: Review = reviewedRecord?.review ?? {};
    const prefix = `Reviewer ${index + 1}`;

    row[`${prefix} Name`] = reviewer
      ? toCell(`${reviewer.first_name} ${reviewer.last_name}`)
      : "";
    row[`${prefix} Email`] = toCell(reviewer?.email);
    row[`${prefix} Review Status`] = toCell(reviewedRecord?.status);
    row[`${prefix} PFSG`] = toCell(review.passionFSG);
    row[`${prefix} Team Player`] = toCell(review.teamPlayer);
    row[`${prefix} D2L`] = toCell(review.desireToLearn);
    row[`${prefix} Skill`] = toCell(review.skill);
    row[`${prefix} Skill Category`] = toCell(review.skillCategory);
    row[`${prefix} Comments`] = toCell(review.comments);
  }

  return row;
};
