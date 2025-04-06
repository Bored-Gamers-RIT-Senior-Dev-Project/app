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

const Schedule = () => {
    const [matches, setMatches] = useState([
        {
            id: 1,
            team1: "Team 1",
            team2: "Team 2",
            dateTime: "Feb 10, 2025 - 3:00 PM",
            location: "Stadium A",
            score: "2/1",
            winner: "Team 2",
        },
        {
            id: 2,
            team1: "Team 1",
            team2: "Team 3",
            dateTime: "Feb 12, 2025 - 4:30 PM",
            location: "Stadium B",
            score: "-",
            winner: "Pending",
        },
        {
            id: 3,
            team1: "Team 2",
            team2: "Team 3",
            dateTime: "Feb 15, 2025 - 6:00 PM",
            location: "Stadium C",
            score: "-",
            winner: "Pending",
        },
    ]);

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
                                {match.score !== "-" ? (
                                    <Typography variant="body1">
                                        Final Score: {match.score} <br />
                                        Winner: {match.winner}
                                    </Typography>
                                ) : (
                                    <Button variant="contained" size="small">
                                        Update Scores
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export { Schedule };
