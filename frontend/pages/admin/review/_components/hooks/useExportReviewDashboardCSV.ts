import { useState } from "react";

import useReviewDashboardCSV from "@/APIClients/queries/useReviewDashboardCSV";
import { downloadFile } from "@/utils/downloadFile";

const todayISODate = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
};

/**
 * Downloads every applicant on the review dashboard, with their reviews, as a
 * CSV. Dashboard filters are ignored on purpose: the export is the backup
 * admins keep before the term's data is wiped.
 */
const useExportReviewDashboardCSV = () => {
  const { fetchReviewDashboardCSV, loading } = useReviewDashboardCSV();
  const [exportFailed, setExportFailed] = useState(false);

  const exportCSV = async () => {
    if (loading) return;
    setExportFailed(false);
    try {
      const csv = await fetchReviewDashboardCSV();
      downloadFile(
        csv,
        `blueprint-review-applicants-${todayISODate()}.csv`,
        "text/csv;charset=utf-8"
      );
    } catch {
      setExportFailed(true);
    }
  };

  return {
    exportCSV,
    isExporting: loading,
    exportFailed,
    dismissExportError: () => setExportFailed(false),
  };
};

export default useExportReviewDashboardCSV;
