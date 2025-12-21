import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";

interface User {
  id: number;
  email: string;
}

interface Like {
  id: number;
  createdAt: string;
  userId: number;
  postId: number;
  User: User;
}

interface PostCardProps {
  author: string;
  subtitle: string;
  time: string;
  content: string;
  image?: string; // opcional
  likes?: number;
  comments?: number;
  shares?: number;
  likesList: Like[];
}

export default function CardPost({
  author,
  subtitle,
  time,
  content,
  image,
  likes = 0,
  comments = 0,
  shares = 0,
  likesList,
}: PostCardProps) {
  const [dialogLike, setDialogLike] = useState(false);

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          mt: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          p={2}
        >
          <Stack direction="row" spacing={2}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
              }}
            >
              A
            </Avatar>

            <Box>
              <Typography fontSize={14} fontWeight={600}>
                {author}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {subtitle}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {time}
              </Typography>
            </Box>
          </Stack>

          <MoreHorizontal size={18} />
        </Stack>

        <Box px={2} pb={image ? 1 : 2}>
          <Typography fontSize={14} whiteSpace="pre-line">
            {content}
          </Typography>
        </Box>

        {image && (
          <Box
            component="img"
            src={image}
            alt="post"
            sx={{
              width: "100%",
              maxHeight: 360,
              objectFit: "cover",
              mt: 1,
            }}
          />
        )}

        <Stack direction="row" justifyContent="space-between" px={2} py={1}>
          <Typography
            fontSize={12}
            color="text.secondary"
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => setDialogLike(true)}
          >
            👍 {likes} Me gustas
          </Typography>

          <Typography fontSize={12} color="text.secondary">
            {comments} comentarios · {shares} veces compartido
          </Typography>
        </Stack>

        <Divider sx={(t) => ({ borderColor: t.palette.divider })} />

        <Stack direction="row" justifyContent="space-around" py={1}>
          <PostAction icon={<ThumbsUp size={18} />} label="Recomendar" />
          <PostAction icon={<MessageCircle size={18} />} label="Comentar" />
          <PostAction icon={<Repeat2 size={18} />} label="Compartir" />
          <PostAction icon={<Send size={18} />} label="Enviar" />
        </Stack>
      </Card>

      <Dialog
        open={dialogLike}
        onClose={() => setDialogLike(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle variant="h4" fontWeight={"bold"} color="primary">
          Usuarios que interactuaron con la publicación
        </DialogTitle>

        <IconButton
          onClick={() => setDialogLike(false)}
          sx={() => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
          })}
        >
          <X />
        </IconButton>

        <DialogContent>
          {likesList.length === 0 && (
            <Typography variant="subtitle2" color="text.secondary">
              Aún no se registran interacciones en esta publicación.
            </Typography>
          )}

          {Array.isArray(likesList) &&
            likesList.map((x) => (
              <Card sx={{ m: 2 }}>
                <CardHeader
                  title={x.User.email}
                  subheader={x.createdAt}
                  avatar={<Avatar />}
                  action={<ThumbsUp />}
                />
              </Card>
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface PostActionProps {
  icon: React.ReactNode;
  label: string;
}

function PostAction({ icon, label }: PostActionProps) {
  return (
    <Button
      startIcon={icon}
      sx={(t) => ({
        textTransform: "none",
        fontSize: 14,
        border: "none",
        "&:hover": {
          bgcolor: t.palette.action.hoverOpacity,
        },
      })}
    >
      {label}
    </Button>
  );
}
