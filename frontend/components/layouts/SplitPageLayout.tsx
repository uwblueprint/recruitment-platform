import { ReactNode } from "react";

type SplitRatio = "equal";

const SPLIT_GRID_CLASSES: Record<SplitRatio, string> = {
  equal: "lg:grid-cols-2",
};

/** Flexible grid track so the sibling column can shrink inside overflow layouts. */
const SPLIT_FLEX_TRACK = "minmax(0, 1fr)";

function splitGridTemplateColumns(
  leftWidth?: number,
  rightWidth?: number,
): string | undefined {
  const hasLeft = !!leftWidth;
  const hasRight = !!rightWidth
  if (!hasLeft && !hasRight) {
    return undefined;
  }
  if (hasLeft && hasRight) {
    return `${leftWidth}px ${rightWidth}px`;
  }
  if (hasLeft) {
    return `${leftWidth}px ${SPLIT_FLEX_TRACK}`;
  }
  return `${SPLIT_FLEX_TRACK} ${rightWidth}px`;
}

/** Preset fixed widths; pass only `leftWidth` or `rightWidth` on `SplitPanelLayout` so the other column fills the rest. */
export const SPLIT_PANEL_WIDTHS = {
  interview: {
    left: 698,
  },
} as const;

interface SplitPanelLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  split?: SplitRatio;
  leftWidth?: number;
  rightWidth?: number;
  children: ReactNode;
}

export const SplitPanelLayout = ({
  header,
  footer,
  split = "equal",
  leftWidth,
  rightWidth,
  children,
}: SplitPanelLayoutProps) => {
  const gridTemplateColumns = splitGridTemplateColumns(leftWidth, rightWidth);
  const hasWidthOverride = !!gridTemplateColumns;
  const gridStyle = hasWidthOverride ? { gridTemplateColumns } : undefined;

  return (
    <div className="flex flex-col h-screen bg-white">
      {header}
      <div
        className={`flex-1 grid min-h-0 grid-cols-1 [&>*]:min-h-0 ${
          !hasWidthOverride ? SPLIT_GRID_CLASSES[split] : ""
        } overflow-hidden border border-neutral-200`}
        style={gridStyle}
      >
        {children}
      </div>
      {footer}
    </div>
  );
};

