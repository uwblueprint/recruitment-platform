import { ErrorFilledIcon } from "@/components/icons/error-filled.icon";

type ReviewerCellProps = {
  reviewerName: string;
  reviewerHasConflict?: boolean;
  onClick?: () => void;
};

export const ReviewerCell = ({
  reviewerName,
  reviewerHasConflict = false,
  onClick,
}: ReviewerCellProps) => {
  const content = (
    <>
      {reviewerHasConflict && (
        <ErrorFilledIcon className="h-[15px] w-[15px] shrink-0" />
      )}
      <span className="border-b border-current">{reviewerName}</span>
    </>
  );

  if (!onClick || reviewerName === "-") {
    return <span className="inline-flex items-center gap-2">{content}</span>;
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30 ${reviewerHasConflict ? "text-error hover:text-red-900" : "hover:text-blue"}`}
    >
      {content}
    </button>
  );
};
