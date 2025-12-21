/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, Divider as MuiDivider } from "@mui/material";
import { forwardRef, type ReactNode, type HTMLAttributes } from "react";

interface DividerWithTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sx?: any;
  spacing: number;
}

const DividerWithText = forwardRef<HTMLDivElement, DividerWithTextProps>(
  ({ children, ...props }, ref) => (
    <Grid
      container
      alignItems="center"
      textAlign={"center"}
      ref={ref}
      {...props}
      sx={[
        { alignItems: "center" },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Grid size={12} mt={1}>
        <MuiDivider />
      </Grid>

      <Grid size={12}>{children}</Grid>

      <Grid size={12} mb={1}>
        <MuiDivider />
      </Grid>
    </Grid>
  )
);

DividerWithText.displayName = "DividerWithText";

export default DividerWithText;
