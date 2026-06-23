import { ReactElement } from "react";

interface CheckSharpIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const CheckSharpIcon = ({
  className,
  style,
}: CheckSharpIconProps): ReactElement => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M24 6L11 19L5 13"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
};