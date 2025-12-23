import { Box, Button, Grid, Paper } from "@mui/material";
import BannerProfile from "../../components/view/profile/BannerProfile";
import CardDescriptionProfile from "../../components/view/profile/CardDescriptionProfile";
import LayoutProfile from "../../components/view/profile/LayoutProfile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyPostProfile from "./MyPostProfile";
import Page from "../../components/Page";

export const ProfileView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const { userID: formater } = useParams();

  const userID = Number(formater);

  return (
    <Page title="Mi perfil">
      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: 1200,
        }}
      >
        <Grid size={12}>
          {currentPath.includes("network") ? (
            <>
              <Grid size={12} component={Paper} mb={2} elevation={0} mt={3}>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => navigate(-1)}
                >
                  Atras
                </Button>
              </Grid>
            </>
          ) : null}

          <BannerProfile />
        </Grid>

        <Grid size={8}>
          <CardDescriptionProfile userID={userID} />

          <Box sx={{ mt: 2 }} />

          <MyPostProfile userID={userID} />
        </Grid>

        <Grid size={4}>
          <LayoutProfile />
        </Grid>
      </Grid>
    </Page>
  );
};

export default ProfileView;
