import Image from "next/image";

interface BlueprintWordmarkProps {
  width?: number;
  height?: number;
  className?: string;
}

export const BlueprintWordmark = ({
  width = 120,
  height = 24,
  className = "h-auto w-[120px]",
}: BlueprintWordmarkProps) => (
  <Image
    src="/common/review-page-banner.svg"
    alt="Blueprint Logo"
    width={width}
    height={height}
    className={className}
  />
);
