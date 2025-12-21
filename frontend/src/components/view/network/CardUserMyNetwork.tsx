import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { UserPlus } from "lucide-react";

export interface UserCardProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  onConnect?: () => void;
}

export const CardUserMyNetwork = ({
  name,
  role = "Profesional",
  avatarUrl,
  onConnect,
}: UserCardProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={avatarUrl}
            sx={{
              width: 72,
              height: 72,
              bgcolor: "grey.200",
            }}
          />

          <Box textAlign="center">
            <Typography fontWeight={600}>{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<UserPlus size={18} />}
            onClick={onConnect}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Ver perfil
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
