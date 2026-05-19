/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type InterviewGroupStatus =
  | 'AVAILABILITY_PENDING'
  | 'INVITES_SENT'
  | 'READY_TO_INTERVIEW';

export type InterviewStatus =
  | 'COMPLETE'
  | 'IN_PROGRESS'
  | 'NEEDS_REVIEW';

export type Role =
  | 'Admin'
  | 'SuperAdmin'
  | 'User';

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

export type ReportReviewConflictMutationVariables = Exact<{
  applicantRecordId: string | number;
  reviewerId: string | number;
}>;


export type ReportReviewConflictMutation = { reportReviewConflict: { applicantRecordId: string, reviewerId: string, status: string, score: number | null, reviewerHasConflict: boolean } };

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
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LoginWithGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginWithGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const ReportReviewConflictDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReportReviewConflict"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"applicantRecordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reviewerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reportReviewConflict"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"applicantRecordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"applicantRecordId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reviewerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reviewerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applicantRecordId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"reviewerHasConflict"}}]}}]}}]} as unknown as DocumentNode<ReportReviewConflictMutation, ReportReviewConflictMutationVariables>;
export const UpdateInterviewGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInterviewGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interviewGroup"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInterviewGroupDTO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInterviewGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"interviewGroup"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interviewGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schedulingLink"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateInterviewGroupMutation, UpdateInterviewGroupMutationVariables>;
export const UpdateInterviewGroupSchedulingLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInterviewGroupSchedulingLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schedulingLink"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInterviewGroupSchedulingLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"schedulingLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schedulingLink"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schedulingLink"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateInterviewGroupSchedulingLinkMutation, UpdateInterviewGroupSchedulingLinkMutationVariables>;