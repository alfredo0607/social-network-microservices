import { useRoutes } from "react-router-dom";
import LoadingScreen from "../components/ui/loading/LoadingScreen";
import routes from "./routes";
import { useAuth } from "../context/authContext";

function AppRouting() {
  const { isAuthenticated, checkingSession } = useAuth();

  const routing = useRoutes(routes(isAuthenticated));

  if (checkingSession) return <LoadingScreen />;

  return <>{routing}</>;
}

export default AppRouting;
