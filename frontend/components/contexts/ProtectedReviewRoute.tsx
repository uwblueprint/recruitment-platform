import { StatusPage } from "@/components/layouts/StatusPage";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import useCanReviewApplicant from "@/APIClients/queries/useCanReviewApplicant";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { Role } from "@/graphql/typeUtils";
import { Loading } from "@/components/common/Loading";

/** Runs only after ProtectedRoute has verified authentication and role. */
const ReviewAssignmentGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const rawId = router.query.applicantRecordId;
  const applicantRecordId =
    router.isReady && typeof rawId === "string" && rawId ? rawId : undefined;
  const { data, loading, error } = useCanReviewApplicant(applicantRecordId);
  const denied = router.isReady && (!applicantRecordId ||
    (!loading && !error && data?.canReviewApplicant === false));

  useEffect(() => {
    if (denied) void router.replace("/503");
  }, [denied, router]);

  if (denied) return null;
  if (error) {
    return (
      <StatusPage
        code={500}
        role="alert"
        title="Unable to check review access"
        description="Please refresh and try again."
        action={{ label: "Try again", onClick: () => router.reload() }}
      />
    );
  }
  if (!applicantRecordId || loading || data?.canReviewApplicant !== true) {
    return <Loading />;
  }
  return <div key={applicantRecordId}>{children}</div>;
};

/** Combines authentication, role, and assignment protection for review editing. */
export const ProtectedReviewRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={[Role.Admin, Role.SuperAdmin, Role.User]}>
    <ReviewAssignmentGuard>{children}</ReviewAssignmentGuard>
  </ProtectedRoute>
);
