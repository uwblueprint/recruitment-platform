import { NextPageWithLayout } from "../../_app";
import { getAdminLayout } from "@/components/layouts/AdminLayout";
import { InterviewInviteList } from "./_components/InterviewInviteList";

const InterviewInvites: NextPageWithLayout = () => {

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <main className="flex flex-col items-start gap-5 flex-1 self-stretch px-6 py-3">
        <h1 className="font-poppins font-semibold text-[28px] text-blue leading-[1.4]">
          Interview invite Dashboard
        </h1>

        <InterviewInviteList />
      </main>
    </div>
  );
};

InterviewInvites.getLayout = getAdminLayout;

export default InterviewInvites;
