/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import CardUserInfo from "../../components/view/feed/CardUserInfo";
import NewPostFeed from "../../components/view/feed/NewPostFeed";
import CardEventFeed from "../../components/view/feed/CardEventFeed";
import Page from "../../components/Page";
import ListPostFeed from "../../components/view/feed/ListPostFeed";

export default function FeedView() {
  return (
    <Page title="Feed">
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
          <CardUserInfo />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
          <NewPostFeed />

          <ListPostFeed />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
          <CardEventFeed />
        </Grid>
      </Grid>
    </Page>
  );
}
