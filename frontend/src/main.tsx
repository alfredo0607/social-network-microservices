import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "./context/alertsContext.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import { PostProvider } from "./context/postContext.tsx";
import { LikeProvider } from "./context/likeContext.tsx";
import { UserProvider } from "./context/userContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <AlertProvider>
        <AuthProvider>
          <PostProvider>
            <LikeProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </LikeProvider>
          </PostProvider>
        </AuthProvider>
      </AlertProvider>
    </StrictMode>
  </BrowserRouter>
);
