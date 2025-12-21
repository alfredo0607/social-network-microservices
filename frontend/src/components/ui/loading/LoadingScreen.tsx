import { type Theme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useLottie } from "lottie-react";
import PropTypes from "prop-types";

import animationData from "../../../assets/animation/Instagram Logo.json";

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    backgroundColor: theme.palette?.background.default,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  subContainer: {
    width: 250,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

function LoadingScreen({ text = "" }) {
  const classes = useStyles();

  const options = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className={classes.root}>
      <div className={classes.subContainer}>
        {View}

        <Typography
          variant="h5"
          color="textPrimary"
          fontWeight={"bold"}
          sx={{
            textAlign: "center",
          }}
        >
          Cargando {text && text}...
        </Typography>
      </div>
    </div>
  );
}

export default LoadingScreen;

LoadingScreen.propTypes = {
  text: PropTypes.string,
};
