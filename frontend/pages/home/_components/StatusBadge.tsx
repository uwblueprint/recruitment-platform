import { BADGE_CLASSES, StatusVariant } from "./constants";

const StatusBadge = ({ variant, label }: { variant: StatusVariant; label: string }) => (
  <span
    className={`inline-flex items-center justify-center rounded px-3 py-1 text-sm font-medium ${BADGE_CLASSES[variant]}`}
  >
    {label}
  </span>
);

export default StatusBadge;
