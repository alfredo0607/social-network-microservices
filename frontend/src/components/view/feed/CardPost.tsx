import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  Avatar,
} from "@mui/material";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
} from "lucide-react";
import { useState } from "react";
import ListUserLikePostDialog from "./Dialog/ListUserLikePostDialog";
import { useLike } from "../../../context/likeContext";
import { useAuth } from "../../../context/authContext";
import { useAlert } from "../../../context/alertsContext";
import { usePost } from "../../../context/postContext";

interface PostCardProps {
  author: string;
  subtitle: string;
  content: string;
  image?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  id: number;
  userHasLiked: boolean;
  authorID: number;
}

export default function CardPost({
  author,
  subtitle,
  content,
  image,
  likes = 0,
  comments = 0,
  shares = 0,
  id,
  userHasLiked,
  authorID,
}: PostCardProps) {
  const [{ status, postID }, setDialogLike] = useState({
    status: false,
    postID: 0,
  });

  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { CreateOrDeleteLikePost } = useLike();
  const { updateHasLikeUser, updateHasLikeUserMtpost } = usePost();

  const [loadingLike, setLoadingLike] = useState(false);

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
              src={`https://i.pravatar.cc/300?img=${authorID}`}
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
            onClick={() => setDialogLike({ status: true, postID: id })}
          >
            👍 {likes} Me gustas
          </Typography>

          <Typography fontSize={12} color="text.secondary">
            {comments} comentarios · {shares} veces compartido
          </Typography>
        </Stack>

        <Divider sx={(t) => ({ borderColor: t.palette.divider })} />

        <Stack direction="row" justifyContent="space-around" py={1}>
          <PostAction
            key={id}
            icon={<ThumbsUp size={18} />}
            label="Me gusta"
            onClick={async () => {
              setLoadingLike(true);

              const res = await CreateOrDeleteLikePost(
                Number(id),
                Number(user?.id)
              );

              setLoadingLike(false);

              if (res.status) {
                const status = res.action === "added";
                showAlert(res.message, "success");
                updateHasLikeUser(id, status);
                updateHasLikeUserMtpost(id, status);
              }
            }}
            disabled={loadingLike}
            userHasLiked={userHasLiked}
          />
          <PostAction icon={<MessageCircle size={18} />} label="Comentar" />
          <PostAction icon={<Repeat2 size={18} />} label="Compartir" />
          <PostAction icon={<Send size={18} />} label="Enviar" />
        </Stack>
      </Card>

      {status && postID !== 0 && (
        <ListUserLikePostDialog
          status={status}
          onClose={() => setDialogLike({ status: false, postID: id })}
          postID={Number(postID)}
        />
      )}
    </>
  );
}

interface PostActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  userHasLiked?: boolean;
}

function PostAction({
  icon,
  label,
  onClick,
  disabled = false,
  userHasLiked = false,
}: PostActionProps) {
  return (
    <Button
      onClick={onClick}
      startIcon={icon}
      sx={(t) => ({
        textTransform: "none",

        color: userHasLiked ? t.palette.primary.main : t.palette.text.secondary,
        "&:hover": {
          bgcolor: t.palette.action.hover,
        },
      })}
      disabled={disabled}
      // loading={disabled}
      variant="text"
    >
      {label}
    </Button>
  );
}
