import { ReactElement, ReactNode } from "react";
import { Navbar } from "@/components/common/Navbar";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";

const ADMIN_ROLES: Array<"Admin"> = ["Admin"];

export const AdminLayout = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={ADMIN_ROLES}>
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {children}
      </div>
    </div>
  </ProtectedRoute>
);

export const getAdminLayout = (page: ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);
