/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useEffect, useRef, useCallback } from "react";
import CardUserInfo from "../../components/view/feed/CardUserInfo";
import NewPostFeed from "../../components/view/feed/NewPostFeed";
import CardPost from "../../components/view/feed/CardPost";
import CardEventFeed from "../../components/view/feed/CardEventFeed";
import { usePost } from "../../context/postContext";
import Page from "../../components/Page";

export default function FeedView() {
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
    <Page title="Feed">
      <Grid container spacing={2} mt={1}>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
          <CardUserInfo />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
          <NewPostFeed />

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
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
          <CardEventFeed />
        </Grid>
      </Grid>
    </Page>
  );
}
