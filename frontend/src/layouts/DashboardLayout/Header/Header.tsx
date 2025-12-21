import Stack from "@mui/material/Stack";

import { Bell } from "lucide-react";
import MenuButton from "../../../components/MenuButton";

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Stack
        direction="row"
        sx={{
          gap: 1,
        }}
      >
        <MenuButton aria-label="Open notifications" showBadge>
          <Bell size={20} />
        </MenuButton>
      </Stack>
    </Stack>
  );
}
