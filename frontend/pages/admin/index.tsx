import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

const AdminPage: NextPageWithLayout = () => {
  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden" />
    </div>
  );
};

AdminPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>{page}</ProtectedRoute>
);

export default AdminPage;
