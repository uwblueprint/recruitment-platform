import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { ReviewStage } from "../constants";
import { ReviewEndData, ReviewScores } from "../types";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ArrowLeftIcon } from "@/components/icons/arrow-left.icon";
import Link from "next/link";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ReviewedApplicantRecordWithReviewerResult } from "@/graphql/typeUtils";

interface Props {
  name: string;
  reviewerName: string;
  scores: ReviewScores;
  endData: ReviewEndData;
  setEndData: Dispatch<SetStateAction<ReviewEndData>>;
  onReportConflict?: () => void;
  viewOnly?: boolean;
  reviewers?: ReviewedApplicantRecordWithReviewerResult[];
  combinedReviewScore?: number | null;
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

const SCORE_ROWS: { label: string; stage: ReviewStage }[] = [
  { label: "Passion for Social Good", stage: ReviewStage.PFSG },
  { label: "Team Player", stage: ReviewStage.TP },
  { label: "Desire to Learn", stage: ReviewStage.D2L },
  { label: "Skill", stage: ReviewStage.SKL },
];

const formatSkillCategory = (raw: string | null | undefined): string => {
  if (!raw) return "—";
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
};

const SKILL_CATEGORY_RANK: Record<string, number> = {
  JUNIOR: 1,
  INTERMEDIATE: 2,
  SENIOR: 3,
};

const aggregateSkillCategory = (
  reviewers: ReviewedApplicantRecordWithReviewerResult[],
): string => {
  const categories = reviewers
    .map(
      ({ reviewedApplicantRecord }) =>
        reviewedApplicantRecord.review?.skillCategory,
    )
    .filter((category): category is NonNullable<typeof category> =>
      Boolean(category),
    );
  if (categories.length === 0) return "—";
  const highest = categories.reduce((max, category) =>
    (SKILL_CATEGORY_RANK[category] ?? 0) > (SKILL_CATEGORY_RANK[max] ?? 0)
      ? category
      : max,
  );
  return formatSkillCategory(highest);
};

const LeftPanelContent = ({
  name,
  reviewerName,
  scores,
  onReportConflict,
}: {
  name: string;
  reviewerName: string;
  scores: ReviewScores;
  onReportConflict?: () => void;
}) => {
  const totalScore = SCORE_ROWS.reduce(
    (sum, { stage }) => sum + scores[stage],
    0,
  );

  return (
    <div className="flex flex-col gap-6 p-3 w-full">
      <div className="flex justify-between items-center w-full gap-4 shrink-0">
        <Link href="/admin" className="w-fit shrink-0 flex items-center gap-2 py-2 px-4 rounded-full border-2 border-blue bg-white hover:bg-gray-50 transition-colors text-blue text-base font-normal leading-snug no-underline">
            <ArrowLeftIcon className="w-6 h-6 text-blue" />
            Back to home
        </Link>
        <ReportConflictButton
          name={name}
          showQuestion
          onClick={onReportConflict}
        />
      </div>

      {/* Scoring section */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-neutral-800/75 font-normal text-base leading-snug">
            Scoring
          </p>
          <h2 className="text-neutral-800 text-3xl leading-snug">
            {name}&apos;s final scores
          </h2>
        </div>

        {/* Score card */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-6 w-[235px]">
              <span className="text-blue font-medium text-xl leading-7 font-poppins">
                Topic
              </span>
              {SCORE_ROWS.map(({ label }) => (
                <span
                  key={label}
                  className="text-black font-normal text-base leading-snug"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-6 items-end">
              <span className="text-blue font-normal text-xl leading-7 font-poppins">
                {reviewerName}&apos;s rating
              </span>
              {SCORE_ROWS.map(({ label, stage }) => (
                <span
                  key={label}
                  className="text-black font-normal text-base leading-snug"
                >
                  {scores[stage]}/5
                </span>
              ))}
            </div>
          </div>
          <hr className="border-neutral-200" />
          <div className="flex justify-between items-center">
            <span className="text-black font-medium text-xl leading-7 font-poppins">
              Total Score
            </span>
            <span className="text-blue font-normal text-xl leading-7 font-poppins">
              {totalScore}/20
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewerScoresSection = ({
  reviewers,
  combinedReviewScore,
}: {
  reviewers: ReviewedApplicantRecordWithReviewerResult[];
  combinedReviewScore: number | null;
}) => {
  const maxTotal = reviewers.length * 20;

  return (
    <div className="flex flex-col gap-8 rounded-lg border border-neutral-200 bg-white p-6">
      {reviewers.map(({ reviewer, reviewedApplicantRecord }, idx) => (
        <div key={reviewer.id} className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex w-[235px] flex-col gap-6">
              <span className="font-poppins text-xl font-medium leading-7 text-blue">
                Topic
              </span>
              {DIMENSION_ROWS.map(({ label }) => (
                <span
                  key={label}
                  className="text-base font-normal leading-snug text-black"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex flex-col items-end gap-6">
              <span className="font-poppins text-xl font-normal leading-7 text-blue">
                {reviewer.firstName}&rsquo;s rating
              </span>
              {DIMENSION_ROWS.map(({ label, field }) => (
                <span
                  key={label}
                  className="text-base font-normal leading-snug text-black"
                >
                  {reviewedApplicantRecord.review?.[field]
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
      ))}
      <hr className="border-neutral-200" />
      <div className="flex items-center justify-between">
        <span className="font-poppins text-xl font-medium leading-7 text-black">
          Total Score
        </span>
        <span className="font-poppins text-xl font-bold leading-7 text-blue">
          {combinedReviewScore ?? "—"}/{maxTotal}
        </span>
      </div>
    </div>
  );
};

const ViewOnlyLeftPanel = ({
  name,
  reviewers,
  combinedReviewScore,
}: {
  name: string;
  reviewers: ReviewedApplicantRecordWithReviewerResult[];
  combinedReviewScore: number | null;
}) => {
  return (
    <div className="flex w-full flex-col gap-6 p-3">
      <Link
        href="/admin"
        className="font-source no-underline inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-full border-2 border-blue bg-white px-4 py-2 text-base font-normal leading-[1.4] text-blue hover:border-blue hover:bg-sky-100 hover:text-blue"
      >
        <ArrowLeftIcon className="h-6 w-6 text-blue" />
        Back to home
      </Link>

      <div className="flex flex-col gap-3">
        <h2 className="text-3xl leading-snug text-neutral-800">
          {name}&rsquo;s final scores
        </h2>
      </div>

      {reviewers.length === 0 ? (
        <p className="text-base text-neutral-800/75">
          No reviewers have been assigned to this applicant yet.
        </p>
      ) : (
        <ReviewerScoresSection
          reviewers={reviewers}
          combinedReviewScore={combinedReviewScore}
        />
      )}
    </div>
  );
};

const ViewOnlyRightPanel = ({
  reviewers,
}: {
  reviewers: ReviewedApplicantRecordWithReviewerResult[];
}) => {
  return (
    <div className="flex w-full flex-col gap-8 lg:max-w-[541px] lg:mx-auto">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl leading-7 text-neutral-800">Skill Category</h3>
        <div className="h-14 w-full rounded-md border border-neutral-200 bg-white px-4 py-4 text-base font-normal leading-6 text-black">
          {aggregateSkillCategory(reviewers)}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-xl leading-7 text-neutral-800">Comments</h3>
        <div className="flex flex-col gap-6 rounded-md border border-neutral-200 bg-white px-4 py-4">
          {reviewers.length === 0 ? (
            <p className="text-base text-neutral-800/75">
              No comments to display.
            </p>
          ) : (
            reviewers.map(({ reviewer, reviewedApplicantRecord }) => (
              <div key={reviewer.id} className="flex flex-col gap-2">
                <p className="text-base font-semibold leading-6 text-black">
                  {reviewer.firstName} {reviewer.lastName}&rsquo;s Comment:
                </p>
                <blockquote className="border-l-4 border-blue pl-3 text-base font-normal leading-6 text-black whitespace-pre-wrap">
                  {reviewedApplicantRecord.review?.comments || "—"}
                </blockquote>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const EndForm = ({
  endData,
  setEndData,
  validationError,
}: {
  endData: ReviewEndData;
  setEndData: Dispatch<SetStateAction<ReviewEndData>>;
  validationError: boolean;
}) => {
  const { skillsCategory, comments } = endData;

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setEndData((prev) => ({ ...prev, skillsCategory: event.target.value }));
  };

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEndData((prev) => ({ ...prev, comments: event.target.value }));
  };

  return (
    <div className="flex flex-col gap-8 w-full lg:max-w-[541px] lg:mx-auto">
      <div className="flex flex-col gap-6">
        <h3 className="text-neutral-800 text-xl leading-7">Skill Category</h3>
        <select
          value={skillsCategory}
          onChange={handleOptionChange}
          required
          className={`h-14 w-full rounded-md border bg-white px-4 py-4 text-base font-normal leading-6
            ${
              validationError && skillsCategory === ""
                ? "border-red-500"
                : "border-neutral-200"
            }
            ${skillsCategory === "" ? "text-neutral-200" : "text-black"}`}
        >
          <option value="">Skill Category</option>
          <option value="junior">Junior</option>
          <option value="intermediate">Intermediate</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="text-neutral-800 text-xl leading-7">Comments</h3>
        <textarea
          value={comments}
          onChange={handleCommentChange}
          placeholder="Leave Comments here"
          className="w-full h-[250px] rounded-md border border-neutral-200 bg-white px-3 py-4 text-base font-normal leading-6 placeholder:text-sm placeholder:font-normal placeholder:leading-5 placeholder:text-black/[0.36]"
        />
      </div>
    </div>
  );
};

export const ReviewEndStage = ({
  name,
  reviewerName,
  scores,
  endData,
  setEndData,
  onReportConflict,
  viewOnly = false,
  reviewers = [],
  combinedReviewScore,
}: Props) => {
  const [validationError, setValidationError] = useState(false);

  return viewOnly ? (
    <ReviewPageLayout currentStage={ReviewStage.END} scores={scores} viewOnly>
      <PanelLayout borderRight>
        <ViewOnlyLeftPanel
          name={name}
          reviewers={reviewers}
          combinedReviewScore={combinedReviewScore}
        />
      </PanelLayout>
      <PanelLayout>
        <ViewOnlyRightPanel reviewers={reviewers} />
      </PanelLayout>
    </ReviewPageLayout>
  ) : (
    <ReviewPageLayout
      currentStage={ReviewStage.END}
      scores={scores}
      endData={endData}
      onValidate={() => {
        const isValid = endData.skillsCategory !== "";
        setValidationError(!isValid);
        return isValid;
      }}
    >
      <PanelLayout borderRight>
        <LeftPanelContent
          name={name}
          reviewerName={reviewerName}
          scores={scores}
          onReportConflict={onReportConflict}
        />
      </PanelLayout>
      <PanelLayout>
        <EndForm
          endData={endData}
          setEndData={setEndData}
          validationError={validationError}
        />
      </PanelLayout>
    </ReviewPageLayout>
  );
};
