/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './types';

export type GetInterviewGroupByIdQueryVariables = Exact<{
  id: string | number;
}>;


export type GetInterviewGroupByIdQuery = { getInterviewGroupById: { id: string, schedulingLink: string | null, status: string } };

export type GetInterviewedApplicantsByUserIdQueryVariables = Exact<{
  userId: number;
}>;


export type GetInterviewedApplicantsByUserIdQuery = { getInterviewedApplicantsByUserId: Array<{ applicantRecordId: string, interviewStatus: string, applicantFirstName: string, applicantLastName: string }> };

export type GetInterviewersByGroupIdQueryVariables = Exact<{
  groupId: string | number;
}>;


export type GetInterviewersByGroupIdQuery = { getInterviewersByGroupId: Array<{ id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean }> };

export type LoginMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LoginMutation = { login: { id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean, accessToken: string } };

export type LoginWithGoogleMutationVariables = Exact<{
  idToken: string;
}>;


export type LoginWithGoogleMutation = { loginWithGoogle: { id: string, firstName: string, lastName: string, email: string, role: Types.Role, position: string | null, isArchived: boolean, accessToken: string } };

export type RefreshMutationVariables = Exact<{
  refreshToken: string;
}>;


export type RefreshMutation = { refresh: string };

export type ReportReviewConflictMutationVariables = Exact<{
  applicantRecordId: string;
  reviewerId: number;
}>;


export type ReportReviewConflictMutation = { reportReviewConflict: { applicantRecordId: string, reviewerId: number, status: string, score: number | null, reviewerHasConflict: boolean } };

export type UpdateInterviewGroupMutationVariables = Exact<{
  id: string | number;
  interviewGroup: Types.UpdateInterviewGroupDto;
}>;


export type UpdateInterviewGroupMutation = { updateInterviewGroup: { id: string, schedulingLink: string | null, status: string } };
