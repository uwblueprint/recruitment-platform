import { ReactNode } from "react";

interface PanelLayoutProps {
  title?: string;
  subtitle?: string;
  titleButton?: ReactNode;
  variant?: "sky" | "white" | "grey";
  borderRight?: boolean;
  borderLeft?: boolean;
  /** "xlarge" = left panel (28px, 600), "medium" = right panel (20px, 500) */
  titleVariant?: "xlarge" | "medium";
  /** Optional top row above title (e.g. back link + actions) */
  header?: ReactNode;
  /** When false, hides subtitle (e.g. for INFO stage) */
  showApplicationTitle?: boolean;
  contentClassName?: string;
  /** When true (with contentClassName), the content wrapper fills available
   * height so children can pin to the bottom (e.g. via mt-auto). */
  fillContent?: boolean;
  children: ReactNode;
}

const titleClasses: Record<"xlarge" | "medium", string> = {
  xlarge:
    "font-poppins text-[28px] font-semibold leading-[140%] text-neutral-800",
  medium:
    "self-stretch font-poppins text-xl font-medium leading-[140%] text-neutral-800",
};

export const PanelLayout = ({
  title,
  subtitle,
  titleButton,
  variant = "white",
  borderRight = false,
  borderLeft = false,
  titleVariant = "xlarge",
  header,
  showApplicationTitle = true,
  contentClassName,
  fillContent = false,
  children,
}: PanelLayoutProps) => {
  const bg =
    variant === "sky"
      ? "bg-sky"
      : variant === "grey"
        ? "bg-surface-grey"
        : "bg-white";
  const hasHeader = !!(title || subtitle || header);

  const headerBlock = (
    <>
      {header ? (
        <div className="mb-8 flex w-full shrink-0 items-center justify-between gap-4">
          {header}
        </div>
      ) : null}
      {showApplicationTitle && subtitle && (
        <p className="mb-4 shrink-0 font-poppins text-[15px] leading-[140%] text-charcoal-500">
          {subtitle}
        </p>
      )}
      {hasHeader && (
        <>
          {title && titleButton ? (
            <div
              className={`flex shrink-0 items-center justify-between ${
                titleVariant === "medium" ? "mb-4" : ""
              }`}
            >
              <h2 className={titleClasses[titleVariant]}>{title}</h2>
              {titleButton}
            </div>
          ) : title ? (
            <h2
              className={`${titleClasses[titleVariant]} ${
                titleVariant === "xlarge" ? "shrink-0" : "mb-4"
              }`}
            >
              {title}
            </h2>
          ) : null}
        </>
      )}
    </>
  );

  const showHeaderStack = hasHeader;

  const scrollBase = "min-h-0 w-full flex-1";
  const scrollClassName = contentClassName
    ? `${scrollBase} ${contentClassName}`
    : `${scrollBase} flex flex-col gap-8 overflow-y-auto ${
        titleVariant === "medium" ? "antialiased" : ""
      }`;

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden ${bg} ${
        borderRight ? "lg:border-r lg:border-neutral-200" : ""
      } ${borderLeft ? "lg:border-l lg:border-neutral-200" : ""}`}
    >
      <div className="flex h-full flex-col overflow-hidden py-8">
        {showHeaderStack ? (
          <div className="shrink-0 px-9">{headerBlock}</div>
        ) : null}
        <div className={scrollClassName}>
          <div
            className={
              contentClassName
                ? `box-border w-full px-9 ${
                    fillContent ? "flex min-h-full flex-1 flex-col" : ""
                  }`
                : "box-border flex min-h-full w-full flex-col items-start gap-8 px-9"
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
