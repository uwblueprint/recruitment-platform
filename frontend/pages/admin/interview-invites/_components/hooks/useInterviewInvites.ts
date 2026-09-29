import useInterviewInvitesData from "@/APIClients/queries/useInterviewInvites";
import type { InterviewInvite } from "../types";

export default function useInterviewInvites() {
  const { data, loading, error, refetch } = useInterviewInvitesData();

  const invites: InterviewInvite[] = (data ?? []).map((invite) => ({
    id: invite.id,
    interviewers: invite.interviewers.map(
      (u) => `${u.firstName} ${u.lastName}`,
    ),
    interviewees: invite.interviewees.map((ie) => ({
      name: `${ie.firstName} ${ie.lastName}`,
      role: ie.position,
    })),
    interviewType: invite.position,
    calendlyLink: invite.schedulingLink ?? "",
    status: invite.status,
  }));

  return { invites, isLoading: loading, error, refetch };
}
