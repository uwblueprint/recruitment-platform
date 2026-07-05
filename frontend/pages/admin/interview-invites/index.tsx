import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import { InterviewInvite } from "./_components/types";
import { InterviewInviteList } from "./_components/InterviewInviteList";
import useInterviewInvites from "./_components/hooks/useInterviewInvites";

const InterviewInvites: NextPageWithLayout = () => {
  const { invites: rawInvites, isLoading, error } = useInterviewInvites();

  const invites: InterviewInvite[] = rawInvites.map((invite, idx) => ({
    id: idx,
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

  return (
    <div className="flex h-screen flex-col bg-white">
      <main className="flex flex-col items-start gap-5 flex-1 self-stretch px-6 py-3">
        <h1 className="font-poppins font-semibold text-[28px] text-blue leading-[1.4]">
          Interview invite Dashboard
        </h1>

        {error ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            Failed to load interview invites
          </div>
        ) : null}

        {!isLoading && !error ? (
          <InterviewInviteList invites={invites} />
        ) : null}
      </main>
    </div>
  );
};

InterviewInvites.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>{page}</ProtectedRoute>
);

export default InterviewInvites;
