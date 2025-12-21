import { Home, User2, UserCircle2 } from "lucide-react";
import { Tab, Tabs, useTheme, alpha } from "@mui/material";
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
    route: `/app/my_profile/${userID}`,
  },
];

export default function HeaderTabs() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const tabsToRender = useMemo(() => {
    return optionsMenu(Number(user?.id));
  }, [user?.id]);

  const currentTab = tabsToRender.findIndex((item) =>
    location.pathname.startsWith(item.route)
  );

  return (
    <Tabs
      value={currentTab === -1 ? 0 : currentTab}
      onChange={(_, newValue) => {
        navigate(tabsToRender[newValue].route);
      }}
      aria-label="icon tabs example"
      sx={{
        "& .MuiTabs-indicator": {
          backgroundColor: theme.palette.primary.main,
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
        minHeight: 56,
      }}
    >
      {tabsToRender.map(({ Icon, label }, index) => {
        const isSelected = currentTab === index;

        return (
          <Tab
            key={index}
            icon={<Icon size={18} />}
            label={label}
            iconPosition="start"
            sx={{
              fontSize: 12,
              color: isSelected ? "#000000" : "#FFFFFF",
              fontWeight: isSelected ? 600 : 400,
              textTransform: "none",
              minHeight: 56,
              borderTopRightRadius: 6,
              borderTopLeftRadius: 6,
              mx: 0.5,
              transition: "all 0.2s ease-in-out",

              backgroundColor: isSelected ? "#FFFFFF" : "transparent",

              "&:hover": {
                backgroundColor: isSelected ? "#FFFFFF" : alpha("#FFFFFF", 0.1),
                color: isSelected ? "#000000" : "#FFFFFF",
                "& .lucide": {
                  color: isSelected ? "#000000" : "#FFFFFF",
                },
              },

              "&.Mui-selected": {
                color: "#000000",
                backgroundColor: "#FFFFFF",
              },

              "& .lucide": {
                color: isSelected ? "#000000" : "#FFFFFF",
                transition: "color 0.2s ease-in-out",
              },

              "&.Mui-selected .lucide": {
                color: "#000000",
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}
