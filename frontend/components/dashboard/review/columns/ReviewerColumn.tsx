type ReviewerCellProps = {
  reviewerName: string;
};

export const ReviewerCell = ({ reviewerName }: ReviewerCellProps) => (
  <span className="border-b border-neutral-800">{reviewerName}</span>
);
