/* eslint-disable react-hooks/exhaustive-deps */
import { Home, User2, UserCircle2 } from "lucide-react";
import { Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useMemo } from "react";

const optionsMenu = (userID: number) => [
  { key: "feed", label: "Inicio", Icon: Home, route: "/app/feed" },
  { key: "my-network", label: "Mi red", Icon: User2, route: "/app/network" },
  {
    key: "my-profile",
    label: "Mi perfil",
    Icon: UserCircle2,
    route: `/app/profile/${userID}`,
  },
];

export default function HeaderTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const tabsToRender = useMemo(() => {
    const tabs = optionsMenu(Number(user?.id));

    return tabs;
  }, [user?.id]);

  const currentTab = tabsToRender.findIndex(
    (item) => location.pathname === item.route
  );

  return (
    <Tabs
      value={currentTab === -1 ? 0 : currentTab}
      onChange={(_, newValue) => {
        navigate(tabsToRender[newValue].route);
      }}
      aria-label="icon tabs example"
    >
      {tabsToRender.map(({ Icon, label }, index) => (
        <Tab
          key={index}
          icon={<Icon />}
          label={label}
          sx={{ fontSize: 11, color: "white" }}
        />
      ))}
    </Tabs>
  );
}
