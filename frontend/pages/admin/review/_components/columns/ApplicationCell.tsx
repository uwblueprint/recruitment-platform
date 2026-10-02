import BookmarkOutlined from "@mui/icons-material/BookmarkOutlined";

type ApplicationCellProps = {
  applicantName: string;
  isBookmarked: boolean;
};

export const ApplicationCell = ({
  applicantName,
  isBookmarked,
}: ApplicationCellProps) => (
  <span className="inline-flex items-center gap-[0.75] whitespace-nowrap text-neutral-800">
        {isBookmarked && (
      <BookmarkOutlined sx={{ fontSize: 19 }} className="text-yellow-500" />
    )}
    <span className="border-b border-current">{applicantName}</span>

  </span>
);
