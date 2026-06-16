import {
  AcademicOrCoop,
  AdminCommentDTO,
  ApplicantDTO,
  ApplicantRecordDTO,
  ApplicationDTO,
  InterviewDelegationDTO,
  InterviewGroupDTO,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
  Review,
  ReviewDashboardRowDTO,
  ReviewDashboardSidePanelDTO,
  ReviewedApplicantRecordDTO,
  ReviewedApplicantRecordWithReviewerDTO,
  ReviewedApplicantsDTO,
  ReviewStatus,
  SkillCategory,
  UserDTO,
} from "../types";
import AdminComment from "../models/adminComment.model";
import Applicant from "../models/applicant.model";
import ApplicantRecord from "../models/applicantRecord.model";
import InterviewDelegation from "../models/interviewDelegation.model";
import InterviewGroup from "../models/interviewGroup.model";
import InterviewedApplicantRecord from "../models/interviewedApplicantRecord.model";
import ReviewedApplicantRecord from "../models/reviewedApplicantRecord.model";
import User from "../models/user.model";

export function toUserDTO(model: User): UserDTO {
  return {
    id: String(model.id),
    firstName: model.first_name,
    lastName: model.last_name,
    email: model.email,
    position: model.position,
    role: model.role,
    isArchived: model.is_archived,
  };
}

function toShortAnswerQuestions(
  raw: { question: string; response?: string; answer?: string }[] | undefined,
): { question: string; answer: string }[] {
  return (raw ?? []).map(({ question, response, answer }) => ({
    question,
    answer: answer ?? response ?? "",
  }));
}

export function toApplicantRecordDTO(
  model: ApplicantRecord,
): ApplicantRecordDTO {
  return {
    id: model.id,
    applicantId: model.applicant_id,
    position: model.position,
    roleSpecificQuestions: toShortAnswerQuestions(
      model.role_specific_questions,
    ),
    choice: model.choice,
    status: model.status,
    skillCategory: model.skill_category,
    combinedReviewScore: model.combined_review_score,
    isApplicantFlagged: model.is_applicant_flagged,
  };
}

export function toApplicantDTO(model: Applicant): ApplicantDTO {
  return {
    id: model.id,
    firstName: model.first_name,
    lastName: model.last_name,
    email: model.email,
    academicOrCoop: model.academic_or_coop as AcademicOrCoop,
    academicYear: model.academic_year,
    heardFrom: model.heard_from,
    locationPreference: model.location_preference,
    program: model.program,
    pronouns: model.pronouns,
    resumeUrl: model.resume_url,
    timesApplied: model.times_applied,
    shortAnswerQuestions: toShortAnswerQuestions(model.short_answer_questions),
    term: model.term,
    submittedAt: model.submitted_at,
  };
}

export function toInterviewGroupDTO(model: InterviewGroup): InterviewGroupDTO {
  return {
    id: model.id,
    schedulingLink: model.scheduling_link,
    status: model.status,
  };
}

export function toInterviewedApplicantRecordDTO(
  model: InterviewedApplicantRecord,
): InterviewedApplicantRecordDTO {
  return {
    id: model.id,
    applicantRecordId: model.applicant_record_id,
    score: model.score,
    interviewJson: model.interview_json,
    status: model.status,
    interviewNotesId: model.interview_notes_id,
    interviewDate: model.interview_date,
  };
}

export function toInterviewDelegationDTO(
  model: InterviewDelegation,
): InterviewDelegationDTO {
  return {
    interviewedApplicantRecordId: model.interviewed_applicant_record_id,
    interviewerId: String(model.interviewer_id),
    groupId: model.group_id,
    interviewHasConflict: model.interview_has_conflict,
  };
}

