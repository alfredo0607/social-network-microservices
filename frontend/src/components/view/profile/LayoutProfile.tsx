import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useUser } from "../../../context/userContext";

export default function LayoutProfile() {
  const { detailUser } = useUser();

  return (
    <>
      <Box>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Idioma del perfil
            </Typography>
            <Typography sx={{ color: "#b8b8b8", mb: 2 }}>Español</Typography>
            <Divider sx={{ bgcolor: "#4a5568", my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              URL y perfil público
            </Typography>
            <Typography
              sx={{
                color: "#58a6ff",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              www.linkedin.com/in/{detailUser?.name}-b2163b1a2
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#1a472a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: "#e8744f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "14px solid #fff",
                    transform: "rotate(180deg)",
                  }}
                />
              </Box>
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              {detailUser?.name}, explora oportunidades relevantes con Lean Tech
            </Typography>
            <Typography sx={{ color: "#b8b8b8", fontSize: "0.875rem", mb: 2 }}>
              Obtén notificaciones de anuncios de empleo y noticias del sector
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                color: "#58a6ff",
                borderColor: "#58a6ff",
                textTransform: "none",
                borderRadius: 5,
              }}
            >
              Seguir
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
