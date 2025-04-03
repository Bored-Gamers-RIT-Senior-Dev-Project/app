import { Box, Paper, Typography, Stack } from "@mui/material";
import { ImageHolder } from "../components/ImageHolder";
import setupimg from "../assets/rules/setup.jpg";  
import playingimg from "../assets/rules/playing.jpg"

const Rules = () => {
  return (
    <Box sx={{ padding: { xs: 3, md: 5 } }}> 
      <Paper
        component="div"
        sx={{
          padding: { xs: 3, md: 4 },
          maxWidth: "900px",
          margin: "auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: 4,
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: "800px", margin: "auto" }}>
          <Typography
            component="h1"
            sx={{
              fontSize: "2.5em",
              fontWeight: "bold",
              textAlign: "center",
              paddingBottom: "15px",
              color: "#333",
            }}
          >
            Rules
          </Typography>

          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.6em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Setting Up
            </Typography>
          </Box>
          <Box sx={{ padding: "5px 10px" }}>
            <ImageHolder
              src={setupimg}
              alt="Setup Guide"
              sx={{
                width: "100%",
                maxWidth: "650px",
                display: "block",
                margin: "auto",
                borderRadius: "10px",
                boxShadow: 2,
              }}
            />
          </Box>
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Odor amet, consectetur adipiscing elit. Ullamcorper adipiscing curae
              quisque vehicula eleifend lectus lectus. Aliquet erat gravida fringilla
              scelerisque aliquet id. Porta tortor praesent tortor semper vehicula elementum
              cursus euismod.
            </Typography>
          </Box>

          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.6em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Playing the Game
            </Typography>
          </Box>
          <Box sx={{ padding: "5px 10px" }}>
            <ImageHolder
              src={playingimg}
              alt="Gameplay"
              sx={{
                width: "100%",
                maxWidth: "650px",
                display: "block",
                margin: "auto",
                borderRadius: "10px",
                boxShadow: 2,
              }}
            />
          </Box>
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Odor amet, consectetur adipiscing elit. Ullamcorper adipiscing curae
              quisque vehicula eleifend lectus lectus. Aliquet erat gravida fringilla
              scelerisque aliquet id. Porta tortor praesent tortor semper vehicula elementum
              cursus euismod.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export { Rules };