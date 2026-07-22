import { Button } from "@/components/common/Button";
import MailOutline from "@mui/icons-material/MailOutline";
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";

type ReviewDashboardToolbarProps = {
  position: string | null;
  selectedCount: number;
  disabled?: boolean;
  onReject: () => void;
  onSelectForInterview: () => void;
};

export const ReviewDashboardToolbar = ({
  position,
  selectedCount,
  disabled = false,
  onReject,
  onSelectForInterview,
}: ReviewDashboardToolbarProps) => (
  <div className="flex shrink-0 items-center justify-between gap-4">
    {position ? (
      <h1 className="font-poppins text-[28px] font-semibold leading-[140%] text-blue">
        {position} Applications
      </h1>
    ) : (
      <div />
    )}
    <div className="flex items-center gap-3">
      <span className="font-source text-sm text-neutral-500">
        {selectedCount} selected
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={selectedCount === 0 || disabled}
        onClick={onReject}
        className="flex items-center gap-2 !px-5"
      >
        <MailOutline fontSize="small" />
        Send Rejection
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={selectedCount === 0 || disabled}
        onClick={onSelectForInterview}
        className="flex items-center gap-2 !px-5"
      >
        <PersonAddAltOutlined fontSize="small" />
        Select for interview
      </Button>
    </div>
  </div>
);
