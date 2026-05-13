import { useTheme } from "@mui/material";
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
    const theme = useTheme();
  
    const TITLE_STYLES = {
      xlarge: {
        color: theme.palette.text.primary,
        fontSize: "28px",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "140%",
      },
      medium: {
        alignSelf: "stretch",
        color: theme.palette.text.primary,
        fontSize: "20px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "140%",
      },
    };
    const bg =
      variant === "sky"
        ? "bg-sky"
        : variant === "grey"
        ? "bg-[#F3F4F6]"
        : "bg-white";
    const hasHeader = !!(title || subtitle || header);
    const titleStyle = TITLE_STYLES[titleVariant];
  
    const headerBlock = (
      <>
        {header ? (
          <div className="mb-8 flex w-full shrink-0 items-center justify-between gap-4">
            {header}
          </div>
        ) : null}
        {showApplicationTitle && subtitle && (
          <p
            className="font-poppins text-charcoal-500 mb-4 shrink-0 text-[15px]"
            style={{ lineHeight: "140%" }}
          >
            {subtitle}
          </p>
        )}
        {hasHeader && (
          <>
            {title && titleButton ? (
              <div
                className={`flex justify-between items-center shrink-0 ${
                  titleVariant === "medium" ? "mb-4" : ""
                }`}
              >
                <h2 className="font-poppins font-medium" style={titleStyle}>
                  {title}
                </h2>
                {titleButton}
              </div>
            ) : title ? (
              <h2
                className={`font-poppins ${
                  titleVariant === "xlarge" ? "shrink-0" : ""
                } ${titleVariant === "medium" ? "mb-4 font-medium" : ""}`}
                style={titleStyle}
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
        className={`flex flex-col h-full overflow-hidden relative ${bg} ${
          borderRight ? "lg:border-r" : ""
        } ${borderLeft ? "lg:border-l" : ""}`}
        style={{
          borderColor:
            borderRight || borderLeft
              ? theme.palette.semantics.border.light
              : undefined,
        }}
      >
        <div className="flex h-full flex-col overflow-hidden pt-8 pb-8">
          {showHeaderStack ? (
            <div className="shrink-0 px-9">{headerBlock}</div>
          ) : null}
          <div className={scrollClassName}>
            <div
              className={
                contentClassName
                  ? "box-border w-full px-9"
                  : "box-border flex min-h-full w-full flex-col gap-8 px-9"
              }
              style={contentClassName ? undefined : { alignItems: "flex-start" }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };
  