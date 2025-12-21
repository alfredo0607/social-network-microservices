/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { getUserToken } from "../helpers";
import {
  fetchRequestLike,
  setRequestTokenLike,
} from "../helpers/fetchRequest/fetchRequestLike";

interface Like {
  id: number;
  createdAt: string;
  name: string;
}

interface LikeState {
  data: { likePost: Like[]; total: number };
  isLoading: boolean;
  isLoadingForm: boolean;
  error?: { type: string; message: string };
  errorForm?: { type: string; message: string };
}

interface CreateOrDeleteLikePostResponse {
  status: boolean;
  action: string;
  message: string;
}

interface LikeContextType {
  data: { likePost: Like[]; total: number };
  isLoading: boolean;
  isLoadingForm: boolean;
  error?: { type: string; message: string };
  errorForm?: { type: string; message: string };
  getLikePostById: (postID: number) => Promise<void>;
  CreateOrDeleteLikePost: (
    postID: number,
    userID: number
  ) => Promise<CreateOrDeleteLikePostResponse>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

interface LikeProviderProps {
  children: ReactNode;
}

export const LikeProvider = ({ children }: LikeProviderProps) => {
  const [likeState, setLikeState] = useState<LikeState>({
    data: { likePost: [], total: 0 },
    isLoading: false,
    isLoadingForm: false,
    error: { type: "", message: "" },
    errorForm: { type: "", message: "" },
  });

  const changeState = (key: string, value: any) => {
    setLikeState((prev) => ({ ...prev, [key]: value }));
  };

  const getLikePostById = async (postID: number) => {
    changeState("error", { type: "", message: "" });
    changeState("isLoading", true);

    try {
      const token_current = getUserToken();
      if (!token_current) throw new Error("No token found");
      setRequestTokenLike(token_current);

      const {
        data: { data },
      } = await fetchRequestLike(`/like/post/${postID}/users`, "GET");

      const { users, totalUsers } = data;

      setLikeState((prev) => ({
        ...prev,
        data: {
          likePost: users,
          total: totalUsers,
        },
      }));
    } catch (error: any) {
      console.error("getLikePostById Error:", error);

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

  const CreateOrDeleteLikePost = async (postID: number, userID: number) => {
    changeState("errorForm", { type: "", message: "" });
    changeState("isLoadingForm", true);

    try {
      const token_current = getUserToken();
      if (!token_current) throw new Error("No token found");
      setRequestTokenLike(token_current);

      const {
        data: { data },
      } = await fetchRequestLike(`/like/create-or-delete-like`, "POST", {
        postId: postID,
        userId: userID,
      });

      const { action } = data;

      const message =
        action === "added"
          ? "Me gusta registrado con exito."
          : "Me gusta eliminado con exito.";

      return { status: true, action, message: message };
    } catch (error: any) {
      console.error("CreateOrDeleteLikePost Error:", error);

      const message =
        typeof error.response?.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      changeState("errorForm", { type: "error", message: message });

      return { status: false, action: null, message: "" };
    } finally {
      setTimeout(() => {
        changeState("isLoadingForm", false);
      }, 1000);
    }
  };

  const value: LikeContextType = {
    data: likeState.data,
    isLoadingForm: likeState.isLoadingForm,
    isLoading: likeState.isLoading,
    error: likeState.error,
    errorForm: likeState.errorForm,
    CreateOrDeleteLikePost,
    getLikePostById,
  };

  return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>;
};

export const useLike = (): LikeContextType => {
  const context = useContext(LikeContext);

  if (!context) {
    throw new Error("useLike debe usarse dentro de un LikeProvider");
  }

  return context;
};
