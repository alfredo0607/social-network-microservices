/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  fetchRequest,
  removeRequestToken,
  setRequestToken,
} from "../helpers/fetchRequest/fetchRequestAuth";
import { deleteUserToken, getUserToken, setUserToken } from "../helpers";

interface User {
  id: string;
  email: string;
  name: string;
  birthDate: string;
  alias: string;
  createdAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkingSession: boolean;
  mode: string;
  error?: { type: string; message: string };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkingSession: boolean;
  mode: string;
  error?: { type: string; message: string };
  login: (credentials: LoginCredentials) => Promise<void>;
  relogin: () => Promise<void>;
  logout: () => void;
  changeDarkMode: (newThema: string) => Promise<void>;
  closeError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    checkingSession: false,
    mode: "light",
    error: { type: "", message: "" },
  });

  const changeState = (key: string, value: any) => {
    setAuthState((prev) => ({ ...prev, [key]: value }));
  };

  const login = async (credentials: LoginCredentials) => {
    removeRequestToken();

    changeState("isLoading", true);

    try {
      const {
        data: { data },
      } = await fetchRequest(`/auth/login`, "POST", {
        ...credentials,
      });

      const {
        data: user,
        token: { token },
      } = data;

      setUserToken(token);

      setAuthState((prev) => ({
        ...prev,
        user: user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        checkingSession: false,
      }));

      changeState("checkingSession", true);
    } catch (error: any) {
      console.error("Login error:", error);

      const message =
        typeof error.response?.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      changeState("error", { type: "error", message: message });
    } finally {
      setTimeout(() => {
        changeState("isLoading", false);
      }, 1000);

      setTimeout(() => {
        changeState("checkingSession", false);
      }, 2000);
    }
  };

  const relogin = async () => {
    changeState("error", { type: "", message: "" });
    changeState("checkingSession", true);

    try {
      const token_current = getUserToken();
      if (!token_current) return;
      setRequestToken(token_current);

      const {
        data: { data },
      } = await fetchRequest(`/auth/relogin`, "GET");

      const {
        data: user,
        token: { token },
      } = data;

      setUserToken(token);

      setAuthState((prev) => ({
        ...prev,
        user: user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        checkingSession: true,
      }));
    } catch (error: any) {
      console.error("Login error:", error);

      const message =
        typeof error.response?.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      changeState("error", { type: "error", message: message });
    } finally {
      setTimeout(() => {
        changeState("checkingSession", false);
      }, 1000);
    }
  };

  const logout = () => {
    changeState("checkingSession", true);

    setTimeout(() => {
      try {
        removeRequestToken();
        deleteUserToken();

        setAuthState((prev) => ({
          ...prev,
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          checkingSession: false,
          error: { type: "", message: "" },
        }));

        changeState("checkingSession", false);
      } catch (error) {
        console.log(error);
        changeState("checkingSession", false);
      }
    }, 1500);
  };

  const changeDarkMode = async (newThema: string) => {
    setAuthState((prev) => ({
      ...prev,
      mode: newThema,
    }));
  };

  const closeError = () => {
    changeState("error", { type: "", message: "" });
  };

  useEffect(() => {
    relogin();

    const thema = localStorage.getItem("theme_app") ?? "light";

    changeDarkMode(thema);
  }, []);

  const value: AuthContextType = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    checkingSession: authState.checkingSession,
    mode: authState.mode,
    login,
    relogin,
    logout,
    changeDarkMode,
    closeError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
