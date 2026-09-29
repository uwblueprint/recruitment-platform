import {
  createContext,
  ReactNode,
  ReactElement,
  useContext,
  useState,
} from "react";
import { UserDTO } from "@/types";

export type AuthenticatedUser = UserDTO;

const AUTHENTICATED_USER_KEY = "authenticatedUser";

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  authenticatedUser: AuthenticatedUser | null;
  setAuthenticatedUser: (user: AuthenticatedUser | null) => void;
  logout: () => void;
  isLoading: boolean;
};

const defaultContextValue: AuthContextType = {
  authenticatedUser: null,
  setAuthenticatedUser: () => {
    // Default no-op implementation
  },
  logout: () => {
    // Default no-op implementation
  },
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

const getLocalStorageUser = (): AuthenticatedUser | null => {
  try {
    const storedUser = localStorage.getItem(AUTHENTICATED_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: Props): ReactElement => {
  const [authenticatedUser, setAuthenticatedUserState] =
    useState<AuthenticatedUser | null>(getLocalStorageUser());

  // Wrapper around setState that also syncs to localStorage
  const setAuthenticatedUser = (user: AuthenticatedUser | null) => {
    setAuthenticatedUserState(user);
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
    }
  };

  // Logout: clear auth data
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthenticatedUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticatedUser,
        setAuthenticatedUser,
        logout,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthUserContext = (): AuthContextType =>
  useContext(AuthContext);

// hooks for common use cases
export const useAuthenticatedUser = (): AuthenticatedUser | null => {
  const { authenticatedUser } = useContext(AuthContext);
  return authenticatedUser;
};
