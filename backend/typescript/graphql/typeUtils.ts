import type * as Generated from "./__generated__/resolvers-types";

/**
 * Re-export schema enums from the generated GraphQL type artifact.
 *
 * Application code should import enums from this file instead of importing from
 * `__generated__/resolvers-types` directly. That keeps generated-code details
 * isolated behind this stable wrapper.
 */
export {
  ApplicationStatus,
  Enum,
  InterviewConflict,
  InterviewStatus,
  Role,
  SimpleEntityEnum,
  SkillCategory,
} from "./__generated__/resolvers-types";

/**
 * Nullable GraphQL output value.
 *
 * Use this when app/domain code needs to intentionally model a nullable GraphQL
 * response field without importing Codegen's internal `Maybe` helper.
 */
export type Nullable<T> = T | null;

/**
 * Optional GraphQL input or partial update value.
 *
 * GraphQL Code Generator represents nullable input fields as `T | null`.
 * Existing TypeScript code often also uses `undefined` for omitted values, so
 * this helper captures both cases for handwritten adapter code.
 */
export type Optional<T> = T | null | undefined;

/**
 * Removes GraphQL's optional `__typename` metadata from generated object types.
 *
 * Backend services usually return plain DTO objects and should not need to know
 * about GraphQL's runtime typename field.
 */
export type WithoutTypename<T> = Omit<T, "__typename">;

/**
 * Full resolver map type for the executable schema.
 *
 * Use this when a resolver module exports both `Query` and `Mutation` fields.
 */
export type ResolverMap = Generated.Resolvers;

/**
 * Resolver map type for `Query` fields only.
 *
 * Useful for typing resolver modules that only implement query resolvers.
 */
export type QueryResolverMap = Generated.QueryResolvers;

/**
 * Resolver map type for `Mutation` fields only.
 *
 * Useful for typing resolver modules that only implement mutation resolvers.
 */
export type MutationResolverMap = Generated.MutationResolvers;

/**
 * Extracts the generated args type from a specific resolver function type.
 *
 * This is useful when adapter/helper code needs the exact argument shape for a
 * resolver without manually importing a long generated `Query...Args` or
 * `Mutation...Args` type name.
 */
export type ResolverArgs<TResolver> = TResolver extends Generated.Resolver<
  unknown,
  unknown,
  unknown,
  infer Args
>
  ? Args
  : never;

/**
 * Looks up the generated parent object shape for a GraphQL schema type name.
 *
 * Example: `SchemaParent<"UserDTO">`.
 */
export type SchemaParent<Name extends keyof Generated.ResolversParentTypes> =
  Generated.ResolversParentTypes[Name];

/**
 * Looks up the generated resolver result wrapper for a GraphQL schema type name.
 *
 * Most application code should prefer the explicit DTO aliases below. This
 * helper is available for generic resolver utilities.
 */
export type SchemaResult<Name extends keyof Generated.ResolversTypes> =
  Generated.ResolversTypes[Name];

/**
 * Clean DTO aliases for generated GraphQL object types.
 *
 * These aliases preserve the schema's `DTO` naming convention and remove
 * Codegen's optional `__typename` field so service and resolver code can work
 * with plain backend objects.
 */
export type AdminCommentDTO = WithoutTypename<Generated.AdminCommentDto>;
export type ApplicantRecordDTO = WithoutTypename<Generated.ApplicantRecordDto>;
export type ApplicationDTO = WithoutTypename<Generated.ApplicationDto>;
export type AuthDTO = WithoutTypename<Generated.AuthDto>;
export type EntityRequestDTO = Generated.EntityRequestDto;
export type EntityResponseDTO = WithoutTypename<Generated.EntityResponseDto>;
export type InterviewDTO = WithoutTypename<Generated.Interview>;
export type InterviewDelegationDTO =
  WithoutTypename<Generated.InterviewDelegation>;
export type InterviewGroupDTO = WithoutTypename<Generated.InterviewGroupDto>;
export type InterviewPairingsDTO =
  WithoutTypename<Generated.InterviewPairingsDto>;
export type InterviewedApplicantRecordDTO =
  WithoutTypename<Generated.InterviewedApplicantRecord>;
export type InterviewedApplicantsDTO =
  WithoutTypename<Generated.InterviewedApplicantsDto>;
export type ReviewDTO = WithoutTypename<Generated.Review>;
export type ReviewDashboardRowDTO =
  WithoutTypename<Generated.ReviewDashboardRowDto>;
export type ReviewDashboardSidePanelDTO =
  WithoutTypename<Generated.ReviewDashboardSidePanelDto>;
export type ReviewDetailsDTO = WithoutTypename<Generated.ReviewDetails>;
export type ReviewedApplicantRecordDTO =
  WithoutTypename<Generated.ReviewedApplicantRecordDto>;
export type ReviewedApplicantRecord = WithoutTypename<
  Generated.ReviewedApplicantRecord
>;
export type ReviewedApplicantsDTO =
  WithoutTypename<Generated.ReviewedApplicantsDto>;
