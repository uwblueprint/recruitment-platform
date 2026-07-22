import { ReactElement } from "react";

interface ChevronDownIconProps {
  className?: string;
}

export const ChevronDownIcon = ({ className }: ChevronDownIconProps): ReactElement => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};