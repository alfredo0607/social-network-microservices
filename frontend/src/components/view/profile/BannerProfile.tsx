import { Box } from "@mui/material";

export default function BannerProfile() {
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Box
          sx={{
            height: 200,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            px: 4,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "4px solid",
                borderColor: "primary.dark",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
              }}
            >
              <svg width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="35"
                  ry="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="35"
                  ry="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  transform="rotate(60 50 50)"
                />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="35"
                  ry="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  transform="rotate(120 50 50)"
                />
              </svg>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: "50%",
            transform: "translateX(50%)",
            width: 40,
            height: 20,
            clipPath: "polygon(50% 100%, 0 0, 100% 0)",
          }}
        />
      </Box>
    </>
  );
}
