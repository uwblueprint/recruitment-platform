import { ReactElement } from "react";

interface ArrowDownIconProps {
  className?: string;
}

export const ArrowDownIcon = ({ className }: ArrowDownIconProps): ReactElement => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      className={className}
    >
      <rect
        width="3.1477"
        height="14.0578"
        rx="1.57385"
        transform="matrix(-0.717445 0.696615 0.717445 0.696615 2.2583 0.0144043)"
        fill="currentColor"
      />
      <rect
        width="3.15212"
        height="14.0578"
        rx="1.57606"
        transform="matrix(-0.717445 -0.696615 -0.717445 0.696615 20 2.1958)"
        fill="#252525"
      />
    </svg>
  );
};
