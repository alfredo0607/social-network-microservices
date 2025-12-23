/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  CardHeader,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { SquareUserRound, X } from "lucide-react";
import { useLike } from "../../../../context/likeContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  status: boolean;
  postID: number;
  onClose: () => void;
}

export default function ListUserLikePostDialog({
  status,
  onClose,
  postID,
}: Props) {
  const navigate = useNavigate();

  const {
    data: { likePost, total },
    isLoading,
    error,
    getLikePostById,
  } = useLike();

  useEffect(() => {
    getLikePostById(postID);
  }, [postID]);

  return (
    <>
      <Dialog open={status} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle variant="h4" fontWeight={"bold"} color="primary">
          Usuarios que interactuaron con la publicación
        </DialogTitle>

        <IconButton
          onClick={onClose}
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
          {isLoading && (
            <Box display="flex" justifyContent="center" p={4} mt={2}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && error?.message && (
            <Box display="flex" justifyContent="center" p={3} mt={2}>
              <Alert severity="error">{error.message}</Alert>
            </Box>
          )}

          {!isLoading && !error?.message && likePost.length === 0 && (
            <Typography variant="subtitle2" color="text.secondary">
              Aún no se registran interacciones en esta publicación.
            </Typography>
          )}

          {!isLoading && !error?.message && (
            <Typography>Numero de me gustas : {total}</Typography>
          )}

          {!isLoading &&
            !error?.message &&
            Array.isArray(likePost) &&
            likePost.map((x) => (
              <Card sx={{ m: 2 }}>
                <CardHeader
                  title={x.name}
                  subheader={x.likedAt}
                  avatar={
                    <Avatar src={`https://i.pravatar.cc/300?img=${x?.id}`} />
                  }
                  action={
                    <Tooltip title="Ir al perfil del usuario">
                      <IconButton
                        onClick={() =>
                          navigate(`/app/network/profile/${x?.id}`)
                        }
                      >
                        <SquareUserRound />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </Card>
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
