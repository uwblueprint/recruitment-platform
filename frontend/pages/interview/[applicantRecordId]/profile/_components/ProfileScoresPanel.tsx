import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ReviewedApplicantRecordWithReviewerResult } from "@/graphql/typeUtils";

interface ProfileScoresPanelProps {
  reviewers: ReviewedApplicantRecordWithReviewerResult[];
  combinedReviewScore: number | null | undefined;
}

const DIMENSION_ROWS: {
  label: string;
  field: "passionFSG" | "teamPlayer" | "desireToLearn" | "skill";
}[] = [
  { label: "Passion for Social Good", field: "passionFSG" },
  { label: "Team Player", field: "teamPlayer" },
  { label: "Desire to Learn", field: "desireToLearn" },
  { label: "Skill", field: "skill" },
];

export const ProfileScoresPanel = ({
  reviewers,
  combinedReviewScore,
}: ProfileScoresPanelProps) => {
  const maxTotal = reviewers.length * 20;

  return (
    <PanelLayout title="Application Scores">
      <div className="mt-6 flex w-full flex-col gap-8 rounded-lg border border-neutral-200 bg-white p-6">
        {reviewers.length === 0 ? (
          <p className="text-base text-neutral-800/75">
            No reviewer scores to display.
          </p>
        ) : (
          reviewers.map(({ reviewer, reviewedApplicantRecord }, idx) => (
            <div key={reviewer.id} className="flex flex-col gap-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex w-[235px] flex-col gap-6">
                  <span className="font-poppins text-xl font-medium leading-7 text-blue">
                    Topic
                  </span>
                  {DIMENSION_ROWS.map(({ label }) => (
                    <span
                      key={label}
                      className="font-source text-base font-normal leading-snug text-black"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col items-end gap-6">
                  <span className="font-poppins text-xl font-normal leading-7 text-blue whitespace-nowrap">
                    {reviewer.firstName}&rsquo;s rating
                  </span>
                  {DIMENSION_ROWS.map(({ label, field }) => (
                    <span
                      key={label}
                      className="font-source text-base font-normal leading-snug text-black"
                    >
                      {reviewedApplicantRecord.review?.[field] != null
                        ? `${reviewedApplicantRecord.review[field]}/5`
                        : "—/5"}
                    </span>
                  ))}
                </div>
              </div>
              {idx < reviewers.length - 1 ? (
                <hr className="border-neutral-200" />
              ) : null}
            </div>
          ))
        )}
        {reviewers.length > 0 ? (
          <>
            <hr className="border-neutral-200" />
            <div className="flex items-center justify-between">
              <span className="font-poppins text-xl font-medium leading-7 text-black">
                Total Score
              </span>
              <span className="font-poppins text-xl font-bold leading-7 text-blue">
                {combinedReviewScore ?? "—"}/{maxTotal}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </PanelLayout>
  );
};
