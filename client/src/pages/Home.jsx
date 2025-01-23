import { Box, Typography } from "@mui/material";
import { ImageHolder } from "../components/ImageHolder";

const Home = () => {
  return (
    <Box>
      <ImageHolder src="https://placehold.co/600x400" />
      <Typography variant="h1">
        Introducing Aardvark’s newest board game, A New World, with a global
        collegiate competition!
      </Typography>
    </Box>
  );
};

export { Home };
