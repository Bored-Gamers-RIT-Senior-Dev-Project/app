import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";

const playerRoles = [
  {
    title: "PLACE HOLDER1",
    description: "YOOYOOYOYYOO",
    image: "https://placehold.co/600x300",
  },
  {
    title: "PLACE HOLDER2",
    description: "YOOOYOYO",
    image: "https://placehold.co/600x300",
  },
  {
    title: "PLACE HOLDER3",
    description: "YOOYOOYY",
    image: "https://placehold.co/600x300",
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
    setCurrentRole((prev) => (prev - 1 + playerRoles.length) % playerRoles.length);
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
    <Box sx={{ maxWidth: "900px", margin: "auto", padding: 3, minHeight: "100vh", overflowY: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
        A New World
      </Typography>

      <Paper sx={{ textAlign: "center", padding: 2, marginBottom: 3, backgroundColor: "#f0f0f0", borderRadius: "10px" }}>
        <Button variant="contained" color="primary" sx={{ fontSize: "1.2em", padding: "10px 20px" }} onClick={() => setOpenModal(true)}>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Pre-Order Interest
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <Close />
            </IconButton>
          </Box>
          <TextField fullWidth label="Email Address" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ marginBottom: 2 }} />
          <FormControlLabel control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />} label="I agree to let Aardvark Games send me marketing material" />
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handlePreOrderSubmit}>
            Send
          </Button>
        </Box>
      </Modal>

      <Paper sx={{ padding: 3, borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.85)", marginBottom: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          About the Game
        </Typography>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            <img src="https://placehold.co/600x300" alt="Game Illustration" style={{ width: "100%", borderRadius: "10px" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ textAlign: "justify", lineHeight: "1.5" }}>
              A New World requires a team of 4-7 players who will work together to score as many points as possible after being dropped into a new, unpopulated world. The habitats will vary, and the team will not know in advance where they will land.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ padding: 3, borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Player Roles
        </Typography>
        <Typography sx={{ textAlign: "justify", marginBottom: 2 }}>
          Every team must designate the roles for each player prior to beginning play. If a team has fewer than seven players, team members may assume more than one role.
        </Typography>

        <Card sx={{ position: "relative", textAlign: "center", padding: 2, borderRadius: "10px", boxShadow: 3, backgroundColor: "#ffffff" }}>
          <IconButton onClick={prevRole} sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <ArrowBack />
          </IconButton>
          <img src={playerRoles[currentRole].image} alt={playerRoles[currentRole].title} style={{ width: "100%", borderRadius: "10px" }} />
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {playerRoles[currentRole].title}
            </Typography>
            <Typography sx={{ textAlign: "justify", marginTop: 1 }}>{playerRoles[currentRole].description}</Typography>
          </CardContent>
          <IconButton onClick={nextRole} sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
            <ArrowForward />
          </IconButton>
        </Card>
      </Paper>
    </Box>
  );
};

export { About };
