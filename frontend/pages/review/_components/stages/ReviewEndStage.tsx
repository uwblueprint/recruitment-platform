import { ArrowLeftIcon } from "@/components/icons/arrow-left.icon";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import Link from "next/link";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ReviewStage } from "../constants";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { ReviewEndData, ReviewScores } from "../types";

interface Props {
  name: string;
  reviewerName: string;
  scores: ReviewScores;
  endData: ReviewEndData;
  setEndData: Dispatch<SetStateAction<ReviewEndData>>;
  onReportConflict?: () => void;
}

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
  const scoreRows: { label: string; stage: ReviewStage }[] = [
    { label: "Passion for Social Good", stage: ReviewStage.PFSG },
    { label: "Team Player", stage: ReviewStage.TP },
    { label: "Desire to Learn", stage: ReviewStage.D2L },
    { label: "Skill", stage: ReviewStage.SKL },
  ];

  const totalScore = scoreRows.reduce(
    (sum, { stage }) => sum + scores[stage],
    0,
  );

  return (
    <div className="flex w-full flex-col gap-6 p-3">
      <div className="flex w-full shrink-0 items-center justify-between gap-4">
        <Link
          href="/admin"
          className="flex w-fit shrink-0 items-center gap-2 rounded-full border-2 border-blue bg-white px-4 py-2 font-source text-base font-normal leading-snug text-blue no-underline transition-colors hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-6 w-6 text-blue" />
          Back to home
        </Link>
        <ReportConflictButton
          name={name}
          showQuestion
          onClick={onReportConflict}
        />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-base font-normal leading-snug text-semantic-text-subtle">
            Scoring
          </p>
          <h2 className="text-3xl leading-snug text-semantic-text-primary">
            {name}&apos;s final scores
          </h2>
        </div>

        <div className="flex flex-col gap-8 rounded-lg border border-semantic-border-light bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex w-[235px] flex-col gap-6">
              <span className="font-poppins text-xl font-medium leading-7 text-blue">
                Topic
              </span>
              {scoreRows.map(({ label }) => (
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
                {reviewerName}&apos;s rating
              </span>
              {scoreRows.map(({ label, stage }) => (
                <span
                  key={label}
                  className="text-base font-normal leading-snug text-black"
                >
                  {scores[stage]}/5
                </span>
              ))}
            </div>
          </div>
          <hr className="border-semantic-border-light" />
          <div className="flex items-center justify-between">
            <span className="font-poppins text-xl font-medium leading-7 text-black">
              Total Score
            </span>
            <span className="font-poppins text-xl font-normal leading-7 text-blue">
              {totalScore}/20
            </span>
          </div>
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
    <div className="flex w-full flex-col gap-8 lg:mx-auto lg:max-w-[541px]">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl leading-7 text-semantic-text-primary">
          Skill Category
        </h3>
        <select
          value={skillsCategory}
          onChange={handleOptionChange}
          required
          className={`h-14 w-full rounded-md border bg-white px-4 py-4 text-base font-normal leading-6 ${
            validationError && skillsCategory === ""
              ? "border-red-500"
              : "border-semantic-border-light"
          } ${
            skillsCategory === "" ? "text-semantic-border-light" : "text-black"
          }`}
        >
          <option value="">Skill Category</option>
          <option value="junior">Junior</option>
          <option value="intermediate">Intermediate</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="text-xl leading-7 text-semantic-text-primary">
          Comments
        </h3>
        <textarea
          value={comments}
          onChange={handleCommentChange}
          placeholder="Leave Comments here"
          className="h-[250px] w-full rounded-md border border-semantic-border-light bg-white px-3 py-4 text-base font-normal leading-6 placeholder:text-sm placeholder:font-normal placeholder:leading-5 placeholder:text-semantic-text-placeholder"
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
}: Props) => {
  const [validationError, setValidationError] = useState(false);

  return (
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
