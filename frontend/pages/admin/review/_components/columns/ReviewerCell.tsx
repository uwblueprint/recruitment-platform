type ReviewerCellProps = {
  reviewerName: string;
  onClick?: () => void;
};

export const ReviewerCell = ({ reviewerName, onClick }: ReviewerCellProps) => {
  if (!onClick || reviewerName === "-") {
    return <span className="border-b border-neutral-800">{reviewerName}</span>;
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="border-b border-current text-left transition-colors hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30"
    >
      {reviewerName}
    </button>
  );
};
