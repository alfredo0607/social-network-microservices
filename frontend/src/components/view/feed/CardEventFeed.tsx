import { useState, useEffect } from "react";
import {
  Card,
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  Avatar,
  Paper,
  Skeleton,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { ChevronRight, EyeOff, Info } from "lucide-react";
import { type Theme } from "@mui/material/styles";

/* ---------- Types ---------- */

interface FeedSuggestion {
  id: number;
  name: string;
  subtitle: string;
  avatar: string;
}

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  card: {
    border: `1px solid ${theme?.palette?.divider}`,
    borderRadius: 8,
    backgroundColor: theme?.palette?.background?.paper,
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.35)",
    transition: "box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  },
}));

export default function CardEventFeed() {
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de datos por 1 segundo
  useEffect(() => {
    const loadData = async () => {
      // Simular demora de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <Stack spacing={2} component={Paper} sx={{ borderRadius: 3 }}>
      <DailyGameCard isLoading={isLoading} />
      <AddToFeedCard isLoading={isLoading} />
    </Stack>
  );
}

const AvatarSkeleton = () => (
  <Skeleton variant="circular" width={44} height={44} animation="wave" />
);

const TextSkeleton = ({
  width = "100%",
  lines = 1,
}: {
  width?: string | number;
  lines?: number;
}) => (
  <>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={width}
        height={index === 0 ? 24 : 20}
        animation="wave"
        sx={{
          mt: index > 0 ? 0.5 : 0,
        }}
      />
    ))}
  </>
);

const ButtonSkeleton = () => (
  <Skeleton
    variant="rectangular"
    width={80}
    height={32}
    animation="wave"
    sx={{
      borderRadius: 999,
      bgcolor: "grey.200",
      mt: 1,
    }}
  />
);

/* ---------- Daily Game ---------- */

interface DailyGameCardProps {
  isLoading: boolean;
}

function DailyGameCard({ isLoading }: DailyGameCardProps) {
  const classes = useStyles();

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        minHeight: 120,
      }}
      className={classes.card}
    >
      {/* Título */}
      {isLoading ? (
        <Skeleton
          variant="text"
          width="60%"
          height={28}
          animation="wave"
          sx={{ mb: 2, bgcolor: "grey.200" }}
        />
      ) : (
        <Typography fontWeight={600} mb={1}>
          El pasatiempo de hoy
        </Typography>
      )}

      <Stack direction="row" spacing={2} alignItems="center">
        {/* Avatar */}
        {isLoading ? (
          <AvatarSkeleton />
        ) : (
          <Avatar
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "#3b82f6",
              fontWeight: 600,
            }}
          >
            Z
          </Avatar>
        )}

        <Box flex={1}>
          {/* Contenido del juego */}
          {isLoading ? (
            <>
              <TextSkeleton width="90%" lines={1} />
              <TextSkeleton width="70%" lines={1} />
              <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
                <Skeleton
                  variant="circular"
                  width={14}
                  height={14}
                  animation="wave"
                  sx={{ bgcolor: "grey.200" }}
                />
                <TextSkeleton width="80%" lines={1} />
              </Stack>
            </>
          ) : (
            <>
              <Typography fontSize={14} fontWeight={600}>
                Zip: un juego para darle al coco
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                ¡Resuélvelo en 60 segundos o menos!
              </Typography>

              <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
                <EyeOff size={14} color="text.secondary" />
                <Typography fontSize={12} color="text.secondary">
                  Solo tú podrás ver la puntuación
                </Typography>
              </Stack>
            </>
          )}
        </Box>

        {/* Chevron */}
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={18}
            height={18}
            animation="wave"
            sx={{ bgcolor: "grey.200" }}
          />
        ) : (
          <ChevronRight size={18} color="text.secondary" />
        )}
      </Stack>
    </Card>
  );
}

/* ---------- Add To Feed ---------- */

interface AddToFeedCardProps {
  isLoading: boolean;
}

function AddToFeedCard({ isLoading }: AddToFeedCardProps) {
  const suggestions: FeedSuggestion[] = [
    {
      id: 1,
      name: "Tatiana Muñoz Ballesteros",
      subtitle: "Jefe de selección",
      avatar: "/tatiana.jpg",
    },
    {
      id: 2,
      name: "CINTE Colombia",
      subtitle: "Empresa · Servicios y consultoría de TI",
      avatar: "/cinte.png",
    },
    {
      id: 3,
      name: "Nequi",
      subtitle: "Empresa · Servicios financieros",
      avatar: "/nequi.png",
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        minHeight: 380,
      }}
    >
      {/* Header */}
      {isLoading ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Skeleton
            variant="text"
            width="40%"
            height={28}
            animation="wave"
            sx={{ bgcolor: "grey.200" }}
          />
          <Skeleton
            variant="circular"
            width={16}
            height={16}
            animation="wave"
            sx={{ bgcolor: "grey.200" }}
          />
        </Stack>
      ) : (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={600}>Añadir a tu feed</Typography>
          <Info size={16} color="text.secondary" />
        </Stack>
      )}

      {/* Suggestions */}
      <Stack spacing={2}>
        {isLoading
          ? // Skeletons para las sugerencias
            Array.from({ length: 3 }).map((_, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <AvatarSkeleton />

                <Box flex={1}>
                  <TextSkeleton width="80%" lines={1} />
                  <TextSkeleton width="60%" lines={1} />
                  <ButtonSkeleton />
                </Box>
              </Stack>
            ))
          : // Contenido real
            suggestions.map((item) => (
              <Stack key={item.id} direction="row" spacing={2}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "#3b82f6",
                    fontWeight: 600,
                  }}
                >
                  {item.name.charAt(0)}
                </Avatar>

                <Box flex={1}>
                  <Typography fontSize={14} fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {item.subtitle}
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      borderRadius: 999,
                      borderColor: "text.secondary",
                      textTransform: "none",
                      fontSize: 12,
                      fontWeight: 500,
                      "&:hover": {
                        borderColor: "#3b82f6",
                      },
                    }}
                  >
                    + Seguir
                  </Button>
                </Box>
              </Stack>
            ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Ver todas las recomendaciones */}
      {isLoading ? (
        <Skeleton
          variant="text"
          width="60%"
          height={24}
          animation="wave"
          sx={{
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        />
      ) : (
        <Typography
          fontSize={14}
          sx={{
            cursor: "pointer",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
              color: "#1d4ed8",
            },
          }}
        >
          Ver todas las recomendaciones
          <ChevronRight size={16} />
        </Typography>
      )}
    </Card>
  );
}
