import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewGroupDocument,
  InterviewedApplicantsByUserIdDocument,
  InterviewersByGroupIdDocument,
  type InterviewGroupQuery,
  type InterviewGroupQueryVariables,
  type InterviewedApplicantsByUserIdQuery,
  type InterviewedApplicantsByUserIdQueryVariables,
  type InterviewersByGroupIdQuery,
  type InterviewersByGroupIdQueryVariables,
  type InterviewedApplicantsDTO,
  type InterviewGroupDTO,
  type UserDTO,
} from "@/graphql/typeUtils";

type UseInterviewGroupDataResult = {
  group: InterviewGroupDTO | null;
  interviewedApplicants: InterviewedApplicantsDTO[];
  interviewers: UserDTO[];
  isLoading: boolean;
  error: boolean;
};

const useInterviewGroupData = (
  interviewGroupId: string | null,
  userId: string | null
): UseInterviewGroupDataResult => {
  const options = {
    fetchPolicy: "network-only" as const,
    context: { refreshAuth: true },
  };
  const groupQuery = useQuery<
    InterviewGroupQuery,
    InterviewGroupQueryVariables
  >(
    InterviewGroupDocument,
    interviewGroupId && userId
      ? { ...options, variables: { id: interviewGroupId } }
      : skipToken
  );
  const applicantsQuery = useQuery<
    InterviewedApplicantsByUserIdQuery,
    InterviewedApplicantsByUserIdQueryVariables
  >(
    InterviewedApplicantsByUserIdDocument,
    interviewGroupId && userId
      ? { ...options, variables: { userId } }
      : skipToken
  );
  const interviewersQuery = useQuery<
    InterviewersByGroupIdQuery,
    InterviewersByGroupIdQueryVariables
  >(
    InterviewersByGroupIdDocument,
    interviewGroupId && userId
      ? { ...options, variables: { groupId: interviewGroupId } }
      : skipToken
  );

  // skipToken retains previous data; never expose it without both current IDs.
  if (!interviewGroupId || !userId) {
    return {
      group: null,
      interviewedApplicants: [],
      interviewers: [],
      isLoading: false,
      error: false,
    };
  }

  const isLoading =
    groupQuery.loading || applicantsQuery.loading || interviewersQuery.loading;
  const group = groupQuery.data?.interviewGroup;
  const interviewedApplicants =
    applicantsQuery.data?.interviewedApplicantsByUserId;
  const interviewers = interviewersQuery.data?.interviewersByGroupId;
  const error =
    !!(groupQuery.error || applicantsQuery.error || interviewersQuery.error) ||
    (!isLoading &&
      (!group ||
        !interviewedApplicants ||
        !interviewers?.some(
          (interviewer) => String(interviewer.id) === String(userId)
        )));
  const canShowData = !isLoading && !error;

  return {
    group: canShowData ? group ?? null : null,
    interviewedApplicants: canShowData ? interviewedApplicants ?? [] : [],
    interviewers: canShowData ? interviewers ?? [] : [],
    isLoading,
    error,
  };
};

export default useInterviewGroupData;
