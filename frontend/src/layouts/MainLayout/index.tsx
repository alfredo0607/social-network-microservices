import { Outlet } from "react-router-dom";
import { type Theme } from "@mui/material/styles";
import { Typography, Grid, Box } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
// import authBackgroundLight from "../../assets/static/images/auth-background-light.png";
// import authBackgroundDark from "../../assets/static/images/auth-background-dark-2.png";
import backgroundImage from "../../assets/static/images/imstagran_banner.png";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  root: {
    height: "100%",
    padding: theme.spacing && theme.spacing(3, 2, 1),
    background: theme.palette?.background.default,
    // backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "repeat",
  },
  mainContent: {
    background: theme.palette?.background.paper,
    borderRadius: "5px",
    boxShadow: "2px 2px 7px 1px #0000009e",
    minHeight: "90vh",
    transition: "height 0.3s ease-in-out",
  },
  content: {
    padding: theme.spacing && theme.spacing(1, 2),
    overflowY: "auto",
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyItems: "center",
    justifyContent: "center",
    "&::-webkit-scrollbar": {
      width: "17px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#d6dee1",
      borderRadius: "20px",
      border: "6px solid transparent",
      backgroundClip: "content-box",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#a8bbbf",
    },
  },
  image: {
    // backgroundImage:
    //   theme.palette.mode === "light"
    //     ? `url(${authBackgroundLight})`
    //     : `url(${authBackgroundDark})`,
    width: "50%",
    height: "auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    transition: "height 0.3s ease-in-out",
    alignSelf: "center",
    textAlign: "center",
  },
}));

const MainLayout = () => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <Grid
        container
        component="div"
        className={classes.mainContent}
        size={{
          xs: 12,
          sm: 12,
          md: 12,
        }}
      >
        <Grid
          size={{
            xs: false,
            sm: false,
            md: 8,
            lg: 8,
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: 38 }}
              color="textPrimary"
            >
              Mira los momentos cotidianos de tus
            </Typography>

            <Typography
              sx={{ fontWeight: "bold", fontSize: 38, textAlign: "center" }}
              color="textPrimary"
            >
              mejores amigos.
            </Typography>

            <img src={backgroundImage} className={classes.image} />
          </Box>
        </Grid>

        <Grid
          className={classes.content}
          size={{
            xs: 12,
            sm: 12,
            md: 4,
            lg: 4,
          }}
        >
          <Outlet />

          <Typography
            sx={{
              marginTop: "auto",
              textAlign: "end",
            }}
            variant="subtitle2"
            color="textDisabled"
          >
            © 2025 Desarrollos Dominguez Hernandez. Todos los derechos
            reservados.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainLayout;
