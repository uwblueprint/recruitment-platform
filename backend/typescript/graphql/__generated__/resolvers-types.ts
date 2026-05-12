import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type AdminCommentDto = {
  __typename?: 'AdminCommentDTO';
  applicantRecordId: Scalars['String'];
  comment: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['String'];
  updatedAt: Scalars['String'];
  userId: Scalars['Int'];
};

export type ApplicantRecordDto = {
  __typename?: 'ApplicantRecordDTO';
  applicantId: Scalars['String'];
  choice: Scalars['Int'];
  combined_score?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  isApplicantFlagged: Scalars['Boolean'];
  position: Scalars['String'];
  roleSpecificQuestions: Array<Scalars['String']>;
  skillCategory?: Maybe<Scalars['String']>;
  status: ApplicationStatus;
};

export type ApplicationDto = {
  __typename?: 'ApplicationDTO';
  academicOrCoop: Scalars['String'];
  academicYear: Scalars['String'];
  email: Scalars['String'];
  firstChoiceRole: Scalars['String'];
  firstName: Scalars['String'];
  heardFrom: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  locationPreference: Scalars['String'];
  program: Scalars['String'];
  pronouns: Scalars['String'];
  pronounsSpecified: Scalars['String'];
  resumeUrl: Scalars['String'];
  roleSpecificQuestions: Array<Scalars['String']>;
  secondChoiceRole: Scalars['String'];
  secondChoiceStatus: Scalars['String'];
  shortQuestionAnswers: Array<ShortQuestionAnswer>;
  status: Scalars['String'];
  term: Scalars['String'];
  timesApplied: Scalars['String'];
  timestamp?: Maybe<Scalars['Int']>;
};

export enum ApplicationStatus {
  Applied = 'Applied',
  InReview = 'InReview',
  Interviewed = 'Interviewed',
  Offer = 'Offer',
  Rejected = 'Rejected',
  Reviewed = 'Reviewed',
  Selected = 'Selected'
}

export type AuthDto = {
  __typename?: 'AuthDTO';
  accessToken: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  isArchived: Scalars['Boolean'];
  lastName: Scalars['String'];
  position?: Maybe<Scalars['String']>;
  role: Role;
};

export type BulkCreateInterviewDelegationInput = {
  groupId: Scalars['ID'];
  interviewedApplicantRecordId: Scalars['ID'];
  interviewerId: Scalars['Int'];
};

export type BulkDeleteInterviewDelegationInput = {
  interviewedApplicantRecordId: Scalars['ID'];
  interviewerId: Scalars['Int'];
};

export type CreateAdminCommentDto = {
  applicantRecordId: Scalars['String'];
  comment: Scalars['String'];
  userId: Scalars['Int'];
};

export type CreateInterviewGroupDto = {
  schedulingLink?: InputMaybe<Scalars['String']>;
  status: Scalars['String'];
};

export type CreateReviewedApplicantRecordInput = {
  applicantRecordId: Scalars['ID'];
  review?: InputMaybe<ReviewInput>;
  reviewerId: Scalars['Int'];
  status?: InputMaybe<Scalars['String']>;
};

export type CreateUserDto = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  isArchived: Scalars['Boolean'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  position?: InputMaybe<Scalars['String']>;
  role: Role;
};

export type DeleteReviewedApplicantRecord = {
  applicantRecordId: Scalars['ID'];
  reviewerId: Scalars['Int'];
};

export type EntityRequestDto = {
  boolField: Scalars['Boolean'];
  contentType?: InputMaybe<Scalars['String']>;
  enumField: Enum;
  filePath?: InputMaybe<Scalars['String']>;
  intField: Scalars['Int'];
  stringArrayField: Array<InputMaybe<Scalars['String']>>;
  stringField: Scalars['String'];
};

export type EntityResponseDto = {
  __typename?: 'EntityResponseDTO';
  boolField: Scalars['Boolean'];
  enumField: Enum;
  fileName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intField: Scalars['Int'];
  stringArrayField: Array<Maybe<Scalars['String']>>;
  stringField: Scalars['String'];
};

export enum Enum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export type Interview = {
  __typename?: 'Interview';
  comments?: Maybe<Scalars['String']>;
  desireToLearn?: Maybe<Scalars['Int']>;
  passionFSG?: Maybe<Scalars['Int']>;
  skill?: Maybe<Scalars['Int']>;
  skillCategory?: Maybe<SkillCategory>;
  teamPlayer?: Maybe<Scalars['Int']>;
};

export enum InterviewConflict {
  ApplicantConflict = 'APPLICANT_CONFLICT',
  ApplicantNoResponse = 'APPLICANT_NO_RESPONSE',
  CannotAttend = 'CANNOT_ATTEND',
  PartnerNoResponse = 'PARTNER_NO_RESPONSE'
}

export type InterviewDelegation = {
  __typename?: 'InterviewDelegation';
  groupId: Scalars['ID'];
  interviewHasConflict?: Maybe<InterviewConflict>;
  interviewedApplicantRecordId: Scalars['ID'];
  interviewerId: Scalars['Int'];
};

export type InterviewGroupDto = {
  __typename?: 'InterviewGroupDTO';
  id: Scalars['ID'];
  schedulingLink?: Maybe<Scalars['String']>;
  status: Scalars['String'];
};

export type InterviewInput = {
  comments?: InputMaybe<Scalars['String']>;
  desireToLearn?: InputMaybe<Scalars['Int']>;
  passionFSG?: InputMaybe<Scalars['Int']>;
  skill?: InputMaybe<Scalars['Int']>;
  skillCategory?: InputMaybe<SkillCategory>;
  teamPlayer?: InputMaybe<Scalars['Int']>;
};

export type InterviewPairingsDto = {
  __typename?: 'InterviewPairingsDTO';
  groupMembers: Array<UserDto>;
  interviewGroupStatus: Scalars['String'];
  interviewedGroupId: Scalars['ID'];
};

