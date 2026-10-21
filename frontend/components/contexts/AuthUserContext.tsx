import {
  createContext,
  ReactNode,
  ReactElement,
  useContext,
  useRef,
  useState,
} from "react";
import { useApolloClient } from "@apollo/client/react";
import { UserDTO } from "@/types";

export type AuthenticatedUser = UserDTO;

const AUTHENTICATED_USER_KEY = "authenticatedUser";

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  authenticatedUser: AuthenticatedUser | null;
  setAuthenticatedUser: (user: AuthenticatedUser | null) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const defaultContextValue: AuthContextType = {
  authenticatedUser: null,
  setAuthenticatedUser: async () => {
    // Default no-op implementation
  },
  logout: async () => {
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
  const client = useApolloClient();
  const [authenticatedUser, setAuthenticatedUserState] =
    useState<AuthenticatedUser | null>(getLocalStorageUser());
  const currentUser = useRef(authenticatedUser);
  const [isLoading, setIsLoading] = useState(false);

  // Wrapper around setState that also syncs to localStorage
  const setAuthenticatedUser = async (user: AuthenticatedUser | null) => {
    if (!user || currentUser.current?.id !== user.id) {
      setIsLoading(true);
      try {
        // Cancel pending queries and discard the previous session's data without
        // refetching active queries with missing or newly replaced credentials.
        await client.clearStore();
      } finally {
        setIsLoading(false);
      }
    }
    currentUser.current = user;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
    }
    setAuthenticatedUserState(user);
  };

  // Logout: clear auth data
  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    await setAuthenticatedUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticatedUser,
        setAuthenticatedUser,
        logout,
        isLoading,
      }}
    >
      {isLoading ? null : children}
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
