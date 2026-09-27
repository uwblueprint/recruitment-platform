import { ReactElement } from "react";

interface UserIconProps {
  className?: string;
}

export const UserIcon = ({ className }: UserIconProps): ReactElement => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 15h14v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
};
