type ReviewScoreCellProps = {
  score: number;
};

export const ReviewScoreCell = ({ score }: ReviewScoreCellProps) => (
  <span className="text-green-700">{score}/40</span>
);
