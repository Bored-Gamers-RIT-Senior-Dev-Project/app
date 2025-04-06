import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";

const ScorePopup = () => {};

const Schedule = () => {
    const [matches, setMatches] = useState([
        {
            id: 1,
            team1: "Team 1",
            team2: "Team 2",
            dateTime: "Feb 10, 2025 - 3:00 PM",
            location: "Stadium A",
            team1_score: 1,
            team2_score: 3,
        },
        {
            id: 2,
            team1: "Team 1",
            team2: "Team 3",
            dateTime: "Feb 12, 2025 - 4:30 PM",
            location: "Stadium B",
            team1_score: 0,
            team2_score: 0,
        },
        {
            id: 3,
            team1: "Team 2",
            team2: "Team 3",
            dateTime: "Feb 15, 2025 - 6:00 PM",
            location: "Stadium C",
            team1_score: 0,
            team2_score: 0,
        },
    ]);
    /**
     * Figure out who won a match
     * (hopefully no one names their team "Tie" - this is just for visual
     * purposes so nothing serious will break if they do)
     * @param {*} match the match data, with the keys team1, team2, team1_score,
     * and team2_score
     * @returns team1 if team1 won, team2 if team 2 won, or "Tie" if the scores
     * are equal
     */
    const winner = (match) => {
        if (match.team1_score > match.team2_score) {
            return match.team1;
        }
        if (match.team1_score < match.team2_score) {
            return match.team2;
        }
        return "Tie";
    };

    return (
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

            <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: "10px" }}>
                <Stack
                    spacing={2}
                    direction={{ xs: "column", sm: "row" }}
                    useFlexGap
                    flexWrap="wrap"
                >
                    <TextField fullWidth label="Team Name" variant="outlined" />
                    <TextField
                        fullWidth
                        label="Team University"
                        variant="outlined"
                    />
                    <TextField fullWidth label="Location" variant="outlined" />
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
                                    Score:{" "}
                                    {`${match.team1_score} : ${match.team2_score}`}{" "}
                                    <br />
                                    Winner: {winner(match)}
                                </Typography>
                                <Button variant="contained" size="small">
                                    Update Scores
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export { Schedule };
