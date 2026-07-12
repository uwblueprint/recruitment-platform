/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './types';

export type AdminCommentsByApplicantRecordIdQueryVariables = Exact<{
  applicantRecordId: string | number;
}>;


export type AdminCommentsByApplicantRecordIdQuery = { adminCommentsByApplicantRecordId: Array<{ id: string, userId: string, applicantRecordId: string, comment: string, createdAt: string, updatedAt: string }> };

export type ApplicationQueryVariables = Exact<{
  applicantRecordId: string | number;
}>;


export type ApplicationQuery = { application: { id: string, academicOrCoop: string, academicYear: string, email: string, firstName: string, lastName: string, heardFrom: string, locationPreference: string, program: string, pronouns: string, pronounsSpecified: string, resumeUrl: string, status: Types.ApplicationStatus, term: string, timesApplied: string, roleSpecificQuestions: Array<{ question: string, answer: string }>, shortAnswerQuestions: Array<{ question: string, answer: string }> } };

export type CreateAdminCommentMutationVariables = Exact<{
  adminComment: Types.CreateAdminCommentDto;
}>;


export type CreateAdminCommentMutation = { createAdminComment: { id: string, userId: string, applicantRecordId: string, comment: string, createdAt: string, updatedAt: string } };

export type DeleteAdminCommentByIdMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteAdminCommentByIdMutation = { deleteAdminCommentById: { id: string } };

export type InterviewDashboardQueryVariables = Exact<{
  pageNumber: number;
  resultsPerPage: number;
}>;


export type InterviewDashboardQuery = { interviewDashboard: Array<{ applicantRecordId: string, firstName: string, lastName: string, position: string, applicationStatus: Types.ApplicationStatus, interviewScore: number | null, interviewers: Array<{ firstName: string, lastName: string }> }> };

export type InterviewGroupQueryVariables = Exact<{
  id: string | number;
}>;


export type InterviewGroupQuery = { interviewGroup: { id: string, schedulingLink: string | null, status: Types.InterviewGroupStatus } };

export type InterviewedApplicantsByUserIdQueryVariables = Exact<{
  userId: string | number;
}>;


export type InterviewedApplicantsByUserIdQuery = { interviewedApplicantsByUserId: Array<{ applicantRecordId: string, interviewStatus: Types.InterviewStatus, applicantFirstName: string, applicantLastName: string }> };

export type InterviewedPairingsByUserIdQueryVariables = Exact<{
  userId: string | number;
}>;


export type InterviewedPairingsByUserIdQuery = { interviewedPairingsByUserId: Array<{ interviewedGroupId: string, interviewGroupStatus: Types.InterviewGroupStatus, groupMembers: Array<{ id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean }> }> };

export type InterviewersByGroupIdQueryVariables = Exact<{
  groupId: string | number;
}>;


export type InterviewersByGroupIdQuery = { interviewersByGroupId: Array<{ id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean }> };

export type IsAuthorizedByRoleQueryVariables = Exact<{
  accessToken: string;
  roles: Array<Types.Role> | Types.Role;
}>;


export type IsAuthorizedByRoleQuery = { isAuthorizedByRole: boolean };

export type LoginMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LoginMutation = { login: { id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean, accessToken: string } };

export type LoginWithGoogleMutationVariables = Exact<{
  idToken: string;
}>;


export type LoginWithGoogleMutation = { loginWithGoogle: { id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean, accessToken: string, refreshToken: string } };

export type RefreshMutationVariables = Exact<{
  refreshToken: string;
}>;


export type RefreshMutation = { refresh: string };

export type ReportInterviewConflictMutationVariables = Exact<{
  interviewedApplicantRecordId: string | number;
  interviewerId: string | number;
  interviewHasConflict: Types.InterviewConflict;
}>;


export type ReportInterviewConflictMutation = { reportInterviewConflict: { id: string, status: Types.InterviewStatus } };

export type ReportReviewConflictMutationVariables = Exact<{
  applicantRecordId: string | number;
  reviewerId: string | number;
}>;


