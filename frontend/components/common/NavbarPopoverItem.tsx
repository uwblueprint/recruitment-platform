import { ReactNode } from "react";
import Link, { LinkProps } from "next/link";

interface NavbarPopoverItemProps {
  children: ReactNode;
  href?: LinkProps["href"];
  isSelected?: boolean;
  onClick?: () => void;
}

export const NavbarPopoverItem = ({
  children,
  href,
  isSelected = false,
  onClick,
}: NavbarPopoverItemProps) => {
  const className = `flex h-10 w-full items-center gap-2 px-3 text-left font-source text-base font-normal leading-6 hover:text-blue-500 hover:!opacity-100 focus-visible:text-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-500 ${
    isSelected ? "text-blue-500" : "text-black"
  }`;

  if (href !== undefined) {
    return (
      <Link
        href={href}
        aria-current={isSelected ? "true" : undefined}
        onClick={onClick}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};
