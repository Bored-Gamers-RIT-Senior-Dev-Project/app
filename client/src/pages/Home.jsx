import { Box, Typography } from "@mui/material";
import { ImageHolder } from "../components/ImageHolder";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ImageHolder src="https://placehold.co/600x400" />
      <Typography component="h2" sx={{ fontSize: "1.5em", sm: {} }}>
        Introducing Aardvark&apos;s newest board game, A New World, with a
        global collegiate competition!
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <ImageHolder src="https://placehold.co/600x400" />
        <ImageHolder src="https://placehold.co/600x400" />
      </Box>
      <Typography component="h3" sx={{ fontSize: "1.25em" }}>
        Can your University&apos;s team bring home the prize?
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <ImageHolder src="https://placehold.co/600x400" />
        <ImageHolder src="https://placehold.co/600x400" />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <ImageHolder src="https://placehold.co/600x400" />
        <ImageHolder src="https://placehold.co/600x400" />
      </Box>
    </Box>
  );
};

export { Home };
