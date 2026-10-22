import { Button } from "@/components/common/Button";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

type ExportCSVButtonProps = {
  isExporting: boolean;
  onExport: () => void;
};

export const ExportCSVButton = ({
  isExporting,
  onExport,
}: ExportCSVButtonProps) => (
  <Button
    type="button"
    variant="secondary"
    size="sm"
    disabled={isExporting}
    onClick={onExport}
    className="flex items-center gap-2 !px-5"
  >
    <FileUploadOutlined fontSize="small" />
    {isExporting ? "Exporting..." : "Export CSV"}
  </Button>
);
