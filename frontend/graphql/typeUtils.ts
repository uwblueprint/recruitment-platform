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
  InterviewStatus,
  Role,
  SimpleEntityEnum,
  SkillCategory,
} from "./__generated__/types";

type WithoutTypename<T> = Omit<T, "__typename">;
type ArrayElement<T> = T extends readonly (infer Item)[] ? Item : never;
type OperationField<
  TOperation,
  TField extends keyof TOperation,
> = NonNullable<TOperation[TField]>;

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
  WithoutTypename<Schema.InterviewDelegation>;
export type InterviewGroupDTO = WithoutTypename<Schema.InterviewGroupDto>;
export type InterviewPairingsDTO =
  WithoutTypename<Schema.InterviewPairingsDto>;
export type InterviewedApplicantRecordDTO =
  WithoutTypename<Schema.InterviewedApplicantRecord>;
export type InterviewedApplicantsDTO =
  WithoutTypename<Schema.InterviewedApplicantsDto>;
export type ReviewDTO = WithoutTypename<Schema.Review>;
export type ReviewDashboardRowDTO =
  WithoutTypename<Schema.ReviewDashboardRowDto>;
export type ReviewDashboardSidePanelDTO =
  WithoutTypename<Schema.ReviewDashboardSidePanelDto>;
export type ReviewDetailsDTO = WithoutTypename<Schema.ReviewDetails>;
export type ReviewedApplicantRecordDTO =
  WithoutTypename<Schema.ReviewedApplicantRecordDto>;
export type ReviewedApplicantRecord =
  WithoutTypename<Schema.ReviewedApplicantRecord>;
export type ReviewedApplicantsDTO =
  WithoutTypename<Schema.ReviewedApplicantsDto>;
export type ReviewerDTO = WithoutTypename<Schema.ReviewerDto>;
export type ShortQuestionAnswerDTO =
  WithoutTypename<Schema.ShortQuestionAnswer>;
export type SimpleEntityRequestDTO = Schema.SimpleEntityRequestDto;
export type SimpleEntityResponseDTO =
  WithoutTypename<Schema.SimpleEntityResponseDto>;
export type UserDTO = WithoutTypename<Schema.UserDto>;

/**
 * Clean aliases for generated GraphQL input types.
 */
export type BulkCreateInterviewDelegationInput =
  Schema.BulkCreateInterviewDelegationInput;
export type BulkDeleteInterviewDelegationInput =
  Schema.BulkDeleteInterviewDelegationInput;
export type CreateAdminCommentDTO = Schema.CreateAdminCommentDto;
export type CreateInterviewGroupDTO = Schema.CreateInterviewGroupDto;
export type CreateReviewedApplicantRecordInput =
  Schema.CreateReviewedApplicantRecordInput;
export type CreateUserDTO = Schema.CreateUserDto;
export type DeleteReviewedApplicantRecordInput =
  Schema.DeleteReviewedApplicantRecord;
export type InterviewInput = Schema.InterviewInput;
export type RegisterUserDTO = Schema.RegisterUserDto;
export type ReviewInput = Schema.ReviewInput;
export type UpdateInterviewGroupDTO = Schema.UpdateInterviewGroupDto;
export type UpdateReviewedApplicantRecordInput =
  Schema.UpdateReviewedApplicantRecordInput;
export type UpdateUserDTO = Schema.UpdateUserDto;

/**
 * Re-export generated operation result and variable types from one stable place.
 */
export type {
  GetInterviewGroupByIdQuery,
  GetInterviewGroupByIdQueryVariables,
  GetInterviewedApplicantsByUserIdQuery,
  GetInterviewedApplicantsByUserIdQueryVariables,
  GetInterviewersByGroupIdQuery,
  GetInterviewersByGroupIdQueryVariables,
  LoginMutation,
  LoginMutationVariables,
  LoginWithGoogleMutation,
  LoginWithGoogleMutationVariables,
  RefreshMutation,
  RefreshMutationVariables,
  ReportReviewConflictMutation,
  ReportReviewConflictMutationVariables,
  UpdateInterviewGroupMutation,
  UpdateInterviewGroupMutationVariables,
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
  Operations.GetInterviewGroupByIdQuery,
  "getInterviewGroupById"
>;
export type InterviewedApplicantResult = ArrayElement<
  OperationField<
    Operations.GetInterviewedApplicantsByUserIdQuery,
    "getInterviewedApplicantsByUserId"
  >
>;
export type InterviewerResult = ArrayElement<
  OperationField<
    Operations.GetInterviewersByGroupIdQuery,
    "getInterviewersByGroupId"
  >
>;
export type UpdateInterviewGroupResult = OperationField<
  Operations.UpdateInterviewGroupMutation,
  "updateInterviewGroup"
>;
export type ReviewConflictReportResult = OperationField<
  Operations.ReportReviewConflictMutation,
  "reportReviewConflict"
>;
