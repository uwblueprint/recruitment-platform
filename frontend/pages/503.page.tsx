import { StatusPage } from "@/components/layouts/StatusPage";

export default function PermissionDeniedPage() {
  return (
    <StatusPage
      code={503}
      title="Permission denied"
      description="You don’t have permission to access this page. If you should be assigned to this review, please contact an administrator."
    />
  );
}
