import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    Modal,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";

const style = {
    // https://mui.com/material-ui/react-modal/
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const ScorePopup = (props) => {
    return (
        <Modal open={props.match !== null} onClose={props.handleClose}>
            {props.match ? (
                <Box sx={style}>
                    <Typography align="center" variant="h4">
                        Update Score
                    </Typography>
                    <Stack direction="row" alignItems="center">
                        <Box>
                            <Typography>{`${props.match.team1}`}</Typography>
                            <input type="number"></input>
                            <Button>Cancel</Button>
                        </Box>
                        <Box>
                            <Typography>{`${props.match.team2}`}</Typography>
                            <input type="number"></input>
                            <Button>Submit</Button>
                        </Box>
                    </Stack>
                </Box>
            ) : (
                <></>
            )}
        </Modal>
    );
};

const Schedule = () => {
    const [matches, setMatches] = useState([
        {
            id: 1,
            team1: "Team 1",
            team2: "Team 2",
            dateTime: "Feb 10, 2025 - 3:00 PM",
            location: "Stadium A",
            team1Score: 1,
            team2Score: 3,
        },
        {
            id: 2,
            team1: "Team 1",
            team2: "Team 3",
            dateTime: "Feb 12, 2025 - 4:30 PM",
            location: "Stadium B",
            team1Score: 0,
            team2Score: 0,
        },
        {
            id: 3,
            team1: "Team 2",
            team2: "Team 3",
            dateTime: "Feb 15, 2025 - 6:00 PM",
            location: "Stadium C",
            team1Score: 0,
            team2Score: 0,
        },
    ]);
    const [openScorePopup, setOpenScorePopup] = useState(null); // openScorePopup is the match or null

    /**
     * Open the ScorePopup
     */
    const handleOpen = (id) => setOpenScorePopup(id);

    /**
     * Close the ScorePopup
     */
    const handleClose = () => setOpenScorePopup(null);

    /**
     * Figure out who won a match
     * (hopefully no one names their team "Tie" - this is just for visual
     * purposes so nothing serious will break if they do)
     * @param {*} match the match data, with the keys team1, team2, team1Score,
     * and team2Score
     * @returns team1 if team1 won, team2 if team 2 won, or "Tie" if the scores
     * are equal
     */
    const winner = (match) => {
        if (match.team1Score > match.team2Score) {
            return match.team1;
        }
        if (match.team1Score < match.team2Score) {
            return match.team2;
        }
        return "Tie";
    };

    return (
        <>
            <Box sx={{ maxWidth: "900px", margin: "auto", padding: 2 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 3,
                    }}
                >
                    Schedule
                </Typography>

                <Paper
                    sx={{ padding: 3, marginBottom: 3, borderRadius: "10px" }}
                >
                    <Stack
                        spacing={2}
                        direction={{ xs: "column", sm: "row" }}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        <TextField
                            fullWidth
                            label="Team Name"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Team University"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Location"
                            variant="outlined"
                        />
                        <Select fullWidth defaultValue="">
                            <MenuItem value="">Sort By</MenuItem>
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="location">Location</MenuItem>
                        </Select>
                    </Stack>
                </Paper>

                <Stack spacing={2}>
                    {matches.map((match) => (
                        <Card
                            key={match.id}
                            sx={{ borderRadius: "10px", padding: 2 }}
                        >
                            <CardContent>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        {match.team1}
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        vs
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {match.team2}
                                    </Typography>
                                </Stack>

                                <Box textAlign="center" mt={1}>
                                    <Typography variant="body1">
                                        {match.dateTime}
                                    </Typography>
                                    <Typography variant="body1">
                                        {match.location}
                                    </Typography>
                                </Box>

                                <Box textAlign="center" mt={2}>
                                    <Typography variant="body1">
                                        Score: {match.team1Score}&ndash;
                                        {match.team2Score} <br />
                                        Winner: {winner(match)}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleOpen(match)}
                                    >
                                        Update Scores
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Box>
            <ScorePopup
                match={openScorePopup}
                handleClose={handleClose}
            ></ScorePopup>
        </>
    );
};

export { Schedule };
