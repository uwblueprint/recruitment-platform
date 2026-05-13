import { ReactNode, ReactElement } from "react";
import { AuthStatus } from "@/types";

export type Props = {
  children: ReactNode;
};

function getAuthStatus(): AuthStatus {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return { loading: false, isAuthorized: !!accessToken };
}

export const ProtectedApplication = ({ children }: Props): ReactElement => {
  const authStatus = getAuthStatus();

  return authStatus.isAuthorized ? (
    <>{children}</>
  ) : (
    <div>Unauthorized</div>
  );
};
