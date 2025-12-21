/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { getUserToken } from "../helpers";
import {
  fetchRequestPost,
  setRequestTokenPost,
} from "../helpers/fetchRequest/fetchRequestPost";

interface User {
  id: number;
  email: string;
  name: string;
}

interface Like {
  id: number;
  createdAt: string;
  userId: number;
  postId: number;
  User: User;
}

interface Image {
  nameServer: string;
  nameClient: string;
  ext: string;
  size: string;
}

interface Post {
  id: number;
  message: string;
  createdAt: string;
  userId: number;
  User: User;
  Like: Like[];
  PostImage: Image[];
  likeCount: number;
  userHasLiked: boolean;
}

interface CreatePostUser {
  message: string;
  userId: number;
  images: Image[];
}

interface CreatePostResponse {
  status: boolean;
}

interface PostState {
  data: { post: Post[]; page: number; total: number; totalPages: number };
  myPost: { post: Post[]; page: number; total: number; totalPages: number };
  isLoading: boolean;
  isLoadingForm: boolean;
  error?: { type: string; message: string };
  errorForm?: { type: string; message: string };
}

interface PostContextType {
  data: { post: Post[]; page: number; total: number; totalPages: number };
  myPost: { post: Post[]; page: number; total: number; totalPages: number };
  isLoading: boolean;
  isLoadingForm: boolean;
  error?: { type: string; message: string };
  errorForm?: { type: string; message: string };
  getPostList: (page: number) => Promise<void>;
  CreatePostUser: (post: CreatePostUser) => Promise<CreatePostResponse>;
  getPostListById: (userID: number, page: number) => Promise<void>;
  updateHasLikeUser: (postID: number, status: boolean) => Promise<void>;
  updateHasLikeUserMtpost: (postID: number, status: boolean) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider = ({ children }: PostProviderProps) => {
  const [authState, setAuthState] = useState<PostState>({
    data: { post: [], page: 1, total: 0, totalPages: 0 },
    myPost: { post: [], page: 1, total: 0, totalPages: 0 },
    isLoading: false,
    isLoadingForm: false,
    error: { type: "", message: "" },
    errorForm: { type: "", message: "" },
  });

  const changeState = (key: string, value: any) => {
    setAuthState((prev) => ({ ...prev, [key]: value }));
  };

  const getPostList = async (page: number) => {
    changeState("error", { type: "", message: "" });
    changeState("isLoading", true);

    try {
      const token_current = getUserToken();
      if (!token_current) throw new Error("No token found");
      setRequestTokenPost(token_current);

      const {
        data: { data },
      } = await fetchRequestPost(
        `/post/get-posts-paginated?page=${page}&limit=${10}`,
        "GET"
      );

      const {
        posts,
        pagination: { totalPosts, totalPages, currentPage },
      } = data;

      setAuthState((prev) => ({
        ...prev,
        data: {
          post: page > 1 ? [...prev.data.post, ...posts] : posts,
          page: currentPage,
          total: totalPosts,
          totalPages,
        },
      }));
    } catch (error: any) {
      console.error("Get Post List Error:", error);

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

  const getPostListById = async (userID: number, page: number) => {
    changeState("error", { type: "", message: "" });
    changeState("isLoading", true);

    try {
      const token_current = getUserToken();
      if (!token_current) throw new Error("No token found");
      setRequestTokenPost(token_current);

      const {
        data: { data },
      } = await fetchRequestPost(
        `/post/get-posts-by-user/${userID}?page=${page}&limit=${10}`,
        "GET"
      );

      const {
        posts,
        pagination: { totalPosts, totalPages, currentPage },
      } = data;

      setAuthState((prev) => ({
        ...prev,
        myPost: {
          post: page > 1 ? [...prev.data.post, ...posts] : posts,
          page: currentPage,
          total: totalPosts,
          totalPages,
        },
      }));
    } catch (error: any) {
      console.error("Get Post List Error:", error);

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

  const CreatePostUser = async (post: CreatePostUser) => {
    changeState("errorForm", { type: "", message: "" });
    changeState("isLoadingForm", true);

    try {
      const token_current = getUserToken();
      if (!token_current) throw new Error("No token found");
      setRequestTokenPost(token_current);

      const {
        data: { data },
      } = await fetchRequestPost(`/post/create-post`, "POST", post);

      const { post: posts } = data;

      setAuthState((prev) => ({
        ...prev,
        data: { ...prev.data, post: [posts, ...prev.data.post] },
      }));

      return { status: true };
    } catch (error: any) {
      console.error("Get Post List Error:", error);

      const message =
        typeof error.response?.data.errores === "string"
          ? error.response.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      changeState("errorForm", { type: "error", message: message });

      return { status: false };
    } finally {
      setTimeout(() => {
        changeState("isLoadingForm", false);
      }, 1000);
    }
  };

  const updateHasLikeUser = async (postID: number, status: boolean) => {
    setAuthState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        post: prev.data.post.map((x) =>
          Number(x.id) === Number(postID)
            ? {
                ...x,
                userHasLiked: status,
                likeCount: status ? x.likeCount + 1 : x.likeCount - 1,
              }
            : x
        ),
      },
    }));
  };

  const updateHasLikeUserMtpost = async (postID: number, status: boolean) => {
    setAuthState((prev) => ({
      ...prev,
      myPost: {
        ...prev.myPost,
        post: prev.myPost.post.map((x) =>
          Number(x.id) === Number(postID)
            ? {
                ...x,
                userHasLiked: status,
                likeCount: status ? x.likeCount + 1 : x.likeCount - 1,
              }
            : x
        ),
      },
    }));
  };

  const value: PostContextType = {
    data: authState.data,
    myPost: authState.myPost,
    isLoadingForm: authState.isLoadingForm,
    isLoading: authState.isLoading,
    error: authState.error,
    errorForm: authState.errorForm,
    getPostList,
    CreatePostUser,
    getPostListById,
    updateHasLikeUser,
    updateHasLikeUserMtpost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePost = (): PostContextType => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un PostProvider");
  }

  return context;
};
