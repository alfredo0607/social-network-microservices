/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, type ReactNode } from "react";
import { getUserToken } from "../helpers";
import {
  fetchRequestUser,
  setRequestTokenUser,
} from "../helpers/fetchRequest/fetchRequestUser";

interface User {
  id: number;
  name: string;
  email: string;
  alias: string;
  birthDate: string;
  createdAt: string;
}

interface detailUser {
  id: number;
  name: string;
  email: string;
  alias: string;
  birthDate: string;
  createdAt: string;
  age: number;
}

interface UserState {
  data: { user: User[]; total: number };
  isLoading: boolean;
  isLoadingForm: boolean;
  error?: { type: string; message: string };
  errorForm?: { type: string; message: string };
  detailUser: detailUser | null;
}

interface UserContextType {
  data: { user: User[]; total: number };
  isLoading: boolean;
  isLoadingForm: boolean;
  error?: { type: string; message: string };
  errorForm?: { type: string; message: string };
  detailUser: detailUser | null;
  getUserList: () => Promise<void>;
  getUserById: (userID: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userState, setUserState] = useState<UserState>({
    data: { user: [], total: 0 },
    detailUser: null,
    isLoading: false,
    isLoadingForm: false,
    error: { type: "", message: "" },
    errorForm: { type: "", message: "" },
  });

  const changeState = (key: string, value: any) => {
    setUserState((prev) => ({ ...prev, [key]: value }));
  };

  const getUserList = async () => {
    changeState("error", { type: "", message: "" });
    changeState("isLoading", true);

    try {
      const token_current = getUserToken();
      if (!token_current) throw new Error("No token found");
      setRequestTokenUser(token_current);

      const {
        data: { data },
      } = await fetchRequestUser(`/user/get-all-users`, "GET");

      const { users, totalUsers } = data;

      setUserState((prev) => ({
        ...prev,
        data: {
          user: users,
          total: totalUsers,
        },
      }));
    } catch (error: any) {
      console.error("getUserList Error:", error);

      const message =
        typeof error.response?.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      changeState("error", { type: "error", message: message });
    } finally {
      setTimeout(() => {
        changeState("isLoading", false);
      }, 1000);
    }
  };

  const getUserById = async (userID: number) => {
    changeState("error", { type: "", message: "" });
    changeState("isLoading", true);

    try {
      const token_current = getUserToken();
      if (!token_current) throw new Error("No token found");
      setRequestTokenUser(token_current);

      const {
        data: { data },
      } = await fetchRequestUser(`/user/get-user/${userID}`, "GET");

      const { user } = data;

      changeState("detailUser", user);
    } catch (error: any) {
      console.error("getUserList Error:", error);

      const message =
        typeof error.response?.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      changeState("error", { type: "error", message: message });
    } finally {
      setTimeout(() => {
        changeState("isLoading", false);
      }, 1000);
    }
  };

  const value: UserContextType = {
    data: userState.data,
    isLoadingForm: userState.isLoadingForm,
    isLoading: userState.isLoading,
    error: userState.error,
    errorForm: userState.errorForm,
    detailUser: userState.detailUser,
    getUserList,
    getUserById,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }

  return context;
};
