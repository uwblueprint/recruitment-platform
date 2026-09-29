import { useId, useState } from "react";
import Link from "next/link";
import { StyledMenu } from "@/components/common/StyledMenu";
import { StyledMenuItem } from "@/components/common/StyledMenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


export const DASHBOARD_ENUM = {
  REVIEW: "review",
  INTERVIEW: "interview",
} as const;

const DASHBOARDS = {
  [DASHBOARD_ENUM.REVIEW]: { label: "Review Dashboard", href: "/admin/review" },
  [DASHBOARD_ENUM.INTERVIEW]: { label: "Interview Dashboard", href: "/admin/interview" },
} as const;

interface DashboardSwitcherProps {
  currentDashboard: keyof typeof DASHBOARDS;
}

export const DashboardSwitcher = ({
  currentDashboard,
}: DashboardSwitcherProps) => {
  const id = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);

  return (
    <div className="flex shrink-0 items-center gap-4">
      <h1 className="font-poppins text-[28px] font-semibold leading-[140%] text-blue">
        {DASHBOARDS[currentDashboard].label}
      </h1>
      <button
        id={`${id}-button`}
        type="button"
        aria-label="Switch dashboard"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-blue hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        <KeyboardArrowDownIcon sx={{ fontSize: 32 }} />
      </button>
      <StyledMenu
        id={`${id}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
      >
        {Object.entries(DASHBOARDS).map(([key, dashboard]) => (
          <StyledMenuItem
            key={key}
            component={Link}
            href={dashboard.href}
            selected={key === currentDashboard}
            aria-current={key === currentDashboard ? "page" : undefined}
            onClick={closeMenu}
          >
            {dashboard.label}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};
