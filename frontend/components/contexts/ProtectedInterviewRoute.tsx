import { StatusPage } from "@/components/layouts/StatusPage";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import useCanAccessInterview from "@/APIClients/queries/useCanAccessInterview";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { Role } from "@/graphql/typeUtils";
import { Loading } from "@/components/common/Loading";

/** Runs only after ProtectedRoute has verified authentication and role. */
const InterviewAssignmentGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const rawId = router.query.applicantRecordId;
  const applicantRecordId =
    router.isReady && typeof rawId === "string" && rawId ? rawId : undefined;
  const { data, loading, error } = useCanAccessInterview(applicantRecordId);
  const denied = router.isReady && (!applicantRecordId ||
    (!loading && !error && data?.canAccessInterview === false));

  if (denied) {
    return (
      <StatusPage
        code={503}
        title="Interview access denied"
        description="You’re not assigned to interview this applicant. If you believe you should be assigned, please contact an administrator."
      />
    );
  }
  if (error) {
    return (
      <StatusPage
        code={500}
        title="Unable to check interview access"
        description="Please refresh and try again."
        action={{ label: "Try again", onClick: () => router.reload() }}
      />
    );
  }
  if (!applicantRecordId || loading || data?.canAccessInterview !== true) {
    return <Loading />;
  }
  return <div key={applicantRecordId}>{children}</div>;
};

/** Combines authentication, role, and assignment protection for interviews. */
export const ProtectedInterviewRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={[Role.Admin, Role.SuperAdmin, Role.User]}>
    <InterviewAssignmentGuard>{children}</InterviewAssignmentGuard>
  </ProtectedRoute>
);
