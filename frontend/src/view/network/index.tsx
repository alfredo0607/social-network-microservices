import { Grid } from "@mui/material";
import Page from "../../components/Page";
import CardUserInfo from "../../components/view/feed/CardUserInfo";
import ListUserNetwork from "../../components/view/network/ListUserNetwork";

export default function NetworkView() {
  return (
    <Page title="Mi red">
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          <CardUserInfo />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }} container spacing={2}>
          <ListUserNetwork />
        </Grid>
      </Grid>
    </Page>
  );
}
