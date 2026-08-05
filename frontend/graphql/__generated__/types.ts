export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: unknown; output: unknown; }
};

export type AdminCommentDto = {
  __typename?: 'AdminCommentDTO';
  applicantRecordId: Scalars['ID']['output'];
  comment: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type ApplicantRecordDto = {
  __typename?: 'ApplicantRecordDTO';
  applicantId: Scalars['ID']['output'];
  choice: Scalars['Int']['output'];
  combinedReviewScore?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isApplicantFlagged: Scalars['Boolean']['output'];
  position: Scalars['String']['output'];
  roleSpecificQuestions: Array<ShortAnswerQuestion>;
  skillCategory?: Maybe<SkillCategory>;
  status: ApplicationStatus;
};

export type ApplicantRecordWithReviewersDto = {
  __typename?: 'ApplicantRecordWithReviewersDTO';
  applicantRecord: ApplicantRecordDto;
  reviewedApplicantRecords: Array<ReviewedApplicantRecordWithReviewerDto>;
};

export type ApplicationDto = {
  __typename?: 'ApplicationDTO';
  academicOrCoop: Scalars['String']['output'];
  academicYear: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  heardFrom: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  locationPreference: Scalars['String']['output'];
  program: Scalars['String']['output'];
  pronouns: Scalars['String']['output'];
  pronounsSpecified: Scalars['String']['output'];
  resumeUrl: Scalars['String']['output'];
  roleSpecificQuestions: Array<ShortAnswerQuestion>;
  shortAnswerQuestions: Array<ShortAnswerQuestion>;
  status: ApplicationStatus;
  term: Scalars['String']['output'];
  timesApplied: Scalars['String']['output'];
};

export enum ApplicationStatus {
  Applied = 'APPLIED',
  Interviewed = 'INTERVIEWED',
  InReview = 'IN_REVIEW',
  Offered = 'OFFERED',
  Rejected = 'REJECTED',
  Reviewed = 'REVIEWED',
  Selected = 'SELECTED'
}

export type AuthDto = {
  __typename?: 'AuthDTO';
  accessToken: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  position?: Maybe<Scalars['String']['output']>;
  refreshToken: Scalars['String']['output'];
  role: Role;
};

export type CreateAdminCommentDto = {
  applicantRecordId: Scalars['ID']['input'];
  comment: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateInterviewDelegationDto = {
  groupId: Scalars['ID']['input'];
  interviewedApplicantRecordId: Scalars['ID']['input'];
  interviewerId: Scalars['ID']['input'];
};

export type CreateInterviewGroupDto = {
  schedulingLink?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<InterviewGroupStatus>;
};

export type CreateInterviewedApplicantRecordDto = {
  applicantRecordId: Scalars['ID']['input'];
};

export type CreateReviewedApplicantRecordDto = {
  applicantRecordId: Scalars['ID']['input'];
  reviewerId: Scalars['ID']['input'];
  status: ReviewStatus;
};

export type CreateUserDto = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isArchived: Scalars['Boolean']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
  role: Role;
};

export type EntityRequestDto = {
  boolField: Scalars['Boolean']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
  enumField: Enum;
  filePath?: InputMaybe<Scalars['String']['input']>;
  intField: Scalars['Int']['input'];
  stringArrayField: Array<InputMaybe<Scalars['String']['input']>>;
  stringField: Scalars['String']['input'];
};

export type EntityResponseDto = {
  __typename?: 'EntityResponseDTO';
  boolField: Scalars['Boolean']['output'];
  enumField: Enum;
  fileName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  intField: Scalars['Int']['output'];
  stringArrayField: Array<Maybe<Scalars['String']['output']>>;
  stringField: Scalars['String']['output'];
};

export enum Enum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export type Interview = {
  __typename?: 'Interview';
  comments?: Maybe<Scalars['String']['output']>;
  desireToLearn?: Maybe<Scalars['Int']['output']>;
  passionFSG?: Maybe<Scalars['Int']['output']>;
  skill?: Maybe<Scalars['Int']['output']>;
  skillCategory?: Maybe<SkillCategory>;
  teamPlayer?: Maybe<Scalars['Int']['output']>;
};

export enum InterviewConflict {
  ApplicantConflict = 'APPLICANT_CONFLICT',
  ApplicantNoResponse = 'APPLICANT_NO_RESPONSE',
  CannotAttend = 'CANNOT_ATTEND',
  PartnerNoResponse = 'PARTNER_NO_RESPONSE'
}

export type InterviewDashboardRowDto = {
  __typename?: 'InterviewDashboardRowDTO';
  applicantRecordId: Scalars['ID']['output'];
  applicationStatus: ApplicationStatus;
  firstName: Scalars['String']['output'];
  interviewScore?: Maybe<Scalars['Int']['output']>;
  interviewers: Array<UserDto>;
  lastName: Scalars['String']['output'];
  position: Scalars['String']['output'];
};

export type InterviewDelegationDto = {
  __typename?: 'InterviewDelegationDTO';
  groupId: Scalars['ID']['output'];
  interviewHasConflict?: Maybe<InterviewConflict>;
  interviewedApplicantRecordId: Scalars['ID']['output'];
  interviewerId: Scalars['ID']['output'];
};

export type InterviewGroupDto = {
  __typename?: 'InterviewGroupDTO';
  id: Scalars['ID']['output'];
  schedulingLink?: Maybe<Scalars['String']['output']>;
  status: InterviewGroupStatus;
};

export enum InterviewGroupStatus {
  AvailabilityPending = 'AVAILABILITY_PENDING',
  InvitesSent = 'INVITES_SENT',
  ReadyToInterview = 'READY_TO_INTERVIEW'
}

export type InterviewInput = {
  comments?: InputMaybe<Scalars['String']['input']>;
  desireToLearn?: InputMaybe<Scalars['Int']['input']>;
  passionFSG?: InputMaybe<Scalars['Int']['input']>;
  skill?: InputMaybe<Scalars['Int']['input']>;
  skillCategory?: InputMaybe<SkillCategory>;
  teamPlayer?: InputMaybe<Scalars['Int']['input']>;
};

export type InterviewPairingsDto = {
  __typename?: 'InterviewPairingsDTO';
  groupMembers: Array<UserDto>;
  interviewGroupStatus: InterviewGroupStatus;
  interviewedGroupId: Scalars['ID']['output'];
};

export enum InterviewStatus {
  Complete = 'COMPLETE',
  ConflictReported = 'CONFLICT_REPORTED',
  InProgress = 'IN_PROGRESS',
  NeedsReview = 'NEEDS_REVIEW'
}

export type InterviewedApplicantRecord = {
  __typename?: 'InterviewedApplicantRecord';
  applicantRecordId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  interviewDate?: Maybe<Scalars['String']['output']>;
  interviewJson?: Maybe<Interview>;
  interviewNotesId?: Maybe<Scalars['String']['output']>;
  score?: Maybe<Scalars['Int']['output']>;
  status: InterviewStatus;
};

export type InterviewedApplicantsDto = {
  __typename?: 'InterviewedApplicantsDTO';
  applicantFirstName: Scalars['String']['output'];
  applicantLastName: Scalars['String']['output'];
  applicantRecordId: Scalars['ID']['output'];
  interviewStatus: InterviewStatus;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  bulkCreateInterviewDelegations: Array<InterviewDelegationDto>;
  bulkCreateInterviewGroups: Array<Maybe<InterviewGroupDto>>;
  bulkCreateReviewedApplicantRecord: Array<ReviewedApplicantRecordDto>;
  bulkDeleteInterviewGroupsByIds: Array<Maybe<InterviewGroupDto>>;
  bulkUpdateApplicantRecordsStatus: Array<ApplicantRecordDto>;
  createAdminComment: AdminCommentDto;
  createEntity: EntityResponseDto;
  createInterviewDelegation: InterviewDelegationDto;
  createInterviewGroup: InterviewGroupDto;
  createInterviewedApplicantRecord: InterviewedApplicantRecord;
  createReviewedApplicantRecord: ReviewedApplicantRecordDto;
  createSimpleEntity: SimpleEntityResponseDto;
  createUser: UserDto;
  delegateInterviewers: Array<InterviewDelegationDto>;
  delegateReviewers: Array<ReviewedApplicantRecordDto>;
  deleteAdminCommentById: AdminCommentDto;
  deleteEntity?: Maybe<Scalars['ID']['output']>;
  deleteInterviewDelegation: InterviewDelegationDto;
  deleteInterviewGroupById: InterviewGroupDto;
  deleteInterviewedApplicantRecordById: InterviewedApplicantRecord;
  deleteReviewedApplicantRecord: ReviewedApplicantRecordDto;
  deleteSimpleEntity?: Maybe<Scalars['ID']['output']>;
  deleteUserByEmail?: Maybe<Scalars['ID']['output']>;
  deleteUserById?: Maybe<Scalars['ID']['output']>;
  login: AuthDto;
  loginWithGoogle: AuthDto;
  logout?: Maybe<Scalars['ID']['output']>;
  reassignReviewer: ReviewedApplicantRecordDto;
  refresh: Scalars['String']['output'];
  register: AuthDto;
  reportInterviewConflict: InterviewedApplicantRecord;
  reportReviewConflict: ReviewedApplicantRecordDto;
  resetPassword: Scalars['Boolean']['output'];
  updateAdminComment: AdminCommentDto;
  updateApplicantRecordIsApplicantFlagged: ApplicantRecordDto;
  updateApplicantRecordStatus: ApplicantRecordDto;
  updateEntity: EntityResponseDto;
  updateInterviewDelegation: InterviewDelegationDto;
  updateInterviewGroup: InterviewGroupDto;
  updateInterviewGroupSchedulingLink: InterviewGroupDto;
  updateInterviewedApplicantRecord: InterviewedApplicantRecord;
  updateReviewedApplicantRecord: ReviewedApplicantRecordDto;
  updateSimpleEntity: SimpleEntityResponseDto;
  updateUser: UserDto;
};


export type MutationBulkCreateInterviewDelegationsArgs = {
  delegations: Array<CreateInterviewDelegationDto>;
};


export type MutationBulkCreateInterviewGroupsArgs = {
  interviewGroups: Array<InputMaybe<CreateInterviewGroupDto>>;
};


export type MutationBulkCreateReviewedApplicantRecordArgs = {
  reviewedApplicantRecords: Array<CreateReviewedApplicantRecordDto>;
};


export type MutationBulkDeleteInterviewGroupsByIdsArgs = {
  interviewGroupIds: Array<InputMaybe<Scalars['ID']['input']>>;
};


export type MutationBulkUpdateApplicantRecordsStatusArgs = {
  ids: Array<Scalars['ID']['input']>;
  status: ApplicationStatus;
};


export type MutationCreateAdminCommentArgs = {
  adminComment: CreateAdminCommentDto;
};


export type MutationCreateEntityArgs = {
  entity: EntityRequestDto;
  file?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationCreateInterviewDelegationArgs = {
  interviewDelegation: CreateInterviewDelegationDto;
};


export type MutationCreateInterviewGroupArgs = {
  interviewGroup: CreateInterviewGroupDto;
};


export type MutationCreateInterviewedApplicantRecordArgs = {
  interviewedApplicantRecord: CreateInterviewedApplicantRecordDto;
};


export type MutationCreateReviewedApplicantRecordArgs = {
  reviewedApplicantRecord: CreateReviewedApplicantRecordDto;
};


export type MutationCreateSimpleEntityArgs = {
  entity: SimpleEntityRequestDto;
};


export type MutationCreateUserArgs = {
  user: CreateUserDto;
};


export type MutationDelegateInterviewersArgs = {
  positions: Array<Scalars['String']['input']>;
};


export type MutationDelegateReviewersArgs = {
  positions: Array<Scalars['String']['input']>;
};


export type MutationDeleteAdminCommentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEntityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInterviewDelegationArgs = {
  interviewedApplicantRecordId: Scalars['ID']['input'];
  interviewerId: Scalars['ID']['input'];
};


export type MutationDeleteInterviewGroupByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInterviewedApplicantRecordByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReviewedApplicantRecordArgs = {
  applicantRecordId: Scalars['ID']['input'];
  reviewerId: Scalars['ID']['input'];
};


export type MutationDeleteSimpleEntityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationDeleteUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginWithGoogleArgs = {
  idToken: Scalars['String']['input'];
};


export type MutationLogoutArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationReassignReviewerArgs = {
  applicantRecordId: Scalars['ID']['input'];
  newReviewerId: Scalars['ID']['input'];
  oldReviewerId: Scalars['ID']['input'];
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  user: RegisterUserDto;
};


export type MutationReportInterviewConflictArgs = {
  interviewHasConflict: InterviewConflict;
  interviewedApplicantRecordId: Scalars['ID']['input'];
  interviewerId: Scalars['ID']['input'];
};


export type MutationReportReviewConflictArgs = {
  applicantRecordId: Scalars['ID']['input'];
  reviewerId: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateAdminCommentArgs = {
  adminComment: UpdateAdminCommentDto;
  id: Scalars['ID']['input'];
};


export type MutationUpdateApplicantRecordIsApplicantFlaggedArgs = {
  flagValue: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateApplicantRecordStatusArgs = {
  id: Scalars['ID']['input'];
  status: ApplicationStatus;
};


export type MutationUpdateEntityArgs = {
  entity: EntityRequestDto;
  file?: InputMaybe<Scalars['Upload']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateInterviewDelegationArgs = {
  interviewDelegation: UpdateInterviewDelegationDto;
  interviewedApplicantRecordId: Scalars['ID']['input'];
  interviewerId: Scalars['ID']['input'];
};


export type MutationUpdateInterviewGroupArgs = {
  id: Scalars['ID']['input'];
  interviewGroup: UpdateInterviewGroupDto;
};


export type MutationUpdateInterviewGroupSchedulingLinkArgs = {
  id: Scalars['ID']['input'];
  schedulingLink: Scalars['String']['input'];
};


export type MutationUpdateInterviewedApplicantRecordArgs = {
  id: Scalars['ID']['input'];
  interviewedApplicantRecord: UpdateInterviewedApplicantRecordDto;
};


export type MutationUpdateReviewedApplicantRecordArgs = {
  applicantRecordId: Scalars['ID']['input'];
  reviewedApplicantRecord: UpdateReviewedApplicantRecordDto;
  reviewerId: Scalars['ID']['input'];
};


export type MutationUpdateSimpleEntityArgs = {
  entity: SimpleEntityRequestDto;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  user: UpdateUserDto;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  adminCommentById: AdminCommentDto;
  adminCommentsByApplicantRecordId: Array<AdminCommentDto>;
  application: ApplicationDto;
  entities: Array<EntityResponseDto>;
  entitiesCSV: Scalars['String']['output'];
  entity: EntityResponseDto;
  file: Scalars['String']['output'];
  interviewDashboard: Array<InterviewDashboardRowDto>;
  interviewDelegation: InterviewDelegationDto;
  interviewGroup: InterviewGroupDto;
  interviewedApplicantRecord: InterviewedApplicantRecord;
  interviewedApplicantsByUserId: Array<InterviewedApplicantsDto>;
  interviewedPairingsByUserId: Array<InterviewPairingsDto>;
  interviewersByGroupId: Array<UserDto>;
  isAuthorizedByRole: Scalars['Boolean']['output'];
  isAuthorizedToReview: Scalars['Boolean']['output'];
  reviewDashboard: Array<ReviewDashboardRowDto>;
  reviewDashboardApplicantRecordIds: Array<Scalars['ID']['output']>;
  reviewDashboardSidePanel: ReviewDashboardSidePanelDto;
  reviewedApplicantRecord: ReviewedApplicantRecordDto;
  reviewedApplicantRecordsByApplicantRecordId: ApplicantRecordWithReviewersDto;
  reviewedApplicantsByUserId: Array<ReviewedApplicantsDto>;
  simpleEntities: Array<SimpleEntityResponseDto>;
  simpleEntitiesCSV: Scalars['String']['output'];
  simpleEntity: SimpleEntityResponseDto;
  userByEmail: UserDto;
  userById: UserDto;
  users: Array<UserDto>;
  usersByPosition: Array<Maybe<UserDto>>;
  usersCSV: Scalars['String']['output'];
};


export type QueryAdminCommentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminCommentsByApplicantRecordIdArgs = {
  applicantRecordId: Scalars['ID']['input'];
};


export type QueryApplicationArgs = {
  applicantRecordId: Scalars['ID']['input'];
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFileArgs = {
  fileUUID: Scalars['ID']['input'];
};


export type QueryInterviewDashboardArgs = {
  pageNumber: Scalars['Int']['input'];
  resultsPerPage: Scalars['Int']['input'];
};


export type QueryInterviewDelegationArgs = {
  interviewedApplicantRecordId: Scalars['ID']['input'];
  interviewerId: Scalars['ID']['input'];
};


export type QueryInterviewGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInterviewedApplicantRecordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInterviewedApplicantsByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryInterviewedPairingsByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryInterviewersByGroupIdArgs = {
  groupId: Scalars['ID']['input'];
};


export type QueryIsAuthorizedByRoleArgs = {
  accessToken: Scalars['String']['input'];
  roles: Array<Role>;
};


export type QueryIsAuthorizedToReviewArgs = {
  applicationId: Scalars['Int']['input'];
  reviewerUserId: Scalars['String']['input'];
};


export type QueryReviewDashboardArgs = {
  pageNumber: Scalars['Int']['input'];
  resultsPerPage: Scalars['Int']['input'];
  sortAscending?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReviewDashboardSortBy>;
};


export type QueryReviewDashboardApplicantRecordIdsArgs = {
  sortAscending?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReviewDashboardSortBy>;
};


export type QueryReviewDashboardSidePanelArgs = {
  applicantRecordId: Scalars['ID']['input'];
};


export type QueryReviewedApplicantRecordArgs = {
  applicantRecordId: Scalars['ID']['input'];
  reviewerId: Scalars['ID']['input'];
};


export type QueryReviewedApplicantRecordsByApplicantRecordIdArgs = {
  applicantRecordId: Scalars['ID']['input'];
};


export type QueryReviewedApplicantsByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerySimpleEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersByPositionArgs = {
  position: Scalars['String']['input'];
};

export type RegisterUserDto = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  comments?: Maybe<Scalars['String']['output']>;
  desireToLearn?: Maybe<Scalars['Int']['output']>;
  passionFSG?: Maybe<Scalars['Int']['output']>;
  skill?: Maybe<Scalars['Int']['output']>;
  skillCategory?: Maybe<SkillCategory>;
  teamPlayer?: Maybe<Scalars['Int']['output']>;
};

export type ReviewDashboardReviewDetails = {
  __typename?: 'ReviewDashboardReviewDetails';
  review?: Maybe<Review>;
  reviewStatus: ReviewStatus;
  reviewer: UserDto;
};

export type ReviewDashboardRowDto = {
  __typename?: 'ReviewDashboardRowDTO';
  applicantRecordId: Scalars['ID']['output'];
  applicationStatus: ApplicationStatus;
  choice: Scalars['Int']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  position: Scalars['String']['output'];
  reviewers: Array<UserDto>;
  timesApplied: Scalars['String']['output'];
  totalScore?: Maybe<Scalars['Int']['output']>;
};

export type ReviewDashboardSidePanelDto = {
  __typename?: 'ReviewDashboardSidePanelDTO';
  academicYear: Scalars['String']['output'];
  applicationStatus: ApplicationStatus;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  position: Scalars['String']['output'];
  program: Scalars['String']['output'];
  resumeUrl: Scalars['String']['output'];
  reviewDetails: Array<ReviewDashboardReviewDetails>;
  skillCategory?: Maybe<SkillCategory>;
};

export enum ReviewDashboardSortBy {
  ApplicationStatus = 'APPLICATION_STATUS',
  Choice = 'CHOICE',
  FirstName = 'FIRST_NAME',
  LastName = 'LAST_NAME',
  Reviewer_1 = 'REVIEWER_1',
  Reviewer_2 = 'REVIEWER_2',
  TimesApplied = 'TIMES_APPLIED',
  TotalScore = 'TOTAL_SCORE'
}

export type ReviewInput = {
  comments?: InputMaybe<Scalars['String']['input']>;
  desireToLearn?: InputMaybe<Scalars['Int']['input']>;
  passionFSG?: InputMaybe<Scalars['Int']['input']>;
  skill?: InputMaybe<Scalars['Int']['input']>;
  skillCategory?: InputMaybe<SkillCategory>;
  teamPlayer?: InputMaybe<Scalars['Int']['input']>;
};

export enum ReviewStatus {
  Conflict = 'CONFLICT',
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

export type ReviewedApplicantRecordDto = {
  __typename?: 'ReviewedApplicantRecordDTO';
  applicantRecordId: Scalars['ID']['output'];
  review?: Maybe<Review>;
  reviewerHasConflict: Scalars['Boolean']['output'];
  reviewerId: Scalars['ID']['output'];
  score?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
};

export type ReviewedApplicantRecordWithReviewerDto = {
  __typename?: 'ReviewedApplicantRecordWithReviewerDTO';
  reviewedApplicantRecord: ReviewedApplicantRecordDto;
  reviewer: UserDto;
};

export type ReviewedApplicantsDto = {
  __typename?: 'ReviewedApplicantsDTO';
  applicantFirstName: Scalars['String']['output'];
  applicantLastName: Scalars['String']['output'];
  applicantRecordId: Scalars['ID']['output'];
  reviewStatus: ReviewStatus;
};

export enum Role {
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  User = 'User'
}

export type ShortAnswerQuestion = {
  __typename?: 'ShortAnswerQuestion';
  answer: Scalars['String']['output'];
  question: Scalars['String']['output'];
};

export enum SimpleEntityEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export type SimpleEntityRequestDto = {
  boolField: Scalars['Boolean']['input'];
  enumField: Enum;
  intField: Scalars['Int']['input'];
  stringArrayField: Array<InputMaybe<Scalars['String']['input']>>;
  stringField: Scalars['String']['input'];
};

export type SimpleEntityResponseDto = {
  __typename?: 'SimpleEntityResponseDTO';
  boolField: Scalars['Boolean']['output'];
  enumField: SimpleEntityEnum;
  id: Scalars['ID']['output'];
  intField: Scalars['Int']['output'];
  stringArrayField: Array<Maybe<Scalars['String']['output']>>;
  stringField: Scalars['String']['output'];
};

export enum SkillCategory {
  Intermediate = 'INTERMEDIATE',
  Junior = 'JUNIOR',
  Senior = 'SENIOR'
}

export type UpdateAdminCommentDto = {
  comment: Scalars['String']['input'];
};

export type UpdateInterviewDelegationDto = {
  interviewHasConflict?: InputMaybe<InterviewConflict>;
};

export type UpdateInterviewGroupDto = {
  schedulingLink?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<InterviewGroupStatus>;
};

export type UpdateInterviewedApplicantRecordDto = {
  interviewDate?: InputMaybe<Scalars['String']['input']>;
  interviewJson?: InputMaybe<InterviewInput>;
  interviewNotesId?: InputMaybe<Scalars['String']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<InterviewStatus>;
};

export type UpdateReviewedApplicantRecordDto = {
  review?: InputMaybe<ReviewInput>;
  reviewerHasConflict?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<ReviewStatus>;
};

export type UpdateUserDto = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isArchived: Scalars['Boolean']['input'];
  lastName: Scalars['String']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
  role: Role;
};

export type UserDto = {
  __typename?: 'UserDTO';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  position?: Maybe<Scalars['String']['output']>;
  role: Role;
};
