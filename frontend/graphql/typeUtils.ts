import type * as Operations from "./__generated__/operation-types";
import type * as Schema from "./__generated__/types";

/**
 * Re-export schema enums from the generated GraphQL type artifact.
 *
 * Frontend code should import enum values from this file instead of importing
 * from generated files directly. That keeps Codegen file structure isolated
 * behind a stable wrapper.
 */
export {
  ApplicationStatus,
  Enum,
  InterviewConflict,
  InterviewGroupStatus,
  InterviewStatus,
  ReviewStatus,
  Role,
  SimpleEntityEnum,
  SkillCategory,
} from "./__generated__/types";

type WithoutTypename<T> = Omit<T, "__typename">;
type ArrayElement<T> = T extends readonly (infer Item)[] ? Item : never;
type OperationField<TOperation, TField extends keyof TOperation> = NonNullable<
  TOperation[TField]
>;

/**
 * Clean DTO aliases for generated GraphQL object types.
 *
 * These preserve the schema's `DTO` naming convention and hide generated names
 * such as `AuthDto` and `Scalars["String"]["output"]` from application code.
 * Prefer operation-specific aliases below when typing data returned by a query
 * or mutation.
 */
export type AdminCommentDTO = WithoutTypename<Schema.AdminCommentDto>;
export type ApplicantRecordDTO = WithoutTypename<Schema.ApplicantRecordDto>;
export type ApplicationDTO = WithoutTypename<Schema.ApplicationDto>;
export type AuthDTO = WithoutTypename<Schema.AuthDto>;
export type EntityRequestDTO = Schema.EntityRequestDto;
export type EntityResponseDTO = WithoutTypename<Schema.EntityResponseDto>;
export type InterviewDTO = WithoutTypename<Schema.Interview>;
export type InterviewDelegationDTO =
  WithoutTypename<Schema.InterviewDelegationDto>;
export type InterviewGroupDTO = WithoutTypename<Schema.InterviewGroupDto>;
export type InterviewPairingsDTO = WithoutTypename<Schema.InterviewPairingsDto>;
export type InterviewedApplicantRecordDTO =
  WithoutTypename<Schema.InterviewedApplicantRecord>;
export type InterviewedApplicantsDTO =
  WithoutTypename<Schema.InterviewedApplicantsDto>;
export type ReviewDTO = WithoutTypename<Schema.Review>;
export type ReviewDashboardRowDTO =
  WithoutTypename<Schema.ReviewDashboardRowDto>;
export type ReviewDashboardSidePanelDTO =
  WithoutTypename<Schema.ReviewDashboardSidePanelDto>;
export type ReviewDashboardReviewDetailsDTO =
  WithoutTypename<Schema.ReviewDashboardReviewDetails>;
export type ReviewDetailsDTO = ReviewDashboardReviewDetailsDTO;
export type ReviewedApplicantRecordDTO =
  WithoutTypename<Schema.ReviewedApplicantRecordDto>;
export type ReviewedApplicantsDTO =
  WithoutTypename<Schema.ReviewedApplicantsDto>;
export type ShortAnswerQuestionDTO = WithoutTypename<Schema.ShortAnswerQuestion>;
export type SimpleEntityRequestDTO = Schema.SimpleEntityRequestDto;
export type SimpleEntityResponseDTO =
  WithoutTypename<Schema.SimpleEntityResponseDto>;
export type UserDTO = WithoutTypename<Schema.UserDto>;
export type ReviewDashboardReviewDetails = WithoutTypename<Schema.ReviewDashboardReviewDetails>;

/**
 * Clean aliases for generated GraphQL input types.
 */
export type CreateInterviewDelegationDTO = Schema.CreateInterviewDelegationDto;
export type UpdateInterviewDelegationDTO = Schema.UpdateInterviewDelegationDto;
export type CreateAdminCommentDTO = Schema.CreateAdminCommentDto;
export type CreateInterviewGroupDTO = Schema.CreateInterviewGroupDto;
export type CreateInterviewedApplicantRecordDTO =
  Schema.CreateInterviewedApplicantRecordDto;
export type CreateReviewedApplicantRecordDTO =
  Schema.CreateReviewedApplicantRecordDto;
export type CreateUserDTO = Schema.CreateUserDto;
export type InterviewInput = Schema.InterviewInput;
export type RegisterUserDTO = Schema.RegisterUserDto;
export type ReviewInput = Schema.ReviewInput;
export type UpdateAdminCommentDTO = Schema.UpdateAdminCommentDto;
export type UpdateInterviewGroupDTO = Schema.UpdateInterviewGroupDto;
export type UpdateInterviewedApplicantRecordDTO =
  Schema.UpdateInterviewedApplicantRecordDto;