export enum InterviewStatus {
  Complete = 'Complete',
  InProgress = 'InProgress',
  NeedsReview = 'NeedsReview'
}

export type InterviewedApplicantRecord = {
  __typename?: 'InterviewedApplicantRecord';
  applicantRecordId: Scalars['String'];
  id: Scalars['ID'];
  interviewDate?: Maybe<Scalars['String']>;
  interviewJson?: Maybe<Interview>;
  interviewNotesId?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Int']>;
  status: InterviewStatus;
};

export type InterviewedApplicantsDto = {
  __typename?: 'InterviewedApplicantsDTO';
  applicantFirstName: Scalars['String'];
  applicantLastName: Scalars['String'];
  applicantRecordId: Scalars['String'];
  interviewStatus: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  bulkCreateInterviewDelegations: Array<InterviewDelegation>;
  bulkCreateInterviewGroups: Array<Maybe<InterviewGroupDto>>;
  bulkCreateReviewedApplicantRecord: Array<ReviewedApplicantRecord>;
  bulkDeleteInterviewDelegations: Array<InterviewDelegation>;
  bulkDeleteInterviewGroupsByIds: Array<Maybe<InterviewGroupDto>>;
  bulkDeleteReviewedApplicantRecord: Array<ReviewedApplicantRecord>;
  bulkUpdateApplicantStatus: Array<ApplicantRecordDto>;
  createAdminComment: AdminCommentDto;
  createEntity: EntityResponseDto;
  createInterviewDelegation: InterviewDelegation;
  createInterviewGroup: InterviewGroupDto;
  createInterviewedApplicantRecord: InterviewedApplicantRecord;
  createReviewedApplicantRecord: ReviewedApplicantRecord;
  createSimpleEntity: SimpleEntityResponseDto;
  createUser: UserDto;
  delegateInterviewers: Array<InterviewDelegation>;
  delegateReviewers: Array<ReviewedApplicantRecordDto>;
  deleteAdminCommentById: AdminCommentDto;
  deleteEntity?: Maybe<Scalars['ID']>;
  deleteInterviewDelegation: InterviewDelegation;
  deleteInterviewGroupById: InterviewGroupDto;
  deleteInterviewedApplicantRecordById: InterviewedApplicantRecord;
  deleteReviewedApplicantRecord: ReviewedApplicantRecord;
  deleteSimpleEntity?: Maybe<Scalars['ID']>;
  deleteUserByEmail?: Maybe<Scalars['ID']>;
  deleteUserById?: Maybe<Scalars['ID']>;
  login: AuthDto;
  loginWithGoogle: AuthDto;
  logout?: Maybe<Scalars['ID']>;
  refresh: Scalars['String'];
  register: AuthDto;
  reportReviewConflict: ReviewedApplicantRecordDto;
  resetPassword: Scalars['Boolean'];
  setApplicantRecordFlag: ApplicantRecordDto;
  updateAdminComment: AdminCommentDto;
  updateApplicantStatus: ApplicantRecordDto;
  updateEntity: EntityResponseDto;
  updateInterviewDelegation: InterviewDelegation;
  updateInterviewGroup: InterviewGroupDto;
  updateInterviewedApplicantRecord: InterviewedApplicantRecord;
  updateReviewedApplicantRecord: ReviewedApplicantRecord;
  updateSimpleEntity: SimpleEntityResponseDto;
  updateUser: UserDto;
};


export type MutationBulkCreateInterviewDelegationsArgs = {
  delegations: Array<BulkCreateInterviewDelegationInput>;
};


export type MutationBulkCreateInterviewGroupsArgs = {
  interviewGroups: Array<InputMaybe<CreateInterviewGroupDto>>;
};


export type MutationBulkCreateReviewedApplicantRecordArgs = {
  inputs: Array<CreateReviewedApplicantRecordInput>;
};


export type MutationBulkDeleteInterviewDelegationsArgs = {
  delegations: Array<BulkDeleteInterviewDelegationInput>;
};