export function toAdminCommentDTO(model: AdminComment): AdminCommentDTO {
  return {
    id: model.id,
    userId: model.user_id,
    applicantRecordId: model.applicant_record_id,
    comment: model.comment,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export function toReviewedApplicantRecordDTO(
  model: ReviewedApplicantRecord,
): ReviewedApplicantRecordDTO {
  return {
    applicantRecordId: model.applicant_record_id,
    reviewerId: String(model.reviewer_id),
    review: model.review as Review,
    status: model.status,
    score: model.score,
    reviewerHasConflict: model.reviewer_has_conflict,
  };
}

export function toReviewedApplicantRecordWithReviewerDTO(
  model: ReviewedApplicantRecord,
): ReviewedApplicantRecordWithReviewerDTO {
  if (!model.reviewer) {
    throw new Error(
      `ReviewedApplicantRecord (applicant_record_id=${model.applicant_record_id}, reviewer_id=${model.reviewer_id}) is missing its reviewer association.`,
    );
  }
  return {
    reviewer: toUserDTO(model.reviewer),
    reviewedApplicantRecord: toReviewedApplicantRecordDTO(model),
  };
}

export function toApplicationDTO(
  applicant: ApplicantDTO,
  applicantRecord: ApplicantRecordDTO,
): ApplicationDTO {
  return {
    id: applicant.id,
    academicOrCoop: applicant.academicOrCoop,
    academicYear: applicant.academicYear,
    email: applicant.email,
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    heardFrom: applicant.heardFrom,
    locationPreference: applicant.locationPreference,
    program: applicant.program,
    timesApplied: applicant.timesApplied.toString(),
    pronouns: applicant.pronouns,
    pronounsSpecified: applicant.pronouns,
    resumeUrl: applicant.resumeUrl,
    roleSpecificQuestions: applicantRecord.roleSpecificQuestions,
    shortAnswerQuestions: applicant.shortAnswerQuestions,
    status: applicantRecord.status,
    term: applicant.term,
    submittedAt: applicant.submittedAt,
  };
}

export function toReviewedApplicantDTO(
  model: ReviewedApplicantRecord,
): ReviewedApplicantsDTO {
  return {
    applicantRecordId: model.applicant_record_id,
    reviewStatus: model.status,
    applicantFirstName: model.applicant_record.applicant.first_name,
    applicantLastName: model.applicant_record.applicant.last_name,
  };
}

export function toReviewDashboardSidePanelDTO(
  applicantRecord: ApplicantRecord,
  reviewedApplicantRecords: ReviewedApplicantRecord[],
): ReviewDashboardSidePanelDTO {
  const reviewDetails = reviewedApplicantRecords?.map(
    (reviewedApplicantRecord) => ({
      reviewer: toUserDTO(reviewedApplicantRecord.reviewer),
      review: reviewedApplicantRecord.review as Review,
      reviewStatus: reviewedApplicantRecord.status as ReviewStatus,
    }),
  );

  return {
    firstName: applicantRecord.applicant.first_name,
    lastName: applicantRecord.applicant.last_name,
    position: applicantRecord.position,
    program: applicantRecord.applicant.program,
    resumeUrl: applicantRecord.applicant.resume_url,
    applicationStatus: applicantRecord.status,
    skillCategory: applicantRecord.skill_category as SkillCategory,
    reviewDetails,
  };
}

export function toReviewDashboardRowDTO(
  applicantRecord: ApplicantRecord,
): ReviewDashboardRowDTO {
  return {
    applicantRecordId: applicantRecord.id,
    firstName: applicantRecord.applicant.first_name,
    lastName: applicantRecord.applicant.last_name,
    position: applicantRecord.position,
    timesApplied: applicantRecord.applicant.times_applied.toString(),
    applicationStatus: applicantRecord.status,
    choice: applicantRecord.choice,
    reviewers: (
      applicantRecord.reviewed_applicant_records ?? []
    ).map((reviewedApplicantRecord) =>
      toUserDTO(reviewedApplicantRecord.reviewer),
    ),
    totalScore: applicantRecord.combined_review_score ?? null,
  };
}

export function toInterviewedApplicantDTO(
  model: InterviewedApplicantRecord,
): InterviewedApplicantsDTO {
  return {
    applicantRecordId: model.applicant_record_id,
    interviewStatus: model.status,
    applicantFirstName: model.applicant_record.applicant.first_name,
    applicantLastName: model.applicant_record.applicant.last_name,
  };
}
