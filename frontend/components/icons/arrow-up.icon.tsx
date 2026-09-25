import { ReactElement } from "react";

interface ArrowUpIconProps {
  className?: string;
}

export const ArrowUpIcon = ({ className }: ArrowUpIconProps): ReactElement => {
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
        transform="matrix(0.717445 -0.696615 -0.717445 -0.696615 17.7417 11.9856)"
        fill="currentColor"
      />
      <rect
        width="3.15212"
        height="14.0578"
        rx="1.57606"
        transform="matrix(0.717445 0.696615 0.717445 -0.696615 5.24537e-07 9.8042)"
        fill="currentColor"
      />
    </svg>
  );
};
