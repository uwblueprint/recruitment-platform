import { ReactElement } from "react";

interface LogoutIconProps {
  className?: string;
}

export const LogoutIcon = ({ className }: LogoutIconProps): ReactElement => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
};