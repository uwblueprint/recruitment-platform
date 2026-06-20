import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import { InterviewInvite } from "./_components/types";
import { InterviewInviteList } from "./_components/InterviewInviteList";

const MOCK_INVITES: InterviewInvite[] = [
  {
    id: 1,
    interviewers: ["Justin Luu", "Justin Luu"],
    interviewees: [
      { name: "Pascal Siakam", role: "Product Designer" },
      { name: "Vladimir Guerrero Jr.", role: "VPD" },
      { name: "Giannis Antetokounmpo", role: "Product Designer" },
    ],
    interviewType: "Product Design Interviews",
    calendlyLink: "https://calendly.com/justin-availability",
    status: "Ready for invite",
  },
  {
    id: 2,
    interviewers: ["Justin Luu", "Justin Luu"],
    interviewees: [
      { name: "Pascal Siakam", role: "Product Designer" },
      { name: "Vladimir Guerrero Jr.", role: "VPD" },
      { name: "Giannis Antetokounmpo", role: "Product Designer" },
    ],
    interviewType: "Product Design Interviews",
    calendlyLink: "https://calendly.com/justin-availability",
    status: "Ready for invite",
  },
  {
    id: 3,
    interviewers: ["Justin Luu"],
    interviewees: [{ name: "Pascal Siakam", role: "Product Designer" }],
    interviewType: "Product Design Interviews",
    calendlyLink: "https://calendly.com/justin-availability",
    status: "Ready for invite",
  },
];

const InterviewInvites: NextPageWithLayout = () => {
  return (
    <div className="flex h-screen flex-col bg-white">
      <main className="flex flex-col items-start gap-5 flex-1 self-stretch px-6 py-3">
        <h1 className="font-poppins font-semibold text-[28px] text-blue leading-[1.4]">
          Interview Invites
        </h1>
        <InterviewInviteList invites={MOCK_INVITES} />
      </main>
    </div>
  );
};

InterviewInvites.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>{page}</ProtectedRoute>
);

export default InterviewInvites;
