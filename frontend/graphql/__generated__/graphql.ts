/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type InterviewConflict =
  | 'APPLICANT_CONFLICT'
  | 'APPLICANT_NO_RESPONSE'
  | 'CANNOT_ATTEND'
  | 'PARTNER_NO_RESPONSE';

export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEWED'
  | 'IN_REVIEW'
  | 'OFFERED'
  | 'REJECTED'
  | 'REVIEWED'
  | 'SELECTED';

export type InterviewGroupStatus =
  | 'AVAILABILITY_PENDING'
  | 'INVITES_SENT'
  | 'READY_TO_INTERVIEW';

export type InterviewStatus =
  | 'COMPLETE'
  | 'CONFLICT_REPORTED'
  | 'IN_PROGRESS'
  | 'NEEDS_REVIEW';

export type ReviewStatus =
  | 'CONFLICT'
  | 'DONE'
  | 'IN_PROGRESS'
  | 'TODO';

export type Role =
  | 'Admin'
  | 'SuperAdmin'
  | 'User';

export type SkillCategory =
  | 'INTERMEDIATE'
  | 'JUNIOR'
  | 'SENIOR';

export type UpdateInterviewGroupDto = {
  schedulingLink?: string | null | undefined;
  status?: InterviewGroupStatus | null | undefined;
};

export type InterviewGroupQueryVariables = Exact<{
  id: string | number;
}>;


export type InterviewGroupQuery = { interviewGroup: { id: string, schedulingLink: string | null, status: InterviewGroupStatus } };

export type InterviewedApplicantsByUserIdQueryVariables = Exact<{
  userId: string | number;
}>;


export type InterviewedApplicantsByUserIdQuery = { interviewedApplicantsByUserId: Array<{ applicantRecordId: string, interviewStatus: InterviewStatus, applicantFirstName: string, applicantLastName: string }> };

export type InterviewersByGroupIdQueryVariables = Exact<{
  groupId: string | number;
}>;


export type InterviewersByGroupIdQuery = { interviewersByGroupId: Array<{ id: string, firstName: string, lastName: string, email: string, role: Role, position: string | null, isArchived: boolean }> };

export type IsAuthorizedByRoleQueryVariables = Exact<{
  accessToken: string;
  roles: Array<Role> | Role;
}>;


export type IsAuthorizedByRoleQuery = { isAuthorizedByRole: boolean };

export type LoginMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LoginMutation = { login: { id: string, firstName: string, lastName: string, email: string, role: Role, position: string | null, isArchived: boolean, accessToken: string } };

export type LoginWithGoogleMutationVariables = Exact<{
  idToken: string;
}>;


export type LoginWithGoogleMutation = { loginWithGoogle: { id: string, firstName: string, lastName: string, email: string, role: Role, position: string | null, isArchived: boolean, accessToken: string, refreshToken: string } };

export type RefreshMutationVariables = Exact<{
  refreshToken: string;
}>;


export type RefreshMutation = { refresh: string };

export type ReportInterviewConflictMutationVariables = Exact<{
  interviewedApplicantRecordId: string | number;
  interviewerId: string | number;
  interviewHasConflict: InterviewConflict;
}>;


export type ReportInterviewConflictMutation = { reportInterviewConflict: { id: string, status: InterviewStatus } };

export type ReportReviewConflictMutationVariables = Exact<{
  applicantRecordId: string | number;
  reviewerId: string | number;
}>;


export type ReportReviewConflictMutation = { reportReviewConflict: { applicantRecordId: string, reviewerId: string, status: string, score: number | null, reviewerHasConflict: boolean } };

export type ReviewedApplicantRecordsByApplicantRecordIdQueryVariables = Exact<{
  applicantRecordId: string | number;
}>;


export type ReviewedApplicantRecordsByApplicantRecordIdQuery = { reviewedApplicantRecordsByApplicantRecordId: Array<{ status: ReviewStatus, score: number | null, reviewerHasConflict: boolean, reviewer: { id: string, firstName: string, lastName: string, email: string, role: Role, position: string | null, isArchived: boolean }, review: { passionFSG: number | null, teamPlayer: number | null, desireToLearn: number | null, skill: number | null, skillCategory: SkillCategory | null, comments: string | null } | null }> };

export type ReviewDashboardQueryVariables = Exact<{
  pageNumber: number;
  resultsPerPage: number;
}>;


export type ReviewDashboardQuery = { reviewDashboard: Array<{ applicantRecordId: string, firstName: string, lastName: string, position: string, timesApplied: string, applicationStatus: ApplicationStatus, choice: number, totalScore: number | null, reviewers: Array<{ id: string, firstName: string, lastName: string, email: string, position: string | null, role: Role, isArchived: boolean }> }> };

