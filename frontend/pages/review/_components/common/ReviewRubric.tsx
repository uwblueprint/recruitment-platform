import { ReviewScores } from "../types";
import { ReviewStage } from "../constants";


interface Props {
  scoringCriteria: string[];
  scores: ReviewScores;
  currentStage: ReviewStage;
}

export const ReviewRubric: React.FC<Props> = ({ scoringCriteria }) => {
  return (
    <div className="flex flex-col gap-6 w-full px-4 pt-4">
      {scoringCriteria.map((criteria, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <span className="font-poppins text-base font-medium leading-[1.4] text-blue-200">
            Level {idx + 1}
          </span>
          <p className="self-stretch font-source text-base font-normal leading-[1.4] text-neutral-800/80">
            {criteria}
          </p>
        </div>
      ))}
    </div>
  );
};
