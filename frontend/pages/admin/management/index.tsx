import { getAdminLayout } from "@/components/layouts/AdminLayout";
import { NextPageWithLayout } from "../../_app";

const ManagementPage: NextPageWithLayout = () => (
  <main className="min-h-0 flex-1" />
);

ManagementPage.getLayout = getAdminLayout;

export default ManagementPage;
