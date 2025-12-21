import { alpha, Box, CssBaseline, Grid, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "./Header/TopBar";

export default function DashboardLayout() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", backgroundColor: "red" }}>
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <TopBar />
          <Stack
            spacing={2}
            sx={{
              mx: 2,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Grid
              container
              spacing={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Grid size={10}>
                <Outlet />
              </Grid>
            </Grid>

            {/* <MainGrid /> */}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
