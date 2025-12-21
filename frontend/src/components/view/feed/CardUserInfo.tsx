/* eslint-disable react-hooks/static-components */
import React, { useState, useEffect } from "react";
import {
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
  Chip,
  Avatar,
  Tooltip,
  Card,
  Skeleton,
} from "@mui/material";
import { Bookmark, Users, Newspaper, Calendar, Eye } from "lucide-react";
import { useAuth } from "../../../context/authContext";

export default function CardUserInfo() {
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [displayUser, setDisplayUser] = useState({
    name: "",
    email: "",
    createdAt: "",
    alias: "",
  });

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (authUser) {
        setDisplayUser({
          name: authUser.name,
          email: authUser.email,
          createdAt: authUser.createdAt,
          alias: authUser.alias,
        });
      }

      setIsLoading(false);
    };

    loadData();
  }, [authUser]);

  const TextSkeleton = ({ width = "100%" }: { width?: string | number }) => (
    <Skeleton variant="text" width={width} height={24} animation="wave" />
  );

  return (
    <Card sx={{ minHeight: 450, borderRadius: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 3,
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={100}
            height={100}
            animation="wave"
            sx={{ bgcolor: "grey.200" }}
          />
        ) : (
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#60a5fa",
              fontSize: 36,
              fontWeight: 600,
            }}
          >
            {displayUser.name?.charAt(0) || "A"}
          </Avatar>
        )}
      </Box>

      <CardContent sx={{ pt: 2 }}>
        <Stack spacing={1.2}>
          {/* Nombre */}
          {isLoading ? (
            <TextSkeleton width="70%" />
          ) : (
            <Typography fontWeight={700} fontSize={20}>
              {displayUser.name}
            </Typography>
          )}

          {/* Email */}
          {isLoading ? (
            <TextSkeleton width="85%" />
          ) : (
            <Tooltip title={displayUser.email}>
              <Typography
                fontSize={14}
                noWrap
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  color: "text.secondary",
                }}
              >
                {displayUser.email}
              </Typography>
            </Tooltip>
          )}

          {/* Fecha */}
          {isLoading ? (
            <TextSkeleton width="50%" />
          ) : (
            <Tooltip title="Fecha de creacion de cuenta.">
              <Typography fontSize={13} color="text.secondary">
                {displayUser.createdAt}
              </Typography>
            </Tooltip>
          )}

          {/* Alias */}
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width={80}
              height={28}
              animation="wave"
              sx={{ borderRadius: 16, bgcolor: "grey.200" }}
            />
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`@${displayUser.alias}`}
                size="small"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
            </Stack>
          )}
        </Stack>
      </CardContent>

      <Divider sx={{ my: 1 }} />

      <CardContent sx={{ py: 1 }}>
        {isLoading ? (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <TextSkeleton width="60%" />
              <TextSkeleton width="15%" />
            </Stack>
            <TextSkeleton width="40%" />
          </Stack>
        ) : (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize={14} color="text.secondary">
                Visualizaciones del perfil
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Eye size={16} color="text.secondary" />
                <Typography fontWeight={600}>4</Typography>
              </Stack>
            </Stack>
            <Typography
              fontSize={13}
              color="#60a5fa"
              sx={{
                mt: 0.5,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Ver todos los análisis
            </Typography>
          </>
        )}
      </CardContent>

      <Divider sx={{ my: 1 }} />

      <CardContent>
        <Stack spacing={1.5}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Skeleton
                  variant="circular"
                  width={20}
                  height={20}
                  animation="wave"
                  sx={{ bgcolor: "grey.200" }}
                />
                <Skeleton
                  variant="text"
                  width={120}
                  height={20}
                  animation="wave"
                  sx={{ bgcolor: "grey.200" }}
                />
              </Stack>
            ))
          ) : (
            <>
              <MenuItem
                icon={<Bookmark size={18} />}
                label="Elementos guardados"
              />
              <MenuItem icon={<Users size={18} />} label="Grupos" />
              <MenuItem icon={<Newspaper size={18} />} label="Newsletters" />
              <MenuItem icon={<Calendar size={18} />} label="Eventos" />
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
}

function MenuItem({ icon, label }: MenuItemProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        cursor: "pointer",
        color: "text.secondary",
        py: 0.5,
        borderRadius: 1,
        px: 1,
        "&:hover": {
          color: "#60a5fa",
        },
        transition: "all 0.2s ease",
      }}
    >
      {icon}
      <Typography fontSize={14} fontWeight={500}>
        {label}
      </Typography>
    </Stack>
  );
}