export type ReportReviewConflictMutation = { reportReviewConflict: { applicantRecordId: string, reviewerId: string, status: string, score: number | null, reviewerHasConflict: boolean } };

export type ReviewDashboardQueryVariables = Exact<{
  pageNumber: number;
  resultsPerPage: number;
  sortBy?: Types.ReviewDashboardSortBy | null | undefined;
  sortAscending?: boolean | null | undefined;
  view?: Types.DashboardView | null | undefined;
}>;


export type ReviewDashboardQuery = { reviewDashboard: Array<{ applicantRecordId: string, firstName: string, lastName: string, position: string, timesApplied: string, applicationStatus: Types.ApplicationStatus, choice: number, totalScore: number | null, reviewers: Array<{ id: string, firstName: string, lastName: string, email: string, position: string | null, role: Types.Role, isArchived: boolean }> }> };

export type ReviewDashboardApplicantRecordIdsQueryVariables = Exact<{
  sortBy?: Types.ReviewDashboardSortBy | null | undefined;
  sortAscending?: boolean | null | undefined;
}>;


export type ReviewDashboardApplicantRecordIdsQuery = { reviewDashboardApplicantRecordIds: Array<string> };

export type ReviewDashboardSidePanelQueryVariables = Exact<{
  applicantRecordId: string | number;
}>;


export type ReviewDashboardSidePanelQuery = { reviewDashboardSidePanel: { firstName: string, lastName: string, position: string, program: string, academicYear: string, resumeUrl: string, applicationStatus: Types.ApplicationStatus, skillCategory: Types.SkillCategory | null, reviewDetails: Array<{ reviewStatus: Types.ReviewStatus, reviewer: { id: string, firstName: string, lastName: string }, review: { passionFSG: number | null, teamPlayer: number | null, desireToLearn: number | null, skill: number | null, skillCategory: Types.SkillCategory | null, comments: string | null } | null }> } };

export type ReviewedApplicantRecordsByApplicantRecordIdQueryVariables = Exact<{
  applicantRecordId: string | number;
}>;


export type ReviewedApplicantRecordsByApplicantRecordIdQuery = { reviewedApplicantRecordsByApplicantRecordId: { applicantRecord: { id: string, position: string, combinedReviewScore: number | null }, reviewedApplicantRecords: Array<{ reviewer: { id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean }, reviewedApplicantRecord: { status: string, score: number | null, reviewerHasConflict: boolean, review: { passionFSG: number | null, teamPlayer: number | null, desireToLearn: number | null, skill: number | null, skillCategory: Types.SkillCategory | null, comments: string | null } | null } }> } };

export type ReviewedApplicantsByUserIdQueryVariables = Exact<{
  userId: string | number;
}>;


export type ReviewedApplicantsByUserIdQuery = { reviewedApplicantsByUserId: Array<{ applicantRecordId: string, reviewStatus: Types.ReviewStatus, applicantFirstName: string, applicantLastName: string }> };

export type UpdateAdminCommentMutationVariables = Exact<{
  id: string | number;
  adminComment: Types.UpdateAdminCommentDto;
}>;


export type UpdateAdminCommentMutation = { updateAdminComment: { id: string, userId: string, applicantRecordId: string, comment: string, createdAt: string, updatedAt: string } };

export type UpdateApplicantRecordStatusMutationVariables = Exact<{
  id: string | number;
  status: Types.ApplicationStatus;
}>;


export type UpdateApplicantRecordStatusMutation = { updateApplicantRecordStatus: { id: string, status: Types.ApplicationStatus } };

export type UpdateInterviewGroupMutationVariables = Exact<{
  id: string | number;
  interviewGroup: Types.UpdateInterviewGroupDto;
}>;


export type UpdateInterviewGroupMutation = { updateInterviewGroup: { id: string, schedulingLink: string | null, status: Types.InterviewGroupStatus } };

export type UpdateInterviewGroupSchedulingLinkMutationVariables = Exact<{
  id: string | number;
  schedulingLink: string;
}>;


export type UpdateInterviewGroupSchedulingLinkMutation = { updateInterviewGroupSchedulingLink: { id: string, schedulingLink: string | null, status: Types.InterviewGroupStatus } };
