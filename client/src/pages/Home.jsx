import { Grid2 as Grid, Paper, Typography } from "@mui/material";
import image1 from "../assets/art/game_pieces_on_desert_board.jpg";
import { ImageHolder } from "../components/ImageHolder";

const Home = () => {
  return (
    <Paper component="div" sx={{ padding: { xs: 1, md: 3 } }}>
      <Grid container spacing={1} sx={{ maxWidth: "800px", margin: "auto" }}>
        <Grid size={{ xs: 12 }}>
          <ImageHolder
            src={image1}
            sx={{
              borderRadius: "20px",
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography
            component="h2"
            sx={{ fontSize: "1.5em", textAlign: "center" }}
          >
            Introducing Aardvark&apos;s newest board game, A New World, with a
            global collegiate competition!
          </Typography>
        </Grid>
        <Grid size={6}>
          <ImageHolder src="https://placehold.co/600x400" />
        </Grid>
        <Grid size={6}>
          <ImageHolder src="https://placehold.co/600x400" />
        </Grid>
        <Grid size={12}>
          <Typography
            component="h3"
            sx={{ fontSize: "1.25em", textAlign: "center" }}
          >
            Can your University&apos;s team bring home the prize?
          </Typography>
        </Grid>
        <Grid size={6}>
          <ImageHolder src="https://placehold.co/600x400" />
        </Grid>
        <Grid size={6}>
          <ImageHolder src="https://placehold.co/600x400" />
        </Grid>
        <Grid size={6}>
          <ImageHolder src="https://placehold.co/600x400" />
        </Grid>
        <Grid size={6}>
          <ImageHolder src="https://placehold.co/600x400" />
        </Grid>
      </Grid>
    </Paper>
  );
};

export { Home };
