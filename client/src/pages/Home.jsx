import { Grid2 as Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import image3 from "../assets/art/game_board_undersea.jpg";
import image1 from "../assets/art/game_pieces_on_desert_board.jpg";
import image2 from "../assets/art/students_playing.png";
import { ImageButton } from "../components/ImageButton";
import { ImageHolder } from "../components/ImageHolder";
import rulesimg from "../assets/home/Rules.webp";
import teamsimg from "../assets/home/teams.jpg";
import mapimg from "../assets/home/map.jpg";
import gamenightimg from "../assets/home/game_night.jpeg";    


const Home = () => {
    const navigate = useNavigate();
    return (
        <Paper component="div" sx={{ padding: { xs: 1, md: 3 } }}>
            <Grid
                container
                spacing={1}
                sx={{ maxWidth: "800px", margin: "auto" }}
            >
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
                        Introducing Aardvark&apos;s newest board game, A New
                        World, with a global collegiate competition!
                    </Typography>
                </Grid>
                <Grid size={6}>
                    <ImageHolder src={mapimg}/>
                </Grid>
                <Grid size={6}>
                    <ImageHolder 
                        src={gamenightimg} 
                        sx={{
                            height: 268, // or 280 for a touch more
                            width: "100%",
                            objectFit: "cover",
                        }}
                    />
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
                    <ImageButton
                        src={image2}
                        text="Tournament Schedule"
                        onClick={() => navigate("/schedule")}
                    />
                </Grid>
                <Grid size={6}>
                    <ImageButton
                        src={image3}
                        text="About 'A New World'"
                        onClick={() => navigate("/about")}
                    />
                </Grid>
                <Grid size={6}>
                    <ImageButton
                        src={rulesimg}
                        text="Learn the Rules"
                        onClick={() => navigate("/rules")}
                    />
                </Grid>
                <Grid size={6}>
                    <ImageButton
                        src={teamsimg}
                        text="Find a Team"
                        onClick={() => navigate("/search")}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export { Home };
