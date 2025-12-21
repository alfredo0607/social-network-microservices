/* eslint-disable react-hooks/exhaustive-deps */
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
  Alert,
} from "@mui/material";
import { ChevronRight, Info } from "lucide-react";
import { useUser } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";

export default function CardEventFeed() {
  const { getUserList } = useUser();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <Stack spacing={2} sx={{ borderRadius: 3 }}>
      <DailyGameCard isLoading={isLoading} />
      <AddToFeedCard />
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

interface DailyGameCardProps {
  isLoading: boolean;
}

function DailyGameCard({ isLoading }: DailyGameCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        minHeight: 120,
      }}
    >
      {isLoading ? (
        <Skeleton
          variant="text"
          width="60%"
          height={28}
          animation="wave"
          sx={{ mb: 2 }}
        />
      ) : (
        <Typography fontWeight={600} mb={1}>
          El pasatiempo de hoy
        </Typography>
      )}

      <Stack direction="row" spacing={2} alignItems="center">
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
            src={`https://i.pravatar.cc/302`}
          >
            Z
          </Avatar>
        )}

        <Box flex={1}>
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
                Un juego para darle al coco
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                ¡Resuélvelo en 60 segundos o menos!
              </Typography>
            </>
          )}
        </Box>

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

function AddToFeedCard() {
  const navigate = useNavigate();

  const {
    data: { user },
    isLoading,
    error,
  } = useUser();

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        minHeight: 380,
      }}
    >
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

      <Stack spacing={2}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <AvatarSkeleton />

                <Box flex={1}>
                  <TextSkeleton width="80%" lines={1} />
                  <TextSkeleton width="60%" lines={1} />
                  <ButtonSkeleton />
                </Box>
              </Stack>
            ))
          : !isLoading &&
            !error?.message &&
            user.map((item) => (
              <Stack key={item.id} direction="row" spacing={2}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "#3b82f6",
                    fontWeight: 600,
                  }}
                  src={`https://i.pravatar.cc/30${item.id}`}
                >
                  {item.name.charAt(0)}
                </Avatar>

                <Box flex={1}>
                  <Typography fontSize={14} fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    @{item.alias}
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
                    onClick={() => navigate(`/app/network/profile/${item.id}`)}
                  >
                    Perfil
                  </Button>
                </Box>
              </Stack>
            ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

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
          onClick={() => navigate(`/app/network`)}
        >
          Ver todas las recomendaciones
          <ChevronRight size={16} />
        </Typography>
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
    </Card>
  );
}
