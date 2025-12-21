import { Box, Button, Typography } from "@mui/material";
import { MapPin, Shield } from "lucide-react";

export default function CardDescriptionProfile() {
  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Alfredo Domínguez
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Shield size={16} />}
            sx={{
              color: "#58a6ff",
              borderColor: "#58a6ff",
              textTransform: "none",
              borderRadius: 5,
            }}
          >
            Añadir insignia de verificación
          </Button>
        </Box>

        <Typography sx={{ mb: 2 }}>
          Fullstack Software Engineer 💻 / JavaScript / Typescript / React /
          React Native / NodeJS / AWS / Azure / SQL / NO SQL
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <MapPin size={16} />
          <Typography>
            Barranquilla, Atlántico, Colombia ·{" "}
            <span style={{ color: "#58a6ff", cursor: "pointer" }}>
              Información de contacto
            </span>
          </Typography>
        </Box>

        <Typography sx={{ color: "#58a6ff", mb: 2, cursor: "pointer" }}>
          31 contactos
        </Typography>
      </Box>
    </>
  );
}
