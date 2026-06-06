type ReviewScoreCellProps = {
  score: number;
};

const getScoreTone = (score: number) => {
  if (score >= 30) return "text-green-700";
  if (score >= 20) return "text-orange-500";
  return "text-red-500";
};

export const ReviewScoreCell = ({ score }: ReviewScoreCellProps) => (
  <span className={getScoreTone(score)}>{score}/40</span>
);
