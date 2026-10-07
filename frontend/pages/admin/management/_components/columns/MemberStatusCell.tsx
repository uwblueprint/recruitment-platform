import { DashboardStatusChip } from "@/components/dashboard/common";

const MEMBER_STATUS_OPTIONS = [
  {
    value: "Active",
    label: "Active",
    className: "border-green-900 bg-green-50 text-green-900",
  },
  {
    value: "Not Active",
    label: "Not Active",
    className: "border-neutral-700 bg-neutral-100 text-neutral-700",
  },
] as const;

export const MemberStatusCell = ({ status }: { status: string }) => (
  <DashboardStatusChip value={status} options={MEMBER_STATUS_OPTIONS} readOnly />
);
