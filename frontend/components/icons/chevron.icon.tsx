import { ReactElement } from "react";

interface ChevronIconProps {
  className?: string;
  direction?: "up" | "down";
}

/**
 * Rounded chevron used by the dashboard sort control (Figma node 6292:47118).
 * The design draws each chevron as two round-capped bars meeting at 45°, which
 * a stroked polyline with round caps and joins reproduces exactly. The 7.651 x
 * 4.728 viewBox is the designed arrow size; the 0.7 inset is half the stroke
 * width, so the round caps sit flush with the box edges.
 */
export const ChevronIcon = ({
  className,
  direction = "up",
}: ChevronIconProps): ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7.651"
    height="4.728"
    viewBox="0 0 7.651 4.728"
    fill="none"
    aria-hidden
    className={className}
  >
    <path
      d={
        direction === "up"
          ? "M0.7 4.028L3.8255 0.7L6.951 4.028"
          : "M0.7 0.7L3.8255 4.028L6.951 0.7"
      }
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
