import { ReactNode } from "react";

interface PanelLayoutProps {
  title?: string;
  subtitle?: string;
  titleButton?: ReactNode;
  variant?: "sky" | "white" | "grey";
  borderRight?: boolean;
  borderLeft?: boolean;
  titleVariant?: "xlarge" | "medium";
  header?: ReactNode;
  showApplicationTitle?: boolean;
  contentClassName?: string;
  children: ReactNode;
}

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
  children,
}: PanelLayoutProps) => {
  const bg =
    variant === "sky"
      ? "bg-sky"
      : variant === "grey"
        ? "bg-semantic-bg-muted"
        : "bg-white";
  const hasHeader = !!(title || subtitle || header);
  const titleClassName =
    titleVariant === "xlarge"
      ? "font-poppins text-[28px] font-semibold leading-[140%] text-semantic-text-primary"
      : "self-stretch font-poppins text-[20px] font-medium leading-[140%] text-semantic-text-primary";

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
      {hasHeader ? (
        <>
          {title && titleButton ? (
            <div
              className={`flex shrink-0 items-center justify-between ${
                titleVariant === "medium" ? "mb-4" : ""
              }`}
            >
              <h2 className={titleClassName}>{title}</h2>
              {titleButton}
            </div>
          ) : title ? (
            <h2
              className={`${titleClassName} ${
                titleVariant === "xlarge" ? "shrink-0" : "mb-4"
              }`}
            >
              {title}
            </h2>
          ) : null}
        </>
      ) : null}
    </>
  );

  const scrollBase = "min-h-0 w-full flex-1";
  const scrollClassName = contentClassName
    ? `${scrollBase} ${contentClassName}`
    : `${scrollBase} flex flex-col gap-8 overflow-y-auto ${
        titleVariant === "medium" ? "antialiased" : ""
      }`;

  const borderClassName = [
    borderRight ? "lg:border-r lg:border-semantic-border-light" : "",
    borderLeft ? "lg:border-l lg:border-semantic-border-light" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden ${bg} ${borderClassName}`}
    >
      <div className="flex h-full flex-col overflow-hidden pt-8 pb-8">
        {hasHeader ? <div className="shrink-0 px-9">{headerBlock}</div> : null}
        <div className={scrollClassName}>
          <div
            className={
              contentClassName
                ? "box-border w-full px-9"
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
