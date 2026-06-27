import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ReviewedApplicantRecordWithReviewerResult } from "@/graphql/typeUtils";

interface ProfileCommentsPanelProps {
  reviewers: ReviewedApplicantRecordWithReviewerResult[];
}

const SKILL_CATEGORY_LABEL: Record<string, string> = {
  JUNIOR: "Junior",
  INTERMEDIATE: "Intermediate",
  SENIOR: "Senior",
};

const formatSkillCategory = (raw: string | null | undefined): string =>
  raw ? (SKILL_CATEGORY_LABEL[raw] ?? raw) : "—";

export const ProfileCommentsPanel = ({
  reviewers,
}: ProfileCommentsPanelProps) => {
  return (
    <PanelLayout title="Additional information / Comments">
      <div className="mt-6 flex w-full flex-col gap-8">
        <section className="flex flex-col gap-6">
          <h3 className="font-poppins text-xl font-medium leading-7 text-blue">
            Skill Category
          </h3>
          {reviewers.length === 0 ? (
            <p className="text-base text-neutral-800/75">
              No reviewer scores to display.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {reviewers.map(({ reviewer, reviewedApplicantRecord }) => (
                <div
                  key={reviewer.id}
                  className="flex flex-col gap-3"
                >
                  <p className="font-source text-base leading-[1.4] text-black/75">
                    {reviewer.firstName} Rated:
                  </p>
                  <div className="flex h-[55px] w-full items-center rounded-md border border-neutral-200 bg-white px-4 text-base leading-6 text-neutral-800">
                    {formatSkillCategory(
                      reviewedApplicantRecord.review?.skillCategory,
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr className="border-neutral-200" />

        <section className="flex flex-col gap-6">
          <h3 className="font-poppins text-xl font-medium leading-7 text-blue">
            Comments
          </h3>
          {reviewers.length === 0 ? (
            <p className="text-base text-neutral-800/75">
              No comments to display.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {reviewers.map(({ reviewer, reviewedApplicantRecord }) => (
                <div key={reviewer.id} className="flex flex-col gap-3">
                  <p className="font-source text-base font-semibold leading-[1.4] text-neutral-800">
                    {reviewer.firstName} {reviewer.lastName}&rsquo;s Comment:
                  </p>
                  <p className="font-source text-base leading-[1.4] text-neutral-800/75 whitespace-pre-wrap">
                    {reviewedApplicantRecord.review?.comments || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PanelLayout>
  );
};
