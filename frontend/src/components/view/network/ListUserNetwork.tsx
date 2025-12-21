/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useUser } from "../../../context/userContext";
import { CardUserMyNetwork } from "./CardUserMyNetwork";
import {
  Alert,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Card,
  CardContent,
  CardActions,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CardUserSkeleton() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box flex={1}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" width="100%" height={36} />
      </CardActions>
    </Card>
  );
}

export default function ListUserNetwork() {
  const navigate = useNavigate();

  const {
    data: { user, total },
    isLoading,
    error,
    getUserList,
  } = useUser();

  useEffect(() => {
    getUserList();
  }, []);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
            key={`skeleton-${index}`}
          >
            <CardUserSkeleton />
          </Grid>
        ))}
      </>
    );
  }

  if (error?.message) {
    return (
      <Grid size={12} mt={2}>
        <Paper sx={{ p: 3 }}>
          <Alert severity="error">{error.message}</Alert>
        </Paper>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Número de usuarios: {total}
      </Typography>

      <Grid container spacing={3}>
        {user.map((x, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={x.id || index}>
            <CardUserMyNetwork
              id={x.id}
              name={x.name}
              alias={x.alias}
              avatarUrl={`https://i.pravatar.cc/30${index}`}
              onConnect={() => navigate(`/app/network/profile/${x.id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