export type UpdateReviewedApplicantRecordDTO =
  Schema.UpdateReviewedApplicantRecordDto;
export type UpdateUserDTO = Schema.UpdateUserDto;

/**
 * Re-export generated operation result and variable types from one stable place.
 */
/**
 * Re-export typed GraphQL documents from the client preset artifact.
 *
 * Import documents from this file instead of `__generated__/graphql` directly.
 */
export {
  ApplicationDocument,
  InterviewedApplicantsByUserIdDocument,
  InterviewersByGroupIdDocument,
  InterviewGroupDocument,
  IsAuthorizedByRoleDocument,
  LoginWithGoogleDocument,
  RefreshDocument,
  ReportInterviewConflictDocument,
  ReportReviewConflictDocument,
  ReviewedApplicantRecordsByApplicantRecordIdDocument,
  ReviewDashboardDocument,
  UpdateInterviewGroupDocument,
  UpdateInterviewGroupSchedulingLinkDocument,
} from "./__generated__/graphql";

export type {
  ApplicationQuery,
  ApplicationQueryVariables,
  InterviewGroupQuery,
  InterviewGroupQueryVariables,
  InterviewedApplicantsByUserIdQuery,
  InterviewedApplicantsByUserIdQueryVariables,
  InterviewersByGroupIdQuery,
  InterviewersByGroupIdQueryVariables,
  IsAuthorizedByRoleQuery,
  IsAuthorizedByRoleQueryVariables,
  LoginMutation,
  LoginMutationVariables,
  LoginWithGoogleMutation,
  LoginWithGoogleMutationVariables,
  RefreshMutation,
  RefreshMutationVariables,
  ReportInterviewConflictMutation,
  ReportInterviewConflictMutationVariables,
  ReportReviewConflictMutation,
  ReportReviewConflictMutationVariables,
  ReviewedApplicantRecordsByApplicantRecordIdQuery,
  ReviewedApplicantRecordsByApplicantRecordIdQueryVariables,
  ReviewDashboardQuery,
  ReviewDashboardQueryVariables,
  UpdateInterviewGroupMutation,
  UpdateInterviewGroupMutationVariables,
  UpdateInterviewGroupSchedulingLinkMutation,
  UpdateInterviewGroupSchedulingLinkMutationVariables,
} from "./__generated__/operation-types";

/**
 * Operation payload aliases for common API client and UI usage.
 *
 * These aliases are derived from generated operation result types, so they stay
 * aligned with the exact fields selected by frontend operations.
 */
export type LoginResult = OperationField<Operations.LoginMutation, "login">;
export type LoginWithGoogleResult = OperationField<
  Operations.LoginWithGoogleMutation,
  "loginWithGoogle"
>;
export type RefreshResult = OperationField<
  Operations.RefreshMutation,
  "refresh"
>;
export type InterviewGroupResult = OperationField<
  Operations.InterviewGroupQuery,
  "interviewGroup"
>;
export type InterviewedApplicantResult = ArrayElement<
  OperationField<
    Operations.InterviewedApplicantsByUserIdQuery,
    "interviewedApplicantsByUserId"
  >
>;
export type InterviewerResult = ArrayElement<
  OperationField<
    Operations.InterviewersByGroupIdQuery,
    "interviewersByGroupId"
  >
>;
export type UpdateInterviewGroupResult = OperationField<
  Operations.UpdateInterviewGroupMutation,
  "updateInterviewGroup"
>;
export type UpdateInterviewGroupSchedulingLinkResult = OperationField<
  Operations.UpdateInterviewGroupSchedulingLinkMutation,
  "updateInterviewGroupSchedulingLink"
>;
export type ApplicationResult = OperationField<
  Operations.ApplicationQuery,
  "application"
>;
export type ReviewConflictReportResult = OperationField<
  Operations.ReportReviewConflictMutation,
  "reportReviewConflict"
>;
export type ApplicantRecordWithReviewersResult = OperationField<
  Operations.ReviewedApplicantRecordsByApplicantRecordIdQuery,
  "reviewedApplicantRecordsByApplicantRecordId"
>;
export type ReviewedApplicantRecordWithReviewerResult = ArrayElement<
  ApplicantRecordWithReviewersResult["reviewedApplicantRecords"]
>;
export type ReportInterviewConflictResult = OperationField<
  Operations.ReportInterviewConflictMutation,
  "reportInterviewConflict"
>;
export type ReviewDashboardResult = ArrayElement<
  OperationField<Operations.ReviewDashboardQuery, "reviewDashboard">
>;
