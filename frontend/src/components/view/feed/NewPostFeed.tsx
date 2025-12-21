import { Card, Box, Typography, Stack, Divider, Avatar } from "@mui/material";
import { Play, Image as ImageIcon, FileText } from "lucide-react";
import CreatePostDialog from "./Dialog/CreatePostDialog";
import { useState } from "react";
import { useAuth } from "../../../context/authContext";

export default function NewPostFeed() {
  const { user: authUser } = useAuth();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth: 720,
          borderRadius: 3,
          p: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid text.secondary",
            }}
            src={`https://i.pravatar.cc/300?img=${authUser?.id}`}
          >
            A
          </Avatar>

          <Box
            sx={(t) => ({
              flex: 1,
              border: "1px solid text.secondary",
              borderRadius: 999,
              px: 3,
              py: 1.2,
              color: "text.secondary",
              cursor: "pointer",
              "&:hover": {
                bgcolor: t.palette.action.hover,
              },
            })}
            onClick={() => setOpen(true)}
          >
            <Typography fontSize={14}>Crear publicación</Typography>
          </Box>
        </Stack>

        <Divider sx={(t) => ({ borderColor: t.palette.divider })} />

        <Stack direction="row" justifyContent="space-around" mt={2}>
          <ActionButton
            icon={<Play size={20} />}
            label="Video"
            color="#22c55e"
            onClick={() => setOpen(true)}
          />

          <ActionButton
            icon={<ImageIcon size={20} />}
            label="Foto"
            color="#60a5fa"
            onClick={() => setOpen(true)}
          />

          <ActionButton
            icon={<FileText size={20} />}
            label="Escribir artículo"
            color="#fb7185"
            onClick={() => setOpen(true)}
          />
        </Stack>
      </Card>

      {open && <CreatePostDialog open={open} onClose={() => setOpen(false)} />}
    </>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

function ActionButton({ icon, label, color, onClick }: ActionButtonProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={(t) => ({
        px: 2,
        py: 1,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": {
          bgcolor: t.palette.action.hover,
        },
      })}
      onClick={onClick}
    >
      <Box sx={{ color }}>{icon}</Box>
      <Typography fontSize={14} fontWeight={500}>
        {label}
      </Typography>
    </Stack>
  );
}
