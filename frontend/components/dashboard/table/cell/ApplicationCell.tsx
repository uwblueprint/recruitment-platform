import { ErrorFilledIcon } from "@/components/icons/error-filled.icon";
import BookmarkOutlined from "@mui/icons-material/BookmarkOutlined";

type ApplicationCellProps = {
  applicantName: string;
  isBookmarked: boolean;
  hasConflict?: boolean;
  onClick?: () => void;
};

export const ApplicationCell = ({
  applicantName,
  isBookmarked,
  hasConflict = false,
  onClick,
}: ApplicationCellProps) => {
  const content = (
    <>
      {hasConflict && (
        <ErrorFilledIcon className="h-[15px] w-[15px] shrink-0" />
      )}
      <span className="border-b border-current">{applicantName}</span>
    </>
  );

  const name = onClick ? (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30 ${hasConflict ? "text-error hover:text-red-900" : "hover:text-blue"}`}
    >
      {content}
    </button>
  ) : (
    <span className="inline-flex items-center gap-2">{content}</span>
  );

  return (
    <span className="inline-flex items-center gap-[0.75] whitespace-nowrap text-neutral-800">
      {isBookmarked && (
        <BookmarkOutlined sx={{ fontSize: 19 }} className="text-yellow-500" />
      )}
      {name}
    </span>
  );
};
