import { Box, LinearProgress } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";
import ProgressBarWithLabel from "./ProgressBarWithLabel";
import { type Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    background:
      theme?.palette?.mode === "light"
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(255, 255, 255, 0.07)",
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    zIndex: "100",
  },
  linearProgressStyled: {
    color: "red",
  },
}));

const LoadingForms = ({ value = null }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {value ? (
        <ProgressBarWithLabel value={value} />
      ) : (
        <LinearProgress color="info" />
      )}
    </Box>
  );
};

export default LoadingForms;

LoadingForms.propTypes = {
  value: PropTypes.string,
};
