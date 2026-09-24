import { ReactElement } from "react";

interface FilterIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const FilterIcon = ({
  className,
  style,
}: FilterIconProps): ReactElement => {
  return (
    <svg
      width="18"
      height="13"
      viewBox="0 0 18 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="1"
        x2="18"
        y2="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="3"
        y1="6.5"
        x2="15"
        y2="6.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="6"
        y1="12"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};
