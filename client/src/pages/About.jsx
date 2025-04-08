import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    IconButton,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ChroniclerImg from "../assets/about/Chronicler.avif";
import expeditionLeaderImg from "../assets/about/expedition_leader.jpg";
import GameIllustrationImg from "../assets/about/main.jpg";
import PhysicianImg from "../assets/about/Physician.avif";
import ResourceSpecialistImg from "../assets/about/Resource_specialist.jpeg";
import ScientistImg from "../assets/about/Scientist.jpg";
import TechnicianImg from "../assets/about/Technician.jpg";
import WeaponsSpecialistImg from "../assets/about/Weapons_specialist.jpg";

const playerRoles = [
    {
        title: "Expedition Leader:",
        description:
            "This team member will make decisions on when and how action cards are played. They facilitate the team’s joint strategic planning and manage the expedition budget.",
        image: expeditionLeaderImg,
    },
    {
        title: "Resource Specialist",
        description:
            "This team member is responsible for obtaining the resources required for survival on arrival and the establishment of a base on the new world. ",
        image: ResourceSpecialistImg,
    },
    {
        title: "Scientist:",
        description:
            "This team member collects knowledge cards that allow the team an advantage in knowing how to overcome obstacles and which actions are most likely to succeed. ",
        image: ScientistImg,
    },
    {
        title: "Technician:",
        description:
            "This team member uses tool and technology cards to create the team base and repair machines and weapons as needed. ",
        image: TechnicianImg,
    },
    {
        title: "Chronicler:",
        description:
            "This team member is responsible for all communications with Home Base, for researching historic data cards that may aid the quest and for creating a chronicle of the current expedition.",
        image: ChroniclerImg,
    },
    {
        title: "Weapons Specialist:",
        description:
            "This team member leads the team defense strategies and works to gain points to raise each team member’s skill level on the weapon classes best suited to the current habitat.",
        image: WeaponsSpecialistImg,
    },
    {
        title: "Physician:",
        description:
            " This team member is responsible for the physical and mental health of expedition members, treating injuries and illness when determined by cards for encounters with native wildlife, hostile forces, space adaptation syndrome, etc.",
        image: PhysicianImg,
    },
];

const About = () => {
    const [currentRole, setCurrentRole] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);

    const nextRole = () => {
        setCurrentRole((prev) => (prev + 1) % playerRoles.length);
    };

    const prevRole = () => {
        setCurrentRole(
            (prev) => (prev - 1 + playerRoles.length) % playerRoles.length
        );
    };

    useEffect(() => {
        const interval = setInterval(nextRole, 4000);
        return () => clearInterval(interval);
    }, []);

    const handlePreOrderSubmit = () => {
        console.log("Pre-Order Email:", email);
        console.log("Marketing Consent:", consent);
        setOpenModal(false);
        setEmail("");
        setConsent(false);
    };

    return (
        <Box
            sx={{
                maxWidth: "900px",
                margin: "auto",
                padding: 3,
                minHeight: "100vh",
                overflowY: "auto",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 2,
                }}
            >
                A New World
            </Typography>

            <Paper
                sx={{
                    textAlign: "center",
                    padding: 3,
                    marginBottom: 3,
                    marginTop: 4,
                    backgroundColor: "#f0f0f0",
                    borderRadius: "10px",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: "1.2em", padding: "10px 20px" }}
                    onClick={() => setOpenModal(true)}
                >
                    PRE-ORDER NOW!
                </Button>
            </Paper>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: 4,
                        borderRadius: "10px",
                        boxShadow: 3,
                        width: "80%",
                        maxWidth: "400px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Pre-Order Interest
                        </Typography>
                        <IconButton onClick={() => setOpenModal(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                    <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                            />
                        }
                        label="I agree to let Aardvark Games send me marketing material"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        onClick={handlePreOrderSubmit}
                    >
                        Send
                    </Button>
                </Box>
            </Modal>
            <Paper
                sx={{
                    padding: 3,
                    borderRadius: "10px",
                    marginBottom: 3,
                    marginTop: 4,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginBottom: 2 }}
                >
                    About the Game
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column-reverse", sm: "row" },
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <img
                            src={GameIllustrationImg}
                            alt="Game Illustration"
                            style={{
                                width: "100%",
                                borderRadius: "10px",
                                height: "auto",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ lineHeight: 1.7, fontSize: "1rem" }}>
                            A New World requires a team of 4-7 players who will
                            work together to score as many points as possible
                            after being dropped into a new, unpopulated world.
                            <br />
                            The habitats will vary and the team will not know in
                            advance where they will land.
                            <br />
                            <br />
                            Environments could be a desert planet, an underwater
                            location, a water world with scattered islands, an
                            ice-covered mountain range, or a jungle full of
                            predatory animals and dangerous plant life.
                            <br />
                            <br />
                            <b>
                                (Advance News! Expansion Pack 1 is in the design
                                phase with additional worlds and resources!)
                            </b>
                            <br />
                            <br />
                            The game is best played in a head-to-head
                            competition with a second team seeking to survive in
                            its own New World but competing for the same
                            resources.
                            <br />
                            However, with the modifications described for solo
                            team play, it is possible to enjoy striving to beat
                            your own prior scores.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper
                sx={{
                    padding: 3,
                    borderRadius: "10px",
                    marginBottom: 3,
                    marginTop: 4,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginBottom: 2 }}
                >
                    Player Roles
                </Typography>
                <Typography sx={{ lineHeight: 1.7, fontSize: "1rem" }}>
                    Every team must designate the roles for each player prior to
                    beginning play. If a team has fewer than seven players, team
                    members may assume more than one role.
                </Typography>

                <Card
                    sx={{
                        position: "relative",
                        textAlign: "center",
                        padding: 2,
                        borderRadius: "10px",
                        boxShadow: 3,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <IconButton
                        onClick={prevRole}
                        sx={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <img
                        src={playerRoles[currentRole].image}
                        alt={playerRoles[currentRole].title}
                        style={{ width: "100%", borderRadius: "10px" }}
                    />
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {playerRoles[currentRole].title}
                        </Typography>
                        <Typography sx={{ marginTop: 1 }}>
                            {playerRoles[currentRole].description}
                        </Typography>
                    </CardContent>
                    <IconButton
                        onClick={nextRole}
                        sx={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        <ArrowForward />
                    </IconButton>
                </Card>
            </Paper>
        </Box>
    );
};

export { About };
