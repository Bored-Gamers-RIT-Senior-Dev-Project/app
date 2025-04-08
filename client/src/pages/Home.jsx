import {
    Box,
    Button,
    ButtonBase,
    Grid2 as Grid,
    Paper,
    Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import image3 from "../assets/art/game_board_undersea.jpg";
import image1 from "../assets/art/game_pieces_on_desert_board.jpg";
import image2 from "../assets/art/students_playing.png";
import signUpNow from "../assets/calls/sign_up_now peach_burst.png";
import { ImageButton } from "../components/ImageButton";
import { ImageHolder } from "../components/ImageHolder";
import rulesimg from "../assets/home/Rules.webp";
import teamsimg from "../assets/home/teams.jpg";
import mapimg from "../assets/home/map.jpg";
import gamenightimg from "../assets/home/game_night.jpeg";    
import { useAuth } from "../hooks/useAuth";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <Paper
            component="div"
            sx={{
                padding: { xs: 1, md: 3 },
            }}
        >
            <Grid
                container
                spacing={1}
                sx={{ maxWidth: "800px", margin: "auto" }}
            >
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ position: "relative" }}>
                        <ImageHolder
                            src={image1}
                            sx={{
                                borderRadius: "20px",
                            }}
                        />
                        {!user && (
                            <Link to="/signup">
                                <ButtonBase
                                    sx={{
                                        //Css created w/ help from Copilot for positioning/sizing/animation
                                        position: "absolute",
                                        bottom: { xs: "-2.75em", md: "-4em" },
                                        left: { xs: "-6em", md: "-12em" },
                                        height: { xs: "15em", md: "20em" },
                                        width: { xs: "15em", md: "20em" },
                                        transition:
                                            "transform 0.3s ease-in-out",
                                        zIndex: 4,
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                            zIndex: 1,
                                            cursor: "pointer",
                                        },
                                        "&:active": {
                                            transform: "scale(0.9)",
                                            zIndex: 4,
                                        },
                                    }}
                                    disableRipple
                                    disableTouchRipple
                                >
                                    <Box
                                        component="img"
                                        src={signUpNow}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            filter: "drop-shadow(5px 5px 5px #222)",
                                        }}
                                    />
                                </ButtonBase>
                            </Link>
                        )}
                    </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: "1.75em",
                            textAlign: "center",
                            mx: "1.2em",
                        }}
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
                        sx={{ fontSize: "1.2em", textAlign: "center" }}
                    >
                        Can your University&apos;s team bring home the prize?
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ fontSize: "1.25em" }}
                        onClick={() =>
                            navigate("/signup", {
                                state: { redirect: "/join" },
                            })
                        }
                    >
                        Join the competition and find out!
                    </Button>
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
