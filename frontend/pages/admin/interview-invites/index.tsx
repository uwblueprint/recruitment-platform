import { NextPageWithLayout } from "../../_app";
import { getAdminLayout } from "@/components/layouts/AdminLayout";
import { InterviewInviteList } from "./_components/InterviewInviteList";
import useInterviewInvites from "./_components/hooks/useInterviewInvites";

const InterviewInvites: NextPageWithLayout = () => {
  const { invites, isLoading, error } = useInterviewInvites();


  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
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

InterviewInvites.getLayout = getAdminLayout;

export default InterviewInvites;