export type ReviewerDTO = WithoutTypename<Generated.ReviewerDto>;
export type ShortQuestionAnswerDTO =
  WithoutTypename<Generated.ShortQuestionAnswer>;
export type SimpleEntityRequestDTO = Generated.SimpleEntityRequestDto;
export type SimpleEntityResponseDTO =
  WithoutTypename<Generated.SimpleEntityResponseDto>;
export type UserDTO = WithoutTypename<Generated.UserDto>;

/**
 * Clean aliases for generated GraphQL input types.
 *
 * Input types do not include `__typename`, so these are direct aliases to the
 * generated types. They are exposed here to avoid long imports from the
 * generated artifact.
 */
export type BulkCreateInterviewDelegationInput =
  Generated.BulkCreateInterviewDelegationInput;
export type BulkDeleteInterviewDelegationInput =
  Generated.BulkDeleteInterviewDelegationInput;
export type CreateAdminCommentDTO = Generated.CreateAdminCommentDto;
export type CreateInterviewGroupDTO = Generated.CreateInterviewGroupDto;
export type CreateReviewedApplicantRecordInput =
  Generated.CreateReviewedApplicantRecordInput;
export type CreateUserDTO = Generated.CreateUserDto;
export type DeleteReviewedApplicantRecordInput =
  Generated.DeleteReviewedApplicantRecord;
export type InterviewInput = Generated.InterviewInput;
export type RegisterUserDTO = Generated.RegisterUserDto;
export type ReviewInput = Generated.ReviewInput;
export type UpdateInterviewGroupDTO = Generated.UpdateInterviewGroupDto;
export type UpdateReviewedApplicantRecordInput =
  Generated.UpdateReviewedApplicantRecordInput;
export type UpdateUserDTO = Generated.UpdateUserDto;

/**
 * Named query argument aliases.
 *
 * These should be used sparingly. Resolver modules usually get args inferred
 * from `QueryResolverMap`, but these aliases are useful for shared resolver
 * helpers and tests.
 */
export type QueryAdminCommentByIdArgs = Generated.QueryAdminCommentByIdArgs;
export type QueryAdminCommentsByApplicantRecordIdArgs =
  Generated.QueryAdminCommentsByApplicantRecordIdArgs;
export type QueryGetInterviewDelegationArgs =
  Generated.QueryGetInterviewDelegationArgs;
export type QueryGetInterviewGroupByIdArgs =
  Generated.QueryGetInterviewGroupByIdArgs;
export type QueryGetInterviewedApplicantRecordByIdArgs =
  Generated.QueryGetInterviewedApplicantRecordByIdArgs;
export type QueryGetInterviewedApplicantsByUserIdArgs =
  Generated.QueryGetInterviewedApplicantsByUserIdArgs;
export type QueryGetInterviewedPairingsByUserIdArgs =
  Generated.QueryGetInterviewedPairingsByUserIdArgs;
export type QueryGetInterviewersByGroupIdArgs =
  Generated.QueryGetInterviewersByGroupIdArgs;
export type QueryGetReviewedApplicantRecordArgs =
  Generated.QueryGetReviewedApplicantRecordArgs;
export type QueryGetReviewedApplicantsByUserIdArgs =
  Generated.QueryGetReviewedApplicantsByUserIdArgs;
export type QueryReviewApplicantPageArgs =
  Generated.QueryReviewApplicantPageArgs;
export type QueryReviewDashboardArgs = Generated.QueryReviewDashboardArgs;
export type QueryReviewDashboardSidePanelArgs =
  Generated.QueryReviewDashboardSidePanelArgs;

/**
 * Named mutation argument aliases.
 *
 * Resolver modules usually get args inferred from `MutationResolverMap`; these
 * aliases exist for shared helpers, adapters, and tests.
 */
export type MutationCreateAdminCommentArgs =
  Generated.MutationCreateAdminCommentArgs;
export type MutationUpdateAdminCommentArgs =
  Generated.MutationUpdateAdminCommentArgs;
export type MutationDeleteAdminCommentByIdArgs =
  Generated.MutationDeleteAdminCommentByIdArgs;
export type MutationCreateInterviewDelegationArgs =
  Generated.MutationCreateInterviewDelegationArgs;
export type MutationUpdateInterviewDelegationArgs =
  Generated.MutationUpdateInterviewDelegationArgs;
export type MutationDeleteInterviewDelegationArgs =
  Generated.MutationDeleteInterviewDelegationArgs;
export type MutationCreateInterviewGroupArgs =
  Generated.MutationCreateInterviewGroupArgs;
export type MutationUpdateInterviewGroupArgs =
  Generated.MutationUpdateInterviewGroupArgs;
export type MutationDeleteInterviewGroupByIdArgs =
  Generated.MutationDeleteInterviewGroupByIdArgs;
export type MutationCreateReviewedApplicantRecordArgs =
  Generated.MutationCreateReviewedApplicantRecordArgs;
export type MutationUpdateReviewedApplicantRecordArgs =
  Generated.MutationUpdateReviewedApplicantRecordArgs;
export type MutationDeleteReviewedApplicantRecordArgs =
  Generated.MutationDeleteReviewedApplicantRecordArgs;
