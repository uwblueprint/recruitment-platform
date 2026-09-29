import {
  ReactNode,
  ReactElement,
  useEffect,
  useSyncExternalStore,
} from "react";
import { Loading } from "@/components/common/Loading";
import { useRouter } from "next/router";
import useIsAuthorizedByRole from "@/APIClients/queries/useIsAuthorizedByRole";
import { Role } from "@/graphql/typeUtils";

type Props = {
  children: ReactNode;
  allowedRoles: Role[];
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getAccessToken = () => localStorage.getItem("accessToken");
// Undefined means browser storage has not been read yet during hydration.
const getServerAccessToken = () => undefined;

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: Props): ReactElement => {
  const router = useRouter();
  const accessToken = useSyncExternalStore(
    subscribe,
    getAccessToken,
    getServerAccessToken
  );
  const { data, loading, error } = useIsAuthorizedByRole(
    accessToken,
    allowedRoles
  );
  const isLoading = accessToken === undefined || loading;
  const isAuthorized = !error && data === true;

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      void router.replace("/login");
    }
  }, [isLoading, isAuthorized, router]);

  return isLoading ? <Loading /> : isAuthorized ? <>{children}</> : <></>;
};
