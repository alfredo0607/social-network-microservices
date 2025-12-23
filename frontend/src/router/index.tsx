/* eslint-disable react-hooks/exhaustive-deps */
import { useRoutes } from "react-router-dom";
import LoadingScreen from "../components/ui/loading/LoadingScreen";
import routes from "./routes";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";

function AppRouting() {
  const { isAuthenticated, checkingSession, relogin } = useAuth();

  const routing = useRoutes(routes(isAuthenticated));

  useEffect(() => {
    relogin();
  }, []);

  if (checkingSession) return <LoadingScreen />;

  return <>{routing}</>;
}

export default AppRouting;
