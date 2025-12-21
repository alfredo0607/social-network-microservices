/* eslint-disable react-hooks/incompatible-library */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Calendar, Clock, Image, Plus, Settings, Smile, X } from "lucide-react";
import { usePost } from "../../../../context/postContext";
import { useAuth } from "../../../../context/authContext";
import LoadingForms from "../../../ui/loading/LoadingForms";

const schema = yup.object({
  content: yup.string().required("Escribe algo para publicar").max(3000),
});

type FormData = yup.InferType<typeof schema>;

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostDialog({
  open,
  onClose,
}: CreatePostDialogProps) {
  const { CreatePostUser, isLoadingForm, errorForm } = usePost();

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { content: "" },
  });

  const content = watch("content");

  const onSubmit = async (data: FormData) => {
    const temp = {
      message: data.content,
      userId: Number(user?.id),
      images: [],
    };

    const { status } = await CreatePostUser(temp);

    if (status === true) {
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        {isLoadingForm && <LoadingForms />}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="/react-avatar.png" />

            <Box>
              <Typography fontWeight={600}>Alfredo Domínguez</Typography>

              <Typography fontSize={13} color="text.secondary">
                Publicar para Cualquiera
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={onClose}
            sx={{ color: "text.secondary" }}
            disabled={isLoadingForm}
          >
            <X />
          </IconButton>
        </Stack>

        <Box px={2} pb={1}>
          <textarea
            {...register("content")}
            placeholder="¿Sobre qué quieres hablar?"
            style={{
              width: "100%",
              minHeight: 220,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "#e5e7eb",
              fontSize: 16,
              fontFamily: "inherit",
            }}
          />

          {errors.content && (
            <Typography fontSize={12} color="#f87171">
              {errors.content.message}
            </Typography>
          )}

          {!isLoadingForm && errorForm && errorForm.message !== "" && (
            <Alert sx={{ mt: 2 }} severity="error">
              {errorForm.message}
            </Alert>
          )}
        </Box>

        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px={2}
          >
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "text.secondary" }}>
                <Smile />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "#1f2937" }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1.5}
          >
            {/* Left icons */}
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "text.secondary" }}>
                <Image />
              </IconButton>
              <IconButton sx={{ color: "text.secondary" }}>
                <Calendar />
              </IconButton>
              <IconButton sx={{ color: "text.secondary" }}>
                <Settings />
              </IconButton>
              <IconButton sx={{ color: "text.secondary" }}>
                <Plus />
              </IconButton>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Clock size={16} color="text.secondary" />

              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={!content?.trim() || isLoadingForm}
                sx={{
                  bgcolor: "#60a5fa",
                  color: "#000",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 999,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#3b82f6",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#1f2937",
                    color: "#6b7280",
                  },
                }}
              >
                Publicar
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}