export type MutationBulkDeleteInterviewGroupsByIdsArgs = {
  interviewGroupIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationBulkDeleteReviewedApplicantRecordArgs = {
  inputs: Array<DeleteReviewedApplicantRecord>;
};


export type MutationBulkUpdateApplicantStatusArgs = {
  applicantRecordIds: Array<Scalars['String']>;
  status: ApplicationStatus;
};


export type MutationCreateAdminCommentArgs = {
  adminComment: CreateAdminCommentDto;
};


export type MutationCreateEntityArgs = {
  entity: EntityRequestDto;
  file?: InputMaybe<Scalars['Upload']>;
};


export type MutationCreateInterviewDelegationArgs = {
  groupId: Scalars['ID'];
  interviewedApplicantRecordId: Scalars['ID'];
  interviewerId: Scalars['Int'];
};


export type MutationCreateInterviewGroupArgs = {
  interviewGroup: CreateInterviewGroupDto;
};


export type MutationCreateInterviewedApplicantRecordArgs = {
  applicantRecordId: Scalars['String'];
  interviewDate?: InputMaybe<Scalars['String']>;
  interviewJSON?: InputMaybe<InterviewInput>;
  interviewNotesId?: InputMaybe<Scalars['String']>;
  score?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<InterviewStatus>;
};


export type MutationCreateReviewedApplicantRecordArgs = {
  input: CreateReviewedApplicantRecordInput;
};


export type MutationCreateSimpleEntityArgs = {
  entity: SimpleEntityRequestDto;
};


export type MutationCreateUserArgs = {
  user: CreateUserDto;
};


export type MutationDelegateInterviewersArgs = {
  positions: Array<Scalars['String']>;
};


export type MutationDelegateReviewersArgs = {
  positions: Array<Scalars['String']>;
};


export type MutationDeleteAdminCommentByIdArgs = {
  id: Scalars['String'];
};


export type MutationDeleteEntityArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteInterviewDelegationArgs = {
  interviewedApplicantRecordId: Scalars['ID'];
  interviewerId: Scalars['Int'];
};


export type MutationDeleteInterviewGroupByIdArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteInterviewedApplicantRecordByIdArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteReviewedApplicantRecordArgs = {
  input: DeleteReviewedApplicantRecord;
};


export type MutationDeleteSimpleEntityArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserByEmailArgs = {
  email: Scalars['String'];
};


export type MutationDeleteUserByIdArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginWithGoogleArgs = {
  idToken: Scalars['String'];
};


export type MutationLogoutArgs = {
  userId: Scalars['ID'];
};


export type MutationRegisterArgs = {
  user: RegisterUserDto;
};


export type MutationReportReviewConflictArgs = {
  applicantRecordId: Scalars['String'];
  reviewerId: Scalars['Int'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationSetApplicantRecordFlagArgs = {
  applicantRecordId: Scalars['String'];
  flagValue: Scalars['Boolean'];
};


export type MutationUpdateAdminCommentArgs = {
  content: CreateAdminCommentDto;
  id: Scalars['String'];
};


export type MutationUpdateApplicantStatusArgs = {
  applicantRecordId: Scalars['String'];
  status: ApplicationStatus;
};


export type MutationUpdateEntityArgs = {
  entity: EntityRequestDto;
  file?: InputMaybe<Scalars['Upload']>;
  id: Scalars['ID'];
};


export type MutationUpdateInterviewDelegationArgs = {
  groupId: Scalars['ID'];
  interviewedApplicantRecordId: Scalars['ID'];
  newInterviewerId: Scalars['Int'];
  prevInterviewerId: Scalars['Int'];
};


export type MutationUpdateInterviewGroupArgs = {
  id: Scalars['ID'];
  interviewGroup: UpdateInterviewGroupDto;
};


export type MutationUpdateInterviewedApplicantRecordArgs = {
  id: Scalars['ID'];
  interviewDate?: InputMaybe<Scalars['String']>;
  interviewJSON?: InputMaybe<InterviewInput>;
  interviewNotesId?: InputMaybe<Scalars['String']>;
  score?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<InterviewStatus>;
};


export type MutationUpdateReviewedApplicantRecordArgs = {
  input: UpdateReviewedApplicantRecordInput;
};


export type MutationUpdateSimpleEntityArgs = {
  entity: SimpleEntityRequestDto;
  id: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  user: UpdateUserDto;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  adminCommentById: AdminCommentDto;
  adminCommentsByApplicantRecordId: Array<AdminCommentDto>;
  entities: Array<EntityResponseDto>;
  entitiesCSV: Scalars['String'];
  entity: EntityResponseDto;
  file: Scalars['String'];
  getInterviewDelegation: InterviewDelegation;
  getInterviewGroupById: InterviewGroupDto;
  getInterviewedApplicantRecordById: InterviewedApplicantRecord;
  getInterviewedApplicantsByUserId: Array<InterviewedApplicantsDto>;
  getInterviewedPairingsByUserId: Array<InterviewPairingsDto>;
  getInterviewersByGroupId: Array<UserDto>;
  getReviewedApplicantRecord: ReviewedApplicantRecord;
  getReviewedApplicantsByUserId: Array<ReviewedApplicantsDto>;
  reviewApplicantPage: ApplicationDto;
  reviewDashboard: Array<ReviewDashboardRowDto>;
  reviewDashboardSidePanel: ReviewDashboardSidePanelDto;
  simpleEntities: Array<SimpleEntityResponseDto>;
  simpleEntitiesCSV: Scalars['String'];
  simpleEntity: SimpleEntityResponseDto;
  userByEmail: UserDto;
  userById: UserDto;
  users: Array<UserDto>;
  usersCSV: Scalars['String'];
};


export type QueryAdminCommentByIdArgs = {
  id: Scalars['String'];
};


export type QueryAdminCommentsByApplicantRecordIdArgs = {
  applicantRecordId: Scalars['String'];
};


export type QueryEntityArgs = {
  id: Scalars['ID'];
};


export type QueryFileArgs = {
  fileUUID: Scalars['ID'];
};


export type QueryGetInterviewDelegationArgs = {
  interviewedApplicantRecordId: Scalars['ID'];
  interviewerId: Scalars['Int'];
};


export type QueryGetInterviewGroupByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetInterviewedApplicantRecordByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetInterviewedApplicantsByUserIdArgs = {
  userId: Scalars['Int'];
};


export type QueryGetInterviewedPairingsByUserIdArgs = {
  userId: Scalars['Int'];
};


export type QueryGetInterviewersByGroupIdArgs = {
  groupId: Scalars['ID'];
};


export type QueryGetReviewedApplicantRecordArgs = {
  applicantRecordId: Scalars['ID'];
  reviewerId: Scalars['Int'];
};


export type QueryGetReviewedApplicantsByUserIdArgs = {
  userId: Scalars['Int'];
};


export type QueryReviewApplicantPageArgs = {
  applicantRecordId: Scalars['String'];
};


export type QueryReviewDashboardArgs = {
  pageNumber: Scalars['Int'];
  resultsPerPage: Scalars['Int'];
};


export type QueryReviewDashboardSidePanelArgs = {
  applicantId: Scalars['String'];
};


export type QuerySimpleEntityArgs = {
  id: Scalars['ID'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String'];
};


export type QueryUserByIdArgs = {
  id: Scalars['ID'];
};

export type RegisterUserDto = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type Review = {
  __typename?: 'Review';
  comments?: Maybe<Scalars['String']>;
  desireToLearn?: Maybe<Scalars['Int']>;
  passionFSG?: Maybe<Scalars['Int']>;
  skill?: Maybe<Scalars['Int']>;
  skillCategory?: Maybe<SkillCategory>;
  teamPlayer?: Maybe<Scalars['Int']>;
};

export type ReviewDashboardRowDto = {
  __typename?: 'ReviewDashboardRowDTO';
  applicationStatus: Scalars['String'];
  choice: Scalars['Int'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  position: Scalars['String'];
  reviewers: Array<ReviewerDto>;
  timesApplied: Scalars['String'];
  totalScore?: Maybe<Scalars['Int']>;
};

export type ReviewDashboardSidePanelDto = {
  __typename?: 'ReviewDashboardSidePanelDTO';
  applicationStatus: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  positionTitle: Scalars['String'];
  program: Scalars['String'];
  resumeUrl: Scalars['String'];
  reviewDetails: Array<ReviewDetails>;
  skillCategory?: Maybe<Scalars['String']>;
};

export type ReviewDetails = {
  __typename?: 'ReviewDetails';
  review: Review;
  reviewerFirstName: Scalars['String'];
  reviewerLastName: Scalars['String'];
};

export type ReviewInput = {
  desireToLearn?: InputMaybe<Scalars['Int']>;
  passionFSG?: InputMaybe<Scalars['Int']>;
  skill?: InputMaybe<Scalars['Int']>;
  skillCategory?: InputMaybe<SkillCategory>;
  teamPlayer?: InputMaybe<Scalars['Int']>;
};

export type ReviewedApplicantRecord = {
  __typename?: 'ReviewedApplicantRecord';
  applicantRecordId: Scalars['ID'];
  review?: Maybe<Review>;
  reviewerHasConflict?: Maybe<Scalars['Boolean']>;
  reviewerId: Scalars['Int'];
  score?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
};

export type ReviewedApplicantRecordDto = {
  __typename?: 'ReviewedApplicantRecordDTO';
  applicantRecordId: Scalars['String'];
  review: Review;
  reviewerHasConflict: Scalars['Boolean'];
  reviewerId: Scalars['Int'];
  score?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
};

export type ReviewedApplicantsDto = {
  __typename?: 'ReviewedApplicantsDTO';
  applicantFirstName: Scalars['String'];
  applicantLastName: Scalars['String'];
  applicantRecordId: Scalars['String'];
  reviewStatus: Scalars['String'];
};

export type ReviewerDto = {
  __typename?: 'ReviewerDTO';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export enum Role {
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  User = 'User'
}

export type ShortQuestionAnswer = {
  __typename?: 'ShortQuestionAnswer';
  question: Scalars['String'];
  response: Scalars['String'];
};

export enum SimpleEntityEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export type SimpleEntityRequestDto = {
  boolField: Scalars['Boolean'];
  enumField: Enum;
  intField: Scalars['Int'];
  stringArrayField: Array<InputMaybe<Scalars['String']>>;
  stringField: Scalars['String'];
};

export type SimpleEntityResponseDto = {
  __typename?: 'SimpleEntityResponseDTO';
  boolField: Scalars['Boolean'];
  enumField: SimpleEntityEnum;
  id: Scalars['ID'];
  intField: Scalars['Int'];
  stringArrayField: Array<Maybe<Scalars['String']>>;
  stringField: Scalars['String'];
};

export enum SkillCategory {
  Intermediate = 'INTERMEDIATE',
  Junior = 'JUNIOR',
  Senior = 'SENIOR'
}

export type UpdateInterviewGroupDto = {
  schedulingLink?: InputMaybe<Scalars['String']>;
  status: Scalars['String'];
};

export type UpdateReviewedApplicantRecordInput = {
  applicantRecordId: Scalars['ID'];
  review?: InputMaybe<ReviewInput>;
  reviewerId: Scalars['Int'];
  status?: InputMaybe<Scalars['String']>;
};

export type UpdateUserDto = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  isArchived: Scalars['Boolean'];
  lastName: Scalars['String'];
  position?: InputMaybe<Scalars['String']>;
  role: Role;
};

export type UserDto = {
  __typename?: 'UserDTO';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  isArchived: Scalars['Boolean'];
  lastName: Scalars['String'];
  position?: Maybe<Scalars['String']>;
  role: Role;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AdminCommentDTO: ResolverTypeWrapper<AdminCommentDto>;
  ApplicantRecordDTO: ResolverTypeWrapper<ApplicantRecordDto>;
  ApplicationDTO: ResolverTypeWrapper<ApplicationDto>;
  ApplicationStatus: ApplicationStatus;
  AuthDTO: ResolverTypeWrapper<AuthDto>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BulkCreateInterviewDelegationInput: BulkCreateInterviewDelegationInput;
  BulkDeleteInterviewDelegationInput: BulkDeleteInterviewDelegationInput;
  CreateAdminCommentDTO: CreateAdminCommentDto;
  CreateInterviewGroupDTO: CreateInterviewGroupDto;
  CreateReviewedApplicantRecordInput: CreateReviewedApplicantRecordInput;
  CreateUserDTO: CreateUserDto;
  DeleteReviewedApplicantRecord: DeleteReviewedApplicantRecord;
  EntityRequestDTO: EntityRequestDto;
  EntityResponseDTO: ResolverTypeWrapper<EntityResponseDto>;
  Enum: Enum;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Interview: ResolverTypeWrapper<Interview>;
  InterviewConflict: InterviewConflict;
  InterviewDelegation: ResolverTypeWrapper<InterviewDelegation>;
  InterviewGroupDTO: ResolverTypeWrapper<InterviewGroupDto>;
  InterviewInput: InterviewInput;
  InterviewPairingsDTO: ResolverTypeWrapper<InterviewPairingsDto>;
  InterviewStatus: InterviewStatus;
  InterviewedApplicantRecord: ResolverTypeWrapper<InterviewedApplicantRecord>;
  InterviewedApplicantsDTO: ResolverTypeWrapper<InterviewedApplicantsDto>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserDTO: RegisterUserDto;
  Review: ResolverTypeWrapper<Review>;
  ReviewDashboardRowDTO: ResolverTypeWrapper<ReviewDashboardRowDto>;
  ReviewDashboardSidePanelDTO: ResolverTypeWrapper<ReviewDashboardSidePanelDto>;
  ReviewDetails: ResolverTypeWrapper<ReviewDetails>;
  ReviewInput: ReviewInput;
  ReviewedApplicantRecord: ResolverTypeWrapper<ReviewedApplicantRecord>;
  ReviewedApplicantRecordDTO: ResolverTypeWrapper<ReviewedApplicantRecordDto>;
  ReviewedApplicantsDTO: ResolverTypeWrapper<ReviewedApplicantsDto>;
  ReviewerDTO: ResolverTypeWrapper<ReviewerDto>;
  Role: Role;
  ShortQuestionAnswer: ResolverTypeWrapper<ShortQuestionAnswer>;
  SimpleEntityEnum: SimpleEntityEnum;
  SimpleEntityRequestDTO: SimpleEntityRequestDto;
  SimpleEntityResponseDTO: ResolverTypeWrapper<SimpleEntityResponseDto>;
  SkillCategory: SkillCategory;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateInterviewGroupDTO: UpdateInterviewGroupDto;
  UpdateReviewedApplicantRecordInput: UpdateReviewedApplicantRecordInput;
  UpdateUserDTO: UpdateUserDto;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UserDTO: ResolverTypeWrapper<UserDto>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AdminCommentDTO: AdminCommentDto;
  ApplicantRecordDTO: ApplicantRecordDto;
  ApplicationDTO: ApplicationDto;
  AuthDTO: AuthDto;
  Boolean: Scalars['Boolean'];
  BulkCreateInterviewDelegationInput: BulkCreateInterviewDelegationInput;
  BulkDeleteInterviewDelegationInput: BulkDeleteInterviewDelegationInput;
  CreateAdminCommentDTO: CreateAdminCommentDto;
  CreateInterviewGroupDTO: CreateInterviewGroupDto;
  CreateReviewedApplicantRecordInput: CreateReviewedApplicantRecordInput;
  CreateUserDTO: CreateUserDto;
  DeleteReviewedApplicantRecord: DeleteReviewedApplicantRecord;
  EntityRequestDTO: EntityRequestDto;
  EntityResponseDTO: EntityResponseDto;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Interview: Interview;
  InterviewDelegation: InterviewDelegation;
  InterviewGroupDTO: InterviewGroupDto;
  InterviewInput: InterviewInput;
  InterviewPairingsDTO: InterviewPairingsDto;
  InterviewedApplicantRecord: InterviewedApplicantRecord;
  InterviewedApplicantsDTO: InterviewedApplicantsDto;
  Mutation: {};
  Query: {};
  RegisterUserDTO: RegisterUserDto;
  Review: Review;
  ReviewDashboardRowDTO: ReviewDashboardRowDto;
  ReviewDashboardSidePanelDTO: ReviewDashboardSidePanelDto;
  ReviewDetails: ReviewDetails;
  ReviewInput: ReviewInput;
  ReviewedApplicantRecord: ReviewedApplicantRecord;
  ReviewedApplicantRecordDTO: ReviewedApplicantRecordDto;
  ReviewedApplicantsDTO: ReviewedApplicantsDto;
  ReviewerDTO: ReviewerDto;
  ShortQuestionAnswer: ShortQuestionAnswer;
  SimpleEntityRequestDTO: SimpleEntityRequestDto;
  SimpleEntityResponseDTO: SimpleEntityResponseDto;
  String: Scalars['String'];
  UpdateInterviewGroupDTO: UpdateInterviewGroupDto;
  UpdateReviewedApplicantRecordInput: UpdateReviewedApplicantRecordInput;
  UpdateUserDTO: UpdateUserDto;
  Upload: Scalars['Upload'];
  UserDTO: UserDto;
}>;

export type AdminCommentDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminCommentDTO'] = ResolversParentTypes['AdminCommentDTO']> = ResolversObject<{
  applicantRecordId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApplicantRecordDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ApplicantRecordDTO'] = ResolversParentTypes['ApplicantRecordDTO']> = ResolversObject<{
  applicantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  choice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  combined_score?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isApplicantFlagged?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roleSpecificQuestions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  skillCategory?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ApplicationStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApplicationDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ApplicationDTO'] = ResolversParentTypes['ApplicationDTO']> = ResolversObject<{
  academicOrCoop?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  academicYear?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstChoiceRole?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  heardFrom?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locationPreference?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  program?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pronouns?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pronounsSpecified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resumeUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roleSpecificQuestions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  secondChoiceRole?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  secondChoiceStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shortQuestionAnswers?: Resolver<Array<ResolversTypes['ShortQuestionAnswer']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  term?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timesApplied?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthDTO'] = ResolversParentTypes['AuthDTO']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isArchived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EntityResponseDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EntityResponseDTO'] = ResolversParentTypes['EntityResponseDTO']> = ResolversObject<{
  boolField?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  enumField?: Resolver<ResolversTypes['Enum'], ParentType, ContextType>;
  fileName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  intField?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stringArrayField?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  stringField?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InterviewResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Interview'] = ResolversParentTypes['Interview']> = ResolversObject<{
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  desireToLearn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  passionFSG?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skill?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skillCategory?: Resolver<Maybe<ResolversTypes['SkillCategory']>, ParentType, ContextType>;
  teamPlayer?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InterviewDelegationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InterviewDelegation'] = ResolversParentTypes['InterviewDelegation']> = ResolversObject<{
  groupId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interviewHasConflict?: Resolver<Maybe<ResolversTypes['InterviewConflict']>, ParentType, ContextType>;
  interviewedApplicantRecordId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interviewerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InterviewGroupDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InterviewGroupDTO'] = ResolversParentTypes['InterviewGroupDTO']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  schedulingLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InterviewPairingsDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InterviewPairingsDTO'] = ResolversParentTypes['InterviewPairingsDTO']> = ResolversObject<{
  groupMembers?: Resolver<Array<ResolversTypes['UserDTO']>, ParentType, ContextType>;
  interviewGroupStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interviewedGroupId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InterviewedApplicantRecordResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InterviewedApplicantRecord'] = ResolversParentTypes['InterviewedApplicantRecord']> = ResolversObject<{
  applicantRecordId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interviewDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  interviewJson?: Resolver<Maybe<ResolversTypes['Interview']>, ParentType, ContextType>;
  interviewNotesId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['InterviewStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InterviewedApplicantsDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InterviewedApplicantsDTO'] = ResolversParentTypes['InterviewedApplicantsDTO']> = ResolversObject<{
  applicantFirstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  applicantLastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  applicantRecordId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interviewStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bulkCreateInterviewDelegations?: Resolver<Array<ResolversTypes['InterviewDelegation']>, ParentType, ContextType, RequireFields<MutationBulkCreateInterviewDelegationsArgs, 'delegations'>>;
  bulkCreateInterviewGroups?: Resolver<Array<Maybe<ResolversTypes['InterviewGroupDTO']>>, ParentType, ContextType, RequireFields<MutationBulkCreateInterviewGroupsArgs, 'interviewGroups'>>;
  bulkCreateReviewedApplicantRecord?: Resolver<Array<ResolversTypes['ReviewedApplicantRecord']>, ParentType, ContextType, RequireFields<MutationBulkCreateReviewedApplicantRecordArgs, 'inputs'>>;
  bulkDeleteInterviewDelegations?: Resolver<Array<ResolversTypes['InterviewDelegation']>, ParentType, ContextType, RequireFields<MutationBulkDeleteInterviewDelegationsArgs, 'delegations'>>;
  bulkDeleteInterviewGroupsByIds?: Resolver<Array<Maybe<ResolversTypes['InterviewGroupDTO']>>, ParentType, ContextType, RequireFields<MutationBulkDeleteInterviewGroupsByIdsArgs, 'interviewGroupIds'>>;
  bulkDeleteReviewedApplicantRecord?: Resolver<Array<ResolversTypes['ReviewedApplicantRecord']>, ParentType, ContextType, RequireFields<MutationBulkDeleteReviewedApplicantRecordArgs, 'inputs'>>;
  bulkUpdateApplicantStatus?: Resolver<Array<ResolversTypes['ApplicantRecordDTO']>, ParentType, ContextType, RequireFields<MutationBulkUpdateApplicantStatusArgs, 'applicantRecordIds' | 'status'>>;
  createAdminComment?: Resolver<ResolversTypes['AdminCommentDTO'], ParentType, ContextType, RequireFields<MutationCreateAdminCommentArgs, 'adminComment'>>;
  createEntity?: Resolver<ResolversTypes['EntityResponseDTO'], ParentType, ContextType, RequireFields<MutationCreateEntityArgs, 'entity'>>;
  createInterviewDelegation?: Resolver<ResolversTypes['InterviewDelegation'], ParentType, ContextType, RequireFields<MutationCreateInterviewDelegationArgs, 'groupId' | 'interviewedApplicantRecordId' | 'interviewerId'>>;
  createInterviewGroup?: Resolver<ResolversTypes['InterviewGroupDTO'], ParentType, ContextType, RequireFields<MutationCreateInterviewGroupArgs, 'interviewGroup'>>;
  createInterviewedApplicantRecord?: Resolver<ResolversTypes['InterviewedApplicantRecord'], ParentType, ContextType, RequireFields<MutationCreateInterviewedApplicantRecordArgs, 'applicantRecordId'>>;
  createReviewedApplicantRecord?: Resolver<ResolversTypes['ReviewedApplicantRecord'], ParentType, ContextType, RequireFields<MutationCreateReviewedApplicantRecordArgs, 'input'>>;
  createSimpleEntity?: Resolver<ResolversTypes['SimpleEntityResponseDTO'], ParentType, ContextType, RequireFields<MutationCreateSimpleEntityArgs, 'entity'>>;
  createUser?: Resolver<ResolversTypes['UserDTO'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>;
  delegateInterviewers?: Resolver<Array<ResolversTypes['InterviewDelegation']>, ParentType, ContextType, RequireFields<MutationDelegateInterviewersArgs, 'positions'>>;
  delegateReviewers?: Resolver<Array<ResolversTypes['ReviewedApplicantRecordDTO']>, ParentType, ContextType, RequireFields<MutationDelegateReviewersArgs, 'positions'>>;
  deleteAdminCommentById?: Resolver<ResolversTypes['AdminCommentDTO'], ParentType, ContextType, RequireFields<MutationDeleteAdminCommentByIdArgs, 'id'>>;
  deleteEntity?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationDeleteEntityArgs, 'id'>>;
  deleteInterviewDelegation?: Resolver<ResolversTypes['InterviewDelegation'], ParentType, ContextType, RequireFields<MutationDeleteInterviewDelegationArgs, 'interviewedApplicantRecordId' | 'interviewerId'>>;
  deleteInterviewGroupById?: Resolver<ResolversTypes['InterviewGroupDTO'], ParentType, ContextType, RequireFields<MutationDeleteInterviewGroupByIdArgs, 'id'>>;
  deleteInterviewedApplicantRecordById?: Resolver<ResolversTypes['InterviewedApplicantRecord'], ParentType, ContextType, RequireFields<MutationDeleteInterviewedApplicantRecordByIdArgs, 'id'>>;
  deleteReviewedApplicantRecord?: Resolver<ResolversTypes['ReviewedApplicantRecord'], ParentType, ContextType, RequireFields<MutationDeleteReviewedApplicantRecordArgs, 'input'>>;
  deleteSimpleEntity?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationDeleteSimpleEntityArgs, 'id'>>;
  deleteUserByEmail?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationDeleteUserByEmailArgs, 'email'>>;
  deleteUserById?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationDeleteUserByIdArgs, 'id'>>;
  login?: Resolver<ResolversTypes['AuthDTO'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  loginWithGoogle?: Resolver<ResolversTypes['AuthDTO'], ParentType, ContextType, RequireFields<MutationLoginWithGoogleArgs, 'idToken'>>;
  logout?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationLogoutArgs, 'userId'>>;
  refresh?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['AuthDTO'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'user'>>;
  reportReviewConflict?: Resolver<ResolversTypes['ReviewedApplicantRecordDTO'], ParentType, ContextType, RequireFields<MutationReportReviewConflictArgs, 'applicantRecordId' | 'reviewerId'>>;
  resetPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'email'>>;
  setApplicantRecordFlag?: Resolver<ResolversTypes['ApplicantRecordDTO'], ParentType, ContextType, RequireFields<MutationSetApplicantRecordFlagArgs, 'applicantRecordId' | 'flagValue'>>;
  updateAdminComment?: Resolver<ResolversTypes['AdminCommentDTO'], ParentType, ContextType, RequireFields<MutationUpdateAdminCommentArgs, 'content' | 'id'>>;
  updateApplicantStatus?: Resolver<ResolversTypes['ApplicantRecordDTO'], ParentType, ContextType, RequireFields<MutationUpdateApplicantStatusArgs, 'applicantRecordId' | 'status'>>;
  updateEntity?: Resolver<ResolversTypes['EntityResponseDTO'], ParentType, ContextType, RequireFields<MutationUpdateEntityArgs, 'entity' | 'id'>>;
  updateInterviewDelegation?: Resolver<ResolversTypes['InterviewDelegation'], ParentType, ContextType, RequireFields<MutationUpdateInterviewDelegationArgs, 'groupId' | 'interviewedApplicantRecordId' | 'newInterviewerId' | 'prevInterviewerId'>>;
  updateInterviewGroup?: Resolver<ResolversTypes['InterviewGroupDTO'], ParentType, ContextType, RequireFields<MutationUpdateInterviewGroupArgs, 'id' | 'interviewGroup'>>;
  updateInterviewedApplicantRecord?: Resolver<ResolversTypes['InterviewedApplicantRecord'], ParentType, ContextType, RequireFields<MutationUpdateInterviewedApplicantRecordArgs, 'id'>>;
  updateReviewedApplicantRecord?: Resolver<ResolversTypes['ReviewedApplicantRecord'], ParentType, ContextType, RequireFields<MutationUpdateReviewedApplicantRecordArgs, 'input'>>;
  updateSimpleEntity?: Resolver<ResolversTypes['SimpleEntityResponseDTO'], ParentType, ContextType, RequireFields<MutationUpdateSimpleEntityArgs, 'entity' | 'id'>>;
  updateUser?: Resolver<ResolversTypes['UserDTO'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'user'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  adminCommentById?: Resolver<ResolversTypes['AdminCommentDTO'], ParentType, ContextType, RequireFields<QueryAdminCommentByIdArgs, 'id'>>;
  adminCommentsByApplicantRecordId?: Resolver<Array<ResolversTypes['AdminCommentDTO']>, ParentType, ContextType, RequireFields<QueryAdminCommentsByApplicantRecordIdArgs, 'applicantRecordId'>>;
  entities?: Resolver<Array<ResolversTypes['EntityResponseDTO']>, ParentType, ContextType>;
  entitiesCSV?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['EntityResponseDTO'], ParentType, ContextType, RequireFields<QueryEntityArgs, 'id'>>;
  file?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryFileArgs, 'fileUUID'>>;
  getInterviewDelegation?: Resolver<ResolversTypes['InterviewDelegation'], ParentType, ContextType, RequireFields<QueryGetInterviewDelegationArgs, 'interviewedApplicantRecordId' | 'interviewerId'>>;
  getInterviewGroupById?: Resolver<ResolversTypes['InterviewGroupDTO'], ParentType, ContextType, RequireFields<QueryGetInterviewGroupByIdArgs, 'id'>>;
  getInterviewedApplicantRecordById?: Resolver<ResolversTypes['InterviewedApplicantRecord'], ParentType, ContextType, RequireFields<QueryGetInterviewedApplicantRecordByIdArgs, 'id'>>;
  getInterviewedApplicantsByUserId?: Resolver<Array<ResolversTypes['InterviewedApplicantsDTO']>, ParentType, ContextType, RequireFields<QueryGetInterviewedApplicantsByUserIdArgs, 'userId'>>;
  getInterviewedPairingsByUserId?: Resolver<Array<ResolversTypes['InterviewPairingsDTO']>, ParentType, ContextType, RequireFields<QueryGetInterviewedPairingsByUserIdArgs, 'userId'>>;
  getInterviewersByGroupId?: Resolver<Array<ResolversTypes['UserDTO']>, ParentType, ContextType, RequireFields<QueryGetInterviewersByGroupIdArgs, 'groupId'>>;
  getReviewedApplicantRecord?: Resolver<ResolversTypes['ReviewedApplicantRecord'], ParentType, ContextType, RequireFields<QueryGetReviewedApplicantRecordArgs, 'applicantRecordId' | 'reviewerId'>>;
  getReviewedApplicantsByUserId?: Resolver<Array<ResolversTypes['ReviewedApplicantsDTO']>, ParentType, ContextType, RequireFields<QueryGetReviewedApplicantsByUserIdArgs, 'userId'>>;
  reviewApplicantPage?: Resolver<ResolversTypes['ApplicationDTO'], ParentType, ContextType, RequireFields<QueryReviewApplicantPageArgs, 'applicantRecordId'>>;
  reviewDashboard?: Resolver<Array<ResolversTypes['ReviewDashboardRowDTO']>, ParentType, ContextType, RequireFields<QueryReviewDashboardArgs, 'pageNumber' | 'resultsPerPage'>>;
  reviewDashboardSidePanel?: Resolver<ResolversTypes['ReviewDashboardSidePanelDTO'], ParentType, ContextType, RequireFields<QueryReviewDashboardSidePanelArgs, 'applicantId'>>;
  simpleEntities?: Resolver<Array<ResolversTypes['SimpleEntityResponseDTO']>, ParentType, ContextType>;
  simpleEntitiesCSV?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  simpleEntity?: Resolver<ResolversTypes['SimpleEntityResponseDTO'], ParentType, ContextType, RequireFields<QuerySimpleEntityArgs, 'id'>>;
  userByEmail?: Resolver<ResolversTypes['UserDTO'], ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>;
  userById?: Resolver<ResolversTypes['UserDTO'], ParentType, ContextType, RequireFields<QueryUserByIdArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['UserDTO']>, ParentType, ContextType>;
  usersCSV?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type ReviewResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = ResolversObject<{
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  desireToLearn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  passionFSG?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skill?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skillCategory?: Resolver<Maybe<ResolversTypes['SkillCategory']>, ParentType, ContextType>;
  teamPlayer?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewDashboardRowDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewDashboardRowDTO'] = ResolversParentTypes['ReviewDashboardRowDTO']> = ResolversObject<{
  applicationStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  choice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewers?: Resolver<Array<ResolversTypes['ReviewerDTO']>, ParentType, ContextType>;
  timesApplied?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalScore?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewDashboardSidePanelDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewDashboardSidePanelDTO'] = ResolversParentTypes['ReviewDashboardSidePanelDTO']> = ResolversObject<{
  applicationStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  positionTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  program?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resumeUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewDetails?: Resolver<Array<ResolversTypes['ReviewDetails']>, ParentType, ContextType>;
  skillCategory?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewDetailsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewDetails'] = ResolversParentTypes['ReviewDetails']> = ResolversObject<{
  review?: Resolver<ResolversTypes['Review'], ParentType, ContextType>;
  reviewerFirstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewerLastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewedApplicantRecordResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewedApplicantRecord'] = ResolversParentTypes['ReviewedApplicantRecord']> = ResolversObject<{
  applicantRecordId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType>;
  reviewerHasConflict?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reviewerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewedApplicantRecordDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewedApplicantRecordDTO'] = ResolversParentTypes['ReviewedApplicantRecordDTO']> = ResolversObject<{
  applicantRecordId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  review?: Resolver<ResolversTypes['Review'], ParentType, ContextType>;
  reviewerHasConflict?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reviewerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewedApplicantsDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewedApplicantsDTO'] = ResolversParentTypes['ReviewedApplicantsDTO']> = ResolversObject<{
  applicantFirstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  applicantLastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  applicantRecordId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewerDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewerDTO'] = ResolversParentTypes['ReviewerDTO']> = ResolversObject<{
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShortQuestionAnswerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShortQuestionAnswer'] = ResolversParentTypes['ShortQuestionAnswer']> = ResolversObject<{
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  response?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SimpleEntityResponseDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SimpleEntityResponseDTO'] = ResolversParentTypes['SimpleEntityResponseDTO']> = ResolversObject<{
  boolField?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  enumField?: Resolver<ResolversTypes['SimpleEntityEnum'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  intField?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stringArrayField?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  stringField?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserDtoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserDTO'] = ResolversParentTypes['UserDTO']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isArchived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AdminCommentDTO?: AdminCommentDtoResolvers<ContextType>;
  ApplicantRecordDTO?: ApplicantRecordDtoResolvers<ContextType>;
  ApplicationDTO?: ApplicationDtoResolvers<ContextType>;
  AuthDTO?: AuthDtoResolvers<ContextType>;
  EntityResponseDTO?: EntityResponseDtoResolvers<ContextType>;
  Interview?: InterviewResolvers<ContextType>;
  InterviewDelegation?: InterviewDelegationResolvers<ContextType>;
  InterviewGroupDTO?: InterviewGroupDtoResolvers<ContextType>;
  InterviewPairingsDTO?: InterviewPairingsDtoResolvers<ContextType>;
  InterviewedApplicantRecord?: InterviewedApplicantRecordResolvers<ContextType>;
  InterviewedApplicantsDTO?: InterviewedApplicantsDtoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  ReviewDashboardRowDTO?: ReviewDashboardRowDtoResolvers<ContextType>;
  ReviewDashboardSidePanelDTO?: ReviewDashboardSidePanelDtoResolvers<ContextType>;
  ReviewDetails?: ReviewDetailsResolvers<ContextType>;
  ReviewedApplicantRecord?: ReviewedApplicantRecordResolvers<ContextType>;
  ReviewedApplicantRecordDTO?: ReviewedApplicantRecordDtoResolvers<ContextType>;
  ReviewedApplicantsDTO?: ReviewedApplicantsDtoResolvers<ContextType>;
  ReviewerDTO?: ReviewerDtoResolvers<ContextType>;
  ShortQuestionAnswer?: ShortQuestionAnswerResolvers<ContextType>;
  SimpleEntityResponseDTO?: SimpleEntityResponseDtoResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UserDTO?: UserDtoResolvers<ContextType>;
}>;

