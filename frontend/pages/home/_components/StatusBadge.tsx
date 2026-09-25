import { BADGE_CLASSES, StatusVariant } from "./constants";

const StatusBadge = ({ variant, label }: { variant: StatusVariant; label: string }) => (
  <span
    className={`inline-flex h-[30px] w-[130px] items-center justify-center rounded px-2 text-center font-source text-[14px] font-normal leading-6 tracking-normal ${BADGE_CLASSES[variant]}`}
  >
    {label}
  </span>
);

export default StatusBadge;
