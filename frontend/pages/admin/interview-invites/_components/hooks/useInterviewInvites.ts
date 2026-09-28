import { useEffect, useState } from "react";
import InterviewInvitesAPIClient from "@/APIClients/InterviewInvitesAPIClient";
import type { InterviewInviteResult } from "@/graphql/typeUtils";

type UseInterviewInvitesResult = {
  invites: InterviewInviteResult[];
  isLoading: boolean;
  error: boolean;
};

const useInterviewInvites = (): UseInterviewInvitesResult => {
  const [state, setState] = useState<UseInterviewInvitesResult>({
    invites: [],
    isLoading: false,
    error: false,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isLoading: true, error: false }));

    InterviewInvitesAPIClient.getInterviewInvites()
      .then((invites) => {
        setState({ invites, isLoading: false, error: false });
      })
      .catch((err) => {
        console.error("[interviewInvites] fetch failed:", err);
        setState({ invites: [], isLoading: false, error: true });
      });
  }, []);

  return state;
};

export default useInterviewInvites;
