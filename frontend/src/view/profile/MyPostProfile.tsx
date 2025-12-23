/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { usePost } from "../../context/postContext";
import CardPost from "../../components/view/feed/CardPost";

interface Props {
  userID: number;
}

export default function MyPostProfile({ userID }: Props) {
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
  }, [userID]);

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
    <Paper
      sx={(t) => ({
        p: 2,
        borderRadius: 3,
        border: 1,
        borderColor: t.palette.divider,
      })}
    >
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
          id={Number(x.id)}
          author={x.User.name}
          subtitle={x.createdAt}
          content={x.message}
          likes={x.likeCount}
          userHasLiked={x.userHasLiked}
          authorID={x.User.id}
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
    </Paper>
  );
}
