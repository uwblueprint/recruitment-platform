import { useId, useState, type ReactNode } from "react";
import { Checkbox, Collapse } from "@mui/material";
import { ArrowDownIcon } from "@/components/icons/arrow-down.icon";
import { ArrowUpIcon } from "@/components/icons/arrow-up.icon";

/** Header content and slots must be non-interactive: they live in a button. */
export type CollapsibleHeaderItem = {
  text: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export type CollapsibleTitle = CollapsibleHeaderItem & {
  supportingText?: string;
};

export type CollapsibleRowProps = {
  title: CollapsibleTitle;
  subtitles?: CollapsibleHeaderItem[];
  selection?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  };
  /** The caller owns the expanded content's layout and padding. */
  children: ReactNode;
  toggleLabel: string;
  defaultOpen?: boolean;
  /** When provided, the parent owns expansion state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const CollapsibleRow = ({
  title,
  subtitles = [],
  selection,
  children,
  toggleLabel,
  defaultOpen = false,
  open,
  onOpenChange,
}: CollapsibleRowProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const isOpen = open ?? internalOpen;

  const toggle = () => {
    const nextOpen = !isOpen;
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <div className="w-full overflow-hidden rounded-[4px] border border-neutral-200 bg-white">
      <div className="flex items-center">
        {selection && (
          <Checkbox
            checked={selection.checked}
            onChange={(event) => selection.onChange(event.target.checked)}
            inputProps={{ "aria-label": selection.label }}
            className="!mx-3 !h-5 !w-5 !p-0 !text-neutral-200 [&.Mui-checked]:!text-blue"
          />
        )}
        <button
          id={triggerId}
          type="button"
          aria-label={toggleLabel}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
          className="flex min-h-[64px] min-w-0 flex-1 items-center justify-between gap-6 bg-white px-6 py-3 text-left text-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
        >
          <span className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3">
            <span className="flex min-w-0 items-center gap-6">
              {title.leftSlot}
              <span className="flex min-w-0 flex-col">
                <span className="font-poppins text-base font-medium leading-[1.4]">
                  {title.text}
                </span>
                {title.supportingText != null && (
                  <span className="font-source text-sm leading-[1.4]">
                    {title.supportingText}
                  </span>
                )}
              </span>
              {title.rightSlot}
            </span>
            {subtitles.map((subtitle, index) => (
              <span
                key={index}
                className="flex items-center gap-3 border-l-2 border-neutral-200 pl-6 font-source text-sm leading-[1.4]"
              >
                {subtitle.leftSlot}
                <span>{subtitle.text}</span>
                {subtitle.rightSlot}
              </span>
            ))}
          </span>
          <span aria-hidden="true" className="shrink-0">
            {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </button>
      </div>
      <Collapse in={isOpen}>
        <div
          id={panelId}
          aria-labelledby={triggerId}
          inert={!isOpen}
          className="border-t border-neutral-200"
        >
          {children}
        </div>
      </Collapse>
    </div>
  );
};
