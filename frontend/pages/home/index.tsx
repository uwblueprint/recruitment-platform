import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { SplitPanelLayout } from "@/components/layouts/SplitPageLayout";
import { InterviewHeader } from "@/pages/interview/_components/layout";
import HomeAPIClient from "@/APIClients/HomeAPIClient";
import {
  InterviewGroupStatus,
  InterviewStatus,
  ReviewStatus,
  type InterviewedApplicantsDTO,
  type InterviewedPairingResult,
  type ReviewedApplicantResult,
} from "@/graphql/typeUtils";
import { NextPageWithLayout } from "../_app";
import IllustrationPanel from "./_components/IllustrationPanel";

const TABS = ["Application Review", "Interview Review", "Interview Pairing"] as const;
type Tab = (typeof TABS)[number];

const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  [ReviewStatus.Todo]: "Needs Review",
  [ReviewStatus.InProgress]: "In Progress",
  [ReviewStatus.Done]: "Completed",
  [ReviewStatus.Conflict]: "Conflict",
};

const INTERVIEW_STATUS_LABEL: Record<InterviewStatus, string> = {
  [InterviewStatus.NeedsReview]: "Needs Review",
  [InterviewStatus.InProgress]: "In Progress",
  [InterviewStatus.Complete]: "Completed",
};

const INTERVIEW_GROUP_STATUS_LABEL: Record<InterviewGroupStatus, string> = {
  [InterviewGroupStatus.AvailabilityPending]: "Awaiting re-assignment",
  [InterviewGroupStatus.InvitesSent]: "Invites Sent",
  [InterviewGroupStatus.ReadyToInterview]: "Ready to interview",
};

type StatusVariant = "gray" | "amber" | "green" | "blue";

const REVIEW_STATUS_VARIANT: Record<ReviewStatus, StatusVariant> = {
  [ReviewStatus.Todo]: "gray",
  [ReviewStatus.InProgress]: "amber",
  [ReviewStatus.Done]: "green",
  [ReviewStatus.Conflict]: "amber",
};

const INTERVIEW_STATUS_VARIANT: Record<InterviewStatus, StatusVariant> = {
  [InterviewStatus.NeedsReview]: "gray",
  [InterviewStatus.InProgress]: "amber",
  [InterviewStatus.Complete]: "green",
};

const INTERVIEW_GROUP_STATUS_VARIANT: Record<InterviewGroupStatus, StatusVariant> = {
  [InterviewGroupStatus.AvailabilityPending]: "amber",
  [InterviewGroupStatus.InvitesSent]: "blue",
  [InterviewGroupStatus.ReadyToInterview]: "green",
};

const BADGE_CLASSES: Record<StatusVariant, string> = {
  gray: "border border-neutral-400 text-neutral-600 bg-neutral-50",
  amber: "border border-amber-400 text-amber-700 bg-amber-50",
  green: "border border-green-400 text-green-700 bg-green-50",
  blue: "border border-blue-400 text-blue-700 bg-blue-50",
};

const StatusBadge = ({ variant, label }: { variant: StatusVariant; label: string }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${BADGE_CLASSES[variant]}`}
  >
    {label}
  </span>
);

const ActionButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 rounded-full border border-blue px-4 py-1.5 text-sm font-medium text-blue transition-colors hover:bg-blue hover:text-white"
  >
    {label} <span aria-hidden>→</span>
  </button>
);

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const user = useAuthenticatedUser();

  const [activeTab, setActiveTab] = useState<Tab>("Application Review");
  const [reviewedApplicants, setReviewedApplicants] = useState<ReviewedApplicantResult[]>([]);
  const [interviewedApplicants, setInterviewedApplicants] = useState<InterviewedApplicantsDTO[]>([]);
  const [interviewedPairings, setInterviewedPairings] = useState<InterviewedPairingResult[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    HomeAPIClient.getReviewedApplicantsByUserId(user.id).then(setReviewedApplicants).catch(() => {});
    HomeAPIClient.getInterviewedApplicantsByUserId(user.id).then(setInterviewedApplicants).catch(() => {});
    HomeAPIClient.getInterviewedPairingsByUserId(user.id).then(setInterviewedPairings).catch(() => {});
  }, [user?.id]);

  const tabCounts: Record<Tab, number> = {
    "Application Review": reviewedApplicants.length,
    "Interview Review": interviewedApplicants.length,
    "Interview Pairing": interviewedPairings.length,
  };

  const totalApplications =
    reviewedApplicants.length +
    interviewedApplicants.length +
    interviewedPairings.length;

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
        <span className="text-blue font-semibold">{totalApplications}</span>{" "}
        applications to review and complete.
      </p>

      {/* Tab navigation */}
      <div className="mt-8 flex gap-8 border-b border-neutral-200">
        {TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-start pb-3 transition-colors ${
                active ? "border-b-2 border-blue text-blue" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <span className="font-poppins text-sm font-semibold">{tab}</span>
              <span className="font-source text-xs">
                {tabCounts[tab]} applications
              </span>
            </button>
          );
        })}
      </div>

      {/* Tables */}
      <div className="mt-6">
        {activeTab === "Application Review" && (
          <div className="rounded-lg border border-neutral-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 pb-3 pt-4 font-poppins text-sm font-semibold text-neutral-800">Name</th>
                  <th className="px-4 pb-3 pt-4 font-poppins text-sm font-semibold text-neutral-800">Status</th>
                  <th className="px-4 pb-3 pt-4 text-right font-poppins text-sm font-semibold text-neutral-800">View application</th>
                </tr>
              </thead>
              <tbody>
                {reviewedApplicants.map((applicant) => (
                  <tr key={applicant.applicantRecordId} className="border-b border-neutral-100 last:border-b-0">
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
                      <ActionButton
                        label="Review application"
                        onClick={() => router.push(`/review/${applicant.applicantRecordId}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Interview Review" && (
          <div className="rounded-lg border border-neutral-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 pb-3 pt-4 font-poppins text-sm font-semibold text-neutral-800">Name</th>
                  <th className="px-4 pb-3 pt-4 font-poppins text-sm font-semibold text-neutral-800">Status</th>
                  <th className="px-4 pb-3 pt-4 text-right font-poppins text-sm font-semibold text-neutral-800">View application</th>
                </tr>
              </thead>
              <tbody>
                {interviewedApplicants.map((applicant) => (
                  <tr key={applicant.applicantRecordId} className="border-b border-neutral-100 last:border-b-0">
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
                      <ActionButton
                        label="Review application"
                        onClick={() => router.push(`/interview/${applicant.applicantRecordId}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Interview Pairing" && (
          interviewedPairings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="font-source text-sm">Interview pairs have not been released yet.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-200">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-4 pb-3 pt-4 font-poppins text-sm font-semibold text-neutral-800">Interview Partner</th>
                    <th className="px-4 pb-3 pt-4 font-poppins text-sm font-semibold text-neutral-800">Status</th>
                    <th className="px-4 pb-3 pt-4 text-right font-poppins text-sm font-semibold text-neutral-800">View application</th>
                  </tr>
                </thead>
                <tbody>
                  {interviewedPairings.map((pairing) => (
                    <tr key={pairing.interviewedGroupId} className="border-b border-neutral-100 last:border-b-0">
                      <td className="px-4 py-4 font-source text-sm text-neutral-800">
                        {pairing.groupMembers
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
                        <ActionButton
                          label="View details"
                          onClick={() => router.push(`/interview-group/${pairing.interviewedGroupId}`)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
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
