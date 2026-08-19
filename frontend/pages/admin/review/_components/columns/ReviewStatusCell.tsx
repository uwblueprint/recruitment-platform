import {
  APPLICATION_STATUS_OPTIONS,
  DashboardStatusChip,
} from "@/components/dashboard/common";
import { ApplicationStatus } from "@/graphql/typeUtils";

type ReviewStatusCellProps = {
  applicantRecordId: string;
  status: ApplicationStatus;
  onChange: (
    applicantRecordId: string,
    nextStatus: ApplicationStatus,
    previousStatus: ApplicationStatus,
  ) => void;
};

/**
 * Controlled status chip for the dashboard table. The dashboard page owns the
 * status and persists it, so this cell stays purely presentational and always
 * renders whatever the row currently holds.
 */
export const ReviewStatusCell = ({
  applicantRecordId,
  status,
  onChange,
}: ReviewStatusCellProps) => (
  <DashboardStatusChip
    value={status}
    options={APPLICATION_STATUS_OPTIONS}
    onChange={(newStatus) => onChange(applicantRecordId, newStatus, status)}
  />
);
