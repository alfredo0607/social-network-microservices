import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const ProgressBarWithLabel = (props: { value: number }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          mr: 1,
        }}
      >
        <LinearProgress variant="determinate" {...props} color="secondary" />
      </Box>
      <Box
        sx={{
          minWidth: 35,
        }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
        >{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
};

export default ProgressBarWithLabel;

ProgressBarWithLabel.propTypes = {
  value: PropTypes.string,
};
