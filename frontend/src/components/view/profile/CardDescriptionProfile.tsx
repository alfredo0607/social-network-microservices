/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { AtSign } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "../../../context/userContext";

interface Props {
  userID: number;
}

export default function CardDescriptionProfile({ userID }: Props) {
  const { getUserById, detailUser, error, isLoading } = useUser();

  useEffect(() => {
    getUserById(userID);
  }, [userID]);

  return (
    <>
      <Box
        sx={(t) => ({
          flex: 1,
          p: 2,
          borderRadius: 3,
          border: 1,
          borderColor: t.palette.divider,
        })}
        component={Paper}
        elevation={0}
      >
        {isLoading && (
          <Box display="flex" justifyContent="center" p={4} mt={2}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && error?.message && (
          <Box
            component={Paper}
            display="flex"
            justifyContent="center"
            p={3}
            mt={2}
          >
            <Alert severity="error">{error.message}</Alert>
          </Box>
        )}

        {!isLoading && !error?.message && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {detailUser?.name}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AtSign size={16} />}
                sx={{
                  color: "#58a6ff",
                  borderColor: "#58a6ff",
                  textTransform: "none",
                  borderRadius: 5,
                }}
              >
                {detailUser?.alias}
              </Button>
            </Box>

            <Typography sx={{ mb: 2 }}>{detailUser?.email}</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography>
                Cuenta creada el : {detailUser?.createdAt}{" "}
                <span style={{ color: "#58a6ff", cursor: "pointer" }}>
                  Información de contacto
                </span>
              </Typography>
            </Box>

            <Typography sx={{ color: "#58a6ff", mb: 2, cursor: "pointer" }}>
              {detailUser?.age} años
            </Typography>
          </>
        )}
      </Box>
    </>
  );
}
