/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query Application($applicantRecordId: ID!) {\n  application(applicantRecordId: $applicantRecordId) {\n    id\n    academicOrCoop\n    academicYear\n    email\n    firstName\n    lastName\n    heardFrom\n    locationPreference\n    program\n    pronouns\n    pronounsSpecified\n    resumeUrl\n    roleSpecificQuestions {\n      question\n      answer\n    }\n    shortAnswerQuestions {\n      question\n      answer\n    }\n    status\n    term\n    timesApplied\n  }\n}": typeof types.ApplicationDocument,
    "query InterviewGroup($id: ID!) {\n  interviewGroup(id: $id) {\n    id\n    schedulingLink\n    status\n  }\n}": typeof types.InterviewGroupDocument,
    "query InterviewedApplicantsByUserId($userId: ID!) {\n  interviewedApplicantsByUserId(userId: $userId) {\n    applicantRecordId\n    interviewStatus\n    applicantFirstName\n    applicantLastName\n  }\n}": typeof types.InterviewedApplicantsByUserIdDocument,
    "query InterviewersByGroupId($groupId: ID!) {\n  interviewersByGroupId(groupId: $groupId) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}": typeof types.InterviewersByGroupIdDocument,
    "query IsAuthorizedByRole($accessToken: String!, $roles: [Role!]!) {\n  isAuthorizedByRole(accessToken: $accessToken, roles: $roles)\n}": typeof types.IsAuthorizedByRoleDocument,
    "mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n  }\n}": typeof types.LoginDocument,
    "mutation LoginWithGoogle($idToken: String!) {\n  loginWithGoogle(idToken: $idToken) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n    refreshToken\n  }\n}": typeof types.LoginWithGoogleDocument,
    "mutation ReassignReviewer($applicantRecordId: ID!, $oldReviewerId: ID!, $newReviewerId: ID!) {\n  reassignReviewer(\n    applicantRecordId: $applicantRecordId\n    oldReviewerId: $oldReviewerId\n    newReviewerId: $newReviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n  }\n}": typeof types.ReassignReviewerDocument,
    "mutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken)\n}": typeof types.RefreshDocument,
    "mutation ReportInterviewConflict($interviewedApplicantRecordId: ID!, $interviewerId: ID!, $interviewHasConflict: InterviewConflict!) {\n  reportInterviewConflict(\n    interviewedApplicantRecordId: $interviewedApplicantRecordId\n    interviewerId: $interviewerId\n    interviewHasConflict: $interviewHasConflict\n  ) {\n    id\n    status\n  }\n}": typeof types.ReportInterviewConflictDocument,
    "mutation ReportReviewConflict($applicantRecordId: ID!, $reviewerId: ID!) {\n  reportReviewConflict(\n    applicantRecordId: $applicantRecordId\n    reviewerId: $reviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n    score\n    reviewerHasConflict\n  }\n}": typeof types.ReportReviewConflictDocument,
    "query ReviewDashboard($pageNumber: Int!, $resultsPerPage: Int!) {\n  reviewDashboard(pageNumber: $pageNumber, resultsPerPage: $resultsPerPage) {\n    applicantRecordId\n    firstName\n    lastName\n    position\n    timesApplied\n    applicationStatus\n    choice\n    reviewers {\n      id\n      firstName\n      lastName\n      email\n      position\n      role\n      isArchived\n    }\n    totalScore\n  }\n}": typeof types.ReviewDashboardDocument,
    "query ReviewedApplicantRecordsByApplicantRecordId($applicantRecordId: ID!) {\n  reviewedApplicantRecordsByApplicantRecordId(\n    applicantRecordId: $applicantRecordId\n  ) {\n    applicantRecord {\n      id\n      position\n      combinedReviewScore\n    }\n    reviewedApplicantRecords {\n      reviewer {\n        id\n        firstName\n        lastName\n        email\n        role\n        position\n        isArchived\n      }\n      reviewedApplicantRecord {\n        review {\n          passionFSG\n          teamPlayer\n          desireToLearn\n          skill\n          skillCategory\n          comments\n        }\n        status\n        score\n        reviewerHasConflict\n      }\n    }\n  }\n}": typeof types.ReviewedApplicantRecordsByApplicantRecordIdDocument,
    "mutation UpdateInterviewGroup($id: ID!, $interviewGroup: UpdateInterviewGroupDTO!) {\n  updateInterviewGroup(id: $id, interviewGroup: $interviewGroup) {\n    id\n    schedulingLink\n    status\n  }\n}": typeof types.UpdateInterviewGroupDocument,
    "mutation UpdateInterviewGroupSchedulingLink($id: ID!, $schedulingLink: String!) {\n  updateInterviewGroupSchedulingLink(id: $id, schedulingLink: $schedulingLink) {\n    id\n    schedulingLink\n    status\n  }\n}": typeof types.UpdateInterviewGroupSchedulingLinkDocument,
    "query UsersByPosition($position: String!) {\n  usersByPosition(position: $position) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}": typeof types.UsersByPositionDocument,
};
const documents: Documents = {
    "query Application($applicantRecordId: ID!) {\n  application(applicantRecordId: $applicantRecordId) {\n    id\n    academicOrCoop\n    academicYear\n    email\n    firstName\n    lastName\n    heardFrom\n    locationPreference\n    program\n    pronouns\n    pronounsSpecified\n    resumeUrl\n    roleSpecificQuestions {\n      question\n      answer\n    }\n    shortAnswerQuestions {\n      question\n      answer\n    }\n    status\n    term\n    timesApplied\n  }\n}": types.ApplicationDocument,
    "query InterviewGroup($id: ID!) {\n  interviewGroup(id: $id) {\n    id\n    schedulingLink\n    status\n  }\n}": types.InterviewGroupDocument,
    "query InterviewedApplicantsByUserId($userId: ID!) {\n  interviewedApplicantsByUserId(userId: $userId) {\n    applicantRecordId\n    interviewStatus\n    applicantFirstName\n    applicantLastName\n  }\n}": types.InterviewedApplicantsByUserIdDocument,
    "query InterviewersByGroupId($groupId: ID!) {\n  interviewersByGroupId(groupId: $groupId) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}": types.InterviewersByGroupIdDocument,
    "query IsAuthorizedByRole($accessToken: String!, $roles: [Role!]!) {\n  isAuthorizedByRole(accessToken: $accessToken, roles: $roles)\n}": types.IsAuthorizedByRoleDocument,
    "mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n  }\n}": types.LoginDocument,
    "mutation LoginWithGoogle($idToken: String!) {\n  loginWithGoogle(idToken: $idToken) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n    refreshToken\n  }\n}": types.LoginWithGoogleDocument,
    "mutation ReassignReviewer($applicantRecordId: ID!, $oldReviewerId: ID!, $newReviewerId: ID!) {\n  reassignReviewer(\n    applicantRecordId: $applicantRecordId\n    oldReviewerId: $oldReviewerId\n    newReviewerId: $newReviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n  }\n}": types.ReassignReviewerDocument,
    "mutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken)\n}": types.RefreshDocument,
    "mutation ReportInterviewConflict($interviewedApplicantRecordId: ID!, $interviewerId: ID!, $interviewHasConflict: InterviewConflict!) {\n  reportInterviewConflict(\n    interviewedApplicantRecordId: $interviewedApplicantRecordId\n    interviewerId: $interviewerId\n    interviewHasConflict: $interviewHasConflict\n  ) {\n    id\n    status\n  }\n}": types.ReportInterviewConflictDocument,
    "mutation ReportReviewConflict($applicantRecordId: ID!, $reviewerId: ID!) {\n  reportReviewConflict(\n    applicantRecordId: $applicantRecordId\n    reviewerId: $reviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n    score\n    reviewerHasConflict\n  }\n}": types.ReportReviewConflictDocument,
    "query ReviewDashboard($pageNumber: Int!, $resultsPerPage: Int!) {\n  reviewDashboard(pageNumber: $pageNumber, resultsPerPage: $resultsPerPage) {\n    applicantRecordId\n    firstName\n    lastName\n    position\n    timesApplied\n    applicationStatus\n    choice\n    reviewers {\n      id\n      firstName\n      lastName\n      email\n      position\n      role\n      isArchived\n    }\n    totalScore\n  }\n}": types.ReviewDashboardDocument,
    "query ReviewedApplicantRecordsByApplicantRecordId($applicantRecordId: ID!) {\n  reviewedApplicantRecordsByApplicantRecordId(\n    applicantRecordId: $applicantRecordId\n  ) {\n    applicantRecord {\n      id\n      position\n      combinedReviewScore\n    }\n    reviewedApplicantRecords {\n      reviewer {\n        id\n        firstName\n        lastName\n        email\n        role\n        position\n        isArchived\n      }\n      reviewedApplicantRecord {\n        review {\n          passionFSG\n          teamPlayer\n          desireToLearn\n          skill\n          skillCategory\n          comments\n        }\n        status\n        score\n        reviewerHasConflict\n      }\n    }\n  }\n}": types.ReviewedApplicantRecordsByApplicantRecordIdDocument,
    "mutation UpdateInterviewGroup($id: ID!, $interviewGroup: UpdateInterviewGroupDTO!) {\n  updateInterviewGroup(id: $id, interviewGroup: $interviewGroup) {\n    id\n    schedulingLink\n    status\n  }\n}": types.UpdateInterviewGroupDocument,
    "mutation UpdateInterviewGroupSchedulingLink($id: ID!, $schedulingLink: String!) {\n  updateInterviewGroupSchedulingLink(id: $id, schedulingLink: $schedulingLink) {\n    id\n    schedulingLink\n    status\n  }\n}": types.UpdateInterviewGroupSchedulingLinkDocument,
    "query UsersByPosition($position: String!) {\n  usersByPosition(position: $position) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}": types.UsersByPositionDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Application($applicantRecordId: ID!) {\n  application(applicantRecordId: $applicantRecordId) {\n    id\n    academicOrCoop\n    academicYear\n    email\n    firstName\n    lastName\n    heardFrom\n    locationPreference\n    program\n    pronouns\n    pronounsSpecified\n    resumeUrl\n    roleSpecificQuestions {\n      question\n      answer\n    }\n    shortAnswerQuestions {\n      question\n      answer\n    }\n    status\n    term\n    timesApplied\n  }\n}"): (typeof documents)["query Application($applicantRecordId: ID!) {\n  application(applicantRecordId: $applicantRecordId) {\n    id\n    academicOrCoop\n    academicYear\n    email\n    firstName\n    lastName\n    heardFrom\n    locationPreference\n    program\n    pronouns\n    pronounsSpecified\n    resumeUrl\n    roleSpecificQuestions {\n      question\n      answer\n    }\n    shortAnswerQuestions {\n      question\n      answer\n    }\n    status\n    term\n    timesApplied\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query InterviewGroup($id: ID!) {\n  interviewGroup(id: $id) {\n    id\n    schedulingLink\n    status\n  }\n}"): (typeof documents)["query InterviewGroup($id: ID!) {\n  interviewGroup(id: $id) {\n    id\n    schedulingLink\n    status\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query InterviewedApplicantsByUserId($userId: ID!) {\n  interviewedApplicantsByUserId(userId: $userId) {\n    applicantRecordId\n    interviewStatus\n    applicantFirstName\n    applicantLastName\n  }\n}"): (typeof documents)["query InterviewedApplicantsByUserId($userId: ID!) {\n  interviewedApplicantsByUserId(userId: $userId) {\n    applicantRecordId\n    interviewStatus\n    applicantFirstName\n    applicantLastName\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query InterviewersByGroupId($groupId: ID!) {\n  interviewersByGroupId(groupId: $groupId) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}"): (typeof documents)["query InterviewersByGroupId($groupId: ID!) {\n  interviewersByGroupId(groupId: $groupId) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query IsAuthorizedByRole($accessToken: String!, $roles: [Role!]!) {\n  isAuthorizedByRole(accessToken: $accessToken, roles: $roles)\n}"): (typeof documents)["query IsAuthorizedByRole($accessToken: String!, $roles: [Role!]!) {\n  isAuthorizedByRole(accessToken: $accessToken, roles: $roles)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n  }\n}"): (typeof documents)["mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation LoginWithGoogle($idToken: String!) {\n  loginWithGoogle(idToken: $idToken) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n    refreshToken\n  }\n}"): (typeof documents)["mutation LoginWithGoogle($idToken: String!) {\n  loginWithGoogle(idToken: $idToken) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n    accessToken\n    refreshToken\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation ReassignReviewer($applicantRecordId: ID!, $oldReviewerId: ID!, $newReviewerId: ID!) {\n  reassignReviewer(\n    applicantRecordId: $applicantRecordId\n    oldReviewerId: $oldReviewerId\n    newReviewerId: $newReviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n  }\n}"): (typeof documents)["mutation ReassignReviewer($applicantRecordId: ID!, $oldReviewerId: ID!, $newReviewerId: ID!) {\n  reassignReviewer(\n    applicantRecordId: $applicantRecordId\n    oldReviewerId: $oldReviewerId\n    newReviewerId: $newReviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken)\n}"): (typeof documents)["mutation Refresh($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation ReportInterviewConflict($interviewedApplicantRecordId: ID!, $interviewerId: ID!, $interviewHasConflict: InterviewConflict!) {\n  reportInterviewConflict(\n    interviewedApplicantRecordId: $interviewedApplicantRecordId\n    interviewerId: $interviewerId\n    interviewHasConflict: $interviewHasConflict\n  ) {\n    id\n    status\n  }\n}"): (typeof documents)["mutation ReportInterviewConflict($interviewedApplicantRecordId: ID!, $interviewerId: ID!, $interviewHasConflict: InterviewConflict!) {\n  reportInterviewConflict(\n    interviewedApplicantRecordId: $interviewedApplicantRecordId\n    interviewerId: $interviewerId\n    interviewHasConflict: $interviewHasConflict\n  ) {\n    id\n    status\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation ReportReviewConflict($applicantRecordId: ID!, $reviewerId: ID!) {\n  reportReviewConflict(\n    applicantRecordId: $applicantRecordId\n    reviewerId: $reviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n    score\n    reviewerHasConflict\n  }\n}"): (typeof documents)["mutation ReportReviewConflict($applicantRecordId: ID!, $reviewerId: ID!) {\n  reportReviewConflict(\n    applicantRecordId: $applicantRecordId\n    reviewerId: $reviewerId\n  ) {\n    applicantRecordId\n    reviewerId\n    status\n    score\n    reviewerHasConflict\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query ReviewDashboard($pageNumber: Int!, $resultsPerPage: Int!) {\n  reviewDashboard(pageNumber: $pageNumber, resultsPerPage: $resultsPerPage) {\n    applicantRecordId\n    firstName\n    lastName\n    position\n    timesApplied\n    applicationStatus\n    choice\n    reviewers {\n      id\n      firstName\n      lastName\n      email\n      position\n      role\n      isArchived\n    }\n    totalScore\n  }\n}"): (typeof documents)["query ReviewDashboard($pageNumber: Int!, $resultsPerPage: Int!) {\n  reviewDashboard(pageNumber: $pageNumber, resultsPerPage: $resultsPerPage) {\n    applicantRecordId\n    firstName\n    lastName\n    position\n    timesApplied\n    applicationStatus\n    choice\n    reviewers {\n      id\n      firstName\n      lastName\n      email\n      position\n      role\n      isArchived\n    }\n    totalScore\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query ReviewedApplicantRecordsByApplicantRecordId($applicantRecordId: ID!) {\n  reviewedApplicantRecordsByApplicantRecordId(\n    applicantRecordId: $applicantRecordId\n  ) {\n    applicantRecord {\n      id\n      position\n      combinedReviewScore\n    }\n    reviewedApplicantRecords {\n      reviewer {\n        id\n        firstName\n        lastName\n        email\n        role\n        position\n        isArchived\n      }\n      reviewedApplicantRecord {\n        review {\n          passionFSG\n          teamPlayer\n          desireToLearn\n          skill\n          skillCategory\n          comments\n        }\n        status\n        score\n        reviewerHasConflict\n      }\n    }\n  }\n}"): (typeof documents)["query ReviewedApplicantRecordsByApplicantRecordId($applicantRecordId: ID!) {\n  reviewedApplicantRecordsByApplicantRecordId(\n    applicantRecordId: $applicantRecordId\n  ) {\n    applicantRecord {\n      id\n      position\n      combinedReviewScore\n    }\n    reviewedApplicantRecords {\n      reviewer {\n        id\n        firstName\n        lastName\n        email\n        role\n        position\n        isArchived\n      }\n      reviewedApplicantRecord {\n        review {\n          passionFSG\n          teamPlayer\n          desireToLearn\n          skill\n          skillCategory\n          comments\n        }\n        status\n        score\n        reviewerHasConflict\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateInterviewGroup($id: ID!, $interviewGroup: UpdateInterviewGroupDTO!) {\n  updateInterviewGroup(id: $id, interviewGroup: $interviewGroup) {\n    id\n    schedulingLink\n    status\n  }\n}"): (typeof documents)["mutation UpdateInterviewGroup($id: ID!, $interviewGroup: UpdateInterviewGroupDTO!) {\n  updateInterviewGroup(id: $id, interviewGroup: $interviewGroup) {\n    id\n    schedulingLink\n    status\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateInterviewGroupSchedulingLink($id: ID!, $schedulingLink: String!) {\n  updateInterviewGroupSchedulingLink(id: $id, schedulingLink: $schedulingLink) {\n    id\n    schedulingLink\n    status\n  }\n}"): (typeof documents)["mutation UpdateInterviewGroupSchedulingLink($id: ID!, $schedulingLink: String!) {\n  updateInterviewGroupSchedulingLink(id: $id, schedulingLink: $schedulingLink) {\n    id\n    schedulingLink\n    status\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query UsersByPosition($position: String!) {\n  usersByPosition(position: $position) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}"): (typeof documents)["query UsersByPosition($position: String!) {\n  usersByPosition(position: $position) {\n    id\n    firstName\n    lastName\n    email\n    role\n    position\n    isArchived\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;