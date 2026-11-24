import { useEffect } from "react";
import { useRouter } from "next/router";
import useDepartments from "@/APIClients/queries/useDepartments";
import {
  type Dashboard,
  getDashboardHref,
} from "@/components/dashboard/common/DashboardSwitcher";

/**
 * Reads the department slug from `/admin/[department]/<dashboard>`. Until the
 * router has parsed the URL `query` is empty, so `isReady` holds the dashboard
 * back rather than letting it fire an unscoped request on a direct load or
 * refresh. An unknown slug sends the admin to the all-roles dashboard.
 */
const useDashboardDepartment = (dashboard: Dashboard) => {
  const router = useRouter();
  const { data: departments, error } = useDepartments();

  const slug =
    typeof router.query.department === "string"
      ? router.query.department
      : undefined;
  const isKnown =
    !slug || departments?.some((department) => department.slug === slug);
  const isUnknown = !!slug && (!!error || (!!departments && !isKnown));

  useEffect(() => {
    if (router.isReady && isUnknown) {
      void router.replace(getDashboardHref(dashboard));
    }
  }, [router, isUnknown, dashboard]);

  return {
    department: slug,
    isReady: router.isReady && !!isKnown,
  };
};

export default useDashboardDepartment;
