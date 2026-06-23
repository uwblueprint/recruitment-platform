import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { SplitPanelLayout } from "@/components/layouts/SplitPageLayout";
import { InterviewHeader } from "@/pages/interview/_components/layout";
import HomeAPIClient from "@/APIClients/HomeAPIClient";
import {
  type InterviewedApplicantsDTO,
  type InterviewedPairingResult,
  type ReviewedApplicantResult,
} from "@/graphql/typeUtils";
import { NextPageWithLayout } from "../_app";
import IllustrationPanel from "./_components/IllustrationPanel";
import Tabs from "@/components/common/Tabs";
import {
  Tab,
  HomeTab,
  TABS,
  REVIEW_STATUS_LABEL,
  REVIEW_STATUS_VARIANT,
  INTERVIEW_STATUS_LABEL,
  INTERVIEW_STATUS_VARIANT,
  INTERVIEW_GROUP_STATUS_LABEL,
  INTERVIEW_GROUP_STATUS_VARIANT,
} from "./_components/constants";
import { Button } from "@/components/common/Button";
import StatusBadge from "./_components/StatusBadge";
import HomeTable from "./_components/HomeTable";

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mb-3 h-12 w-12 text-black"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
    <p className="font-source text-sm">{message}</p>
  </div>
);

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const user = useAuthenticatedUser();

  const [activeTab, setActiveTab] = useState<Tab>(HomeTab.APPLICATION_REVIEW);
  const [reviewedApplicants, setReviewedApplicants] = useState<ReviewedApplicantResult[]>([]);
  const [interviewedApplicants, setInterviewedApplicants] = useState<InterviewedApplicantsDTO[]>([]);
  const [interviewedPairings, setInterviewedPairings] = useState<InterviewedPairingResult[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      try {
        const [reviewed, interviewed, pairings] = await Promise.all([
          HomeAPIClient.getReviewedApplicantsByUserId(user.id),
          HomeAPIClient.getInterviewedApplicantsByUserId(user.id),
          HomeAPIClient.getInterviewedPairingsByUserId(user.id),
        ]);
        setReviewedApplicants(reviewed);
        setInterviewedApplicants(interviewed);
        setInterviewedPairings(pairings);
      } catch {}
    };
    fetchData();
  }, [user?.id]);

  const tabCounts: Record<Tab, number> = {
    [HomeTab.APPLICATION_REVIEW]: reviewedApplicants.length,
    [HomeTab.INTERVIEW_REVIEW]: interviewedApplicants.length,
    [HomeTab.INTERVIEW_PAIRING]: interviewedPairings.length,
  };

  const totalApplications =
    reviewedApplicants.length + interviewedApplicants.length + interviewedPairings.length;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-10">
      <h1 className="font-poppins text-2xl font-bold text-neutral-900">
        Welcome{" "}
        <span className="text-blue">
          {user?.firstName} {user?.lastName}
        </span>
        !
      </h1>
      <p className="mt-2 font-source text-base text-neutral-700">
        You have{" "}
        <span className="font-semibold text-blue">{totalApplications}</span>{" "}
        applications to review and complete.
      </p>

      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        counts={tabCounts}
      />

      <div className="mt-6">
        {activeTab === HomeTab.APPLICATION_REVIEW &&
          (reviewedApplicants.length === 0 ? (
            <EmptyState message="No applicants assigned." />
          ) : (
            <HomeTable headers={["Name", "Status", "View application"]}>
              {reviewedApplicants.map((applicant) => (
                <tr
                  key={applicant.applicantRecordId}
                  className="border-b border-neutral-100 last:border-b-0"
                >
                  <td className="px-4 py-4 font-source text-sm text-neutral-800">
                    {applicant.applicantFirstName} {applicant.applicantLastName}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      variant={REVIEW_STATUS_VARIANT[applicant.reviewStatus]}
                      label={REVIEW_STATUS_LABEL[applicant.reviewStatus]}
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => router.push(`/review/${applicant.applicantRecordId}`)}>
                      Review application →
                    </Button>
                  </td>
                </tr>
              ))}
            </HomeTable>
          ))}

        {activeTab === HomeTab.INTERVIEW_REVIEW &&
          (interviewedApplicants.length === 0 ? (
            <EmptyState message="No applicants assigned." />
          ) : (
            <HomeTable headers={["Name", "Status", "View application"]}>
              {interviewedApplicants.map((applicant) => (
                <tr
                  key={applicant.applicantRecordId}
                  className="border-b border-neutral-100 last:border-b-0"
                >
                  <td className="px-4 py-4 font-source text-sm text-neutral-800">
                    {applicant.applicantFirstName} {applicant.applicantLastName}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      variant={INTERVIEW_STATUS_VARIANT[applicant.interviewStatus]}
                      label={INTERVIEW_STATUS_LABEL[applicant.interviewStatus]}
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => router.push(`/interview/${applicant.applicantRecordId}`)}>
                      Review application →
                    </Button>
                  </td>
                </tr>
              ))}
            </HomeTable>
          ))}

        {activeTab === HomeTab.INTERVIEW_PAIRING &&
          (interviewedPairings.length === 0 ? (
            <EmptyState message="Interview pairs have not been released yet." />
          ) : (
            <HomeTable headers={["Interview Partner", "Status", "View details"]}>
              {interviewedPairings.map((pairing) => (
                <tr
                  key={pairing.interviewedGroupId}
                  className="border-b border-neutral-100 last:border-b-0"
                >
                  <td className="px-4 py-4 font-source text-sm text-neutral-800">
                    {pairing.groupMembers
                      .filter((m) => String(m.id) !== String(user?.id))
                      .map((m) => `${m.firstName} ${m.lastName}`)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      variant={INTERVIEW_GROUP_STATUS_VARIANT[pairing.interviewGroupStatus]}
                      label={INTERVIEW_GROUP_STATUS_LABEL[pairing.interviewGroupStatus]}
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => router.push(`/interview-groups/${pairing.interviewedGroupId}`)}>
                      View details →
                    </Button>
                  </td>
                </tr>
              ))}
            </HomeTable>
          ))}
      </div>
    </div>
  );
};

HomePage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>
    <SplitPanelLayout header={<InterviewHeader steps={[]} />}>
      <IllustrationPanel />
      {page}
    </SplitPanelLayout>
  </ProtectedRoute>
);

export default HomePage;
