import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import useCanAccessInterviewGroup from "@/APIClients/queries/useCanAccessInterviewGroup";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { Role } from "@/graphql/typeUtils";
import { Loading } from "@/components/common/Loading";

/** Runs only after ProtectedRoute has verified authentication and role. */
const InterviewGroupMembershipGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const rawId = router.query.groupId;
  const groupId =
    router.isReady && typeof rawId === "string" && rawId ? rawId : undefined;
  const { data, loading, error } = useCanAccessInterviewGroup(groupId);
  const denied = router.isReady && (!groupId ||
    (!loading && !error && data?.canAccessInterviewGroup === false));

  useEffect(() => {
    if (denied) void router.replace("/503");
  }, [denied, router]);

  if (denied) return null;
  if (error) {
    return <p role="alert" className="p-8">Unable to check interview group access. Please refresh and try again.</p>;
  }
  if (!groupId || loading || data?.canAccessInterviewGroup !== true) {
    return <Loading />;
  }
  return <div key={groupId}>{children}</div>;
};

/** Combines authentication, role, and membership protection for interview groups. */
export const ProtectedInterviewGroupRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={[Role.Admin, Role.SuperAdmin, Role.User]}>
    <InterviewGroupMembershipGuard>{children}</InterviewGroupMembershipGuard>
  </ProtectedRoute>
);
