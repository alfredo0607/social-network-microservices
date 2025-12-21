/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/preserve-manual-memoization */
import React, { useCallback, useEffect, useRef } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import BannerProfile from "../../components/view/profile/BannerProfile";
import CardDescriptionProfile from "../../components/view/profile/CardDescriptionProfile";
import LayoutProfile from "../../components/view/profile/LayoutProfile";
import { usePost } from "../../context/postContext";
import CardPost from "../../components/view/feed/CardPost";
import { useParams } from "react-router-dom";

export const ProfileView: React.FC = () => {
  const { userID: formater } = useParams();

  const userID = Number(formater);

  const {
    getPostListById,
    myPost: { post, page, totalPages },
    isLoading,
    error,
  } = usePost();

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
    if (page >= totalPages) return;

    getPostListById(userID, page + 1);
  }, [isLoading, page, totalPages]);

  useEffect(() => {
    getPostListById(userID, 1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMorePosts]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        maxWidth: 1200,
      }}
    >
      <Grid size={12}>
        <BannerProfile />
      </Grid>

      <Grid size={8}>
        <CardDescriptionProfile />

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={"bold"}>
          Mis publicaciones
        </Typography>

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

        {post.map((x) => (
          <CardPost
            key={x.id}
            author={x.User.email}
            subtitle={x.createdAt}
            time="1 d"
            content={x.message}
            likes={x.likeCount}
            comments={19}
            shares={38}
            likesList={x.Like}
          />
        ))}

        {isLoading && page === 1 && (
          <Box
            component={Paper}
            display="flex"
            justifyContent="center"
            p={4}
            mt={2}
          >
            <CircularProgress />
          </Box>
        )}

        <div ref={observerRef} />

        {isLoading && page > 1 && (
          <Box
            component={Paper}
            display="flex"
            justifyContent="center"
            p={3}
            mt={2}
          >
            <CircularProgress size={28} />
          </Box>
        )}

        {page >= totalPages && post.length > 0 && (
          <Box
            component={Paper}
            display="flex"
            justifyContent="center"
            p={2}
            mt={2}
          >
            <Alert severity="info">No hay más publicaciones</Alert>
          </Box>
        )}
      </Grid>

      <Grid size={4}>
        <LayoutProfile />
      </Grid>
    </Grid>
  );
};

export default ProfileView;
