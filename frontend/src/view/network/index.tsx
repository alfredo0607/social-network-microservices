import { Grid } from "@mui/material";
import Page from "../../components/Page";
import CardUserInfo from "../../components/view/feed/CardUserInfo";
import { CardUserMyNetwork } from "../../components/view/network/CardUserMyNetwork";

export default function NetworkView() {
  return (
    <Page title="Mi red">
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
          <CardUserInfo />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8 }} container spacing={2}>
          {Array.from({ length: 10 }).map((x, index) => (
            <Grid size={4} key={index}>
              <CardUserMyNetwork
                name="Juan Pérez"
                role="Frontend Developer | React"
                avatarUrl="https://i.pravatar.cc/300"
                onConnect={() => console.log("Enviar solicitud")}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Page>
  );
}
