import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginView from "../view/auth/LoginView";
import FeedView from "../view/feed";
import NetworkView from "../view/network";
import ProfileView from "../view/profile";

const routes = (isLoggedIn: boolean) => [
  {
    path: "/",
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: "/", element: <Navigate to="/app/feed" /> },
      { path: "/app/feed", element: <FeedView /> },
      { path: "/app/network", element: <NetworkView /> },
      { path: "/app/my_profile/:userID", element: <ProfileView /> },
      { path: "/app/network/profile/:userID", element: <ProfileView /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  {
    path: "/",
    element: !isLoggedIn ? <MainLayout /> : <Navigate to={"/"} />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "/login", element: <LoginView /> },
      { path: "*", element: <Navigate to="/login" /> },
    ],
  },
];
export default routes;
