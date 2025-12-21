/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useEffect, useRef, useCallback } from "react";
import { usePost } from "../../../context/postContext";
import CardPost from "./CardPost";

export default function ListPostFeed() {
  const {
    getPostList,
    data: { post, page, totalPages },
    isLoading,
    error,
  } = usePost();

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
    if (page >= totalPages) return;

    getPostList(page + 1);
  }, [isLoading, page, totalPages]);

  useEffect(() => {
    getPostList(1);
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
    <>
      {!isLoading && error?.message && (
        <Grid
          component={Paper}
          display="flex"
          justifyContent="center"
          p={3}
          mt={2}
        >
          <Alert severity="error">{error.message}</Alert>
        </Grid>
      )}

      {post.map((x, index) => (
        <CardPost
          key={index}
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
        <Grid
          component={Paper}
          display="flex"
          justifyContent="center"
          p={4}
          mt={2}
        >
          <CircularProgress />
        </Grid>
      )}

      <div ref={observerRef} />

      {isLoading && page > 1 && (
        <Grid
          component={Paper}
          display="flex"
          justifyContent="center"
          p={3}
          mt={2}
        >
          <CircularProgress size={28} />
        </Grid>
      )}

      {page >= totalPages && post.length > 0 && (
        <Grid
          component={Paper}
          display="flex"
          justifyContent="center"
          p={2}
          mt={2}
        >
          <Alert severity="info">No hay más publicaciones</Alert>
        </Grid>
      )}
    </>
  );
}