export type UpdateInterviewGroupMutationVariables = Exact<{
  id: string | number;
  interviewGroup: UpdateInterviewGroupDto;
}>;


export type UpdateInterviewGroupMutation = { updateInterviewGroup: { id: string, schedulingLink: string | null, status: InterviewGroupStatus } };

export type UpdateInterviewGroupSchedulingLinkMutationVariables = Exact<{
  id: string | number;
  schedulingLink: string;
}>;


export type UpdateInterviewGroupSchedulingLinkMutation = { updateInterviewGroupSchedulingLink: { id: string, schedulingLink: string | null, status: InterviewGroupStatus } };


export const InterviewGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InterviewGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interviewGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schedulingLink"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<InterviewGroupQuery, InterviewGroupQueryVariables>;
export const InterviewedApplicantsByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InterviewedApplicantsByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interviewedApplicantsByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applicantRecordId"}},{"kind":"Field","name":{"kind":"Name","value":"interviewStatus"}},{"kind":"Field","name":{"kind":"Name","value":"applicantFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"applicantLastName"}}]}}]}}]} as unknown as DocumentNode<InterviewedApplicantsByUserIdQuery, InterviewedApplicantsByUserIdQueryVariables>;
export const InterviewersByGroupIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InterviewersByGroupId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interviewersByGroupId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}}]}}]} as unknown as DocumentNode<InterviewersByGroupIdQuery, InterviewersByGroupIdQueryVariables>;
export const IsAuthorizedByRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IsAuthorizedByRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAuthorizedByRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}]}]}}]} as unknown as DocumentNode<IsAuthorizedByRoleQuery, IsAuthorizedByRoleQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LoginWithGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginWithGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const ReportInterviewConflictDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReportInterviewConflict"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interviewedApplicantRecordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interviewerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interviewHasConflict"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InterviewConflict"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reportInterviewConflict"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"interviewedApplicantRecordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interviewedApplicantRecordId"}}},{"kind":"Argument","name":{"kind":"Name","value":"interviewerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interviewerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"interviewHasConflict"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interviewHasConflict"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ReportInterviewConflictMutation, ReportInterviewConflictMutationVariables>;
export const ReportReviewConflictDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReportReviewConflict"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"applicantRecordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reviewerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reportReviewConflict"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"applicantRecordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"applicantRecordId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reviewerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reviewerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applicantRecordId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"reviewerHasConflict"}}]}}]}}]} as unknown as DocumentNode<ReportReviewConflictMutation, ReportReviewConflictMutationVariables>;
export const ReviewedApplicantRecordsByApplicantRecordIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReviewedApplicantRecordsByApplicantRecordId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"applicantRecordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewedApplicantRecordsByApplicantRecordId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"applicantRecordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"applicantRecordId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}},{"kind":"Field","name":{"kind":"Name","value":"review"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passionFSG"}},{"kind":"Field","name":{"kind":"Name","value":"teamPlayer"}},{"kind":"Field","name":{"kind":"Name","value":"desireToLearn"}},{"kind":"Field","name":{"kind":"Name","value":"skill"}},{"kind":"Field","name":{"kind":"Name","value":"skillCategory"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"reviewerHasConflict"}}]}}]}}]} as unknown as DocumentNode<ReviewedApplicantRecordsByApplicantRecordIdQuery, ReviewedApplicantRecordsByApplicantRecordIdQueryVariables>;
export const ReviewDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReviewDashboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resultsPerPage"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewDashboard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"resultsPerPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resultsPerPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applicantRecordId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"timesApplied"}},{"kind":"Field","name":{"kind":"Name","value":"applicationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"choice"}},{"kind":"Field","name":{"kind":"Name","value":"reviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalScore"}}]}}]}}]} as unknown as DocumentNode<ReviewDashboardQuery, ReviewDashboardQueryVariables>;
export const UpdateInterviewGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInterviewGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interviewGroup"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInterviewGroupDTO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInterviewGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"interviewGroup"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interviewGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schedulingLink"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateInterviewGroupMutation, UpdateInterviewGroupMutationVariables>;
export const UpdateInterviewGroupSchedulingLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInterviewGroupSchedulingLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schedulingLink"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInterviewGroupSchedulingLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"schedulingLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schedulingLink"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schedulingLink"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateInterviewGroupSchedulingLinkMutation, UpdateInterviewGroupSchedulingLinkMutationVariables>;