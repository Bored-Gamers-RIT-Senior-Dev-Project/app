import UploadIcon from "@mui/icons-material/CloudUpload";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Paper,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";

const University = () => {
    const [universityName, setUniversityName] = useState("University Name");
    const [summary, setSummary] = useState(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper adipiscing curae quisque vehicula eleifend lectus."
    );
    const [selectedTab, setSelectedTab] = useState(0);
    const [teams, setTeams] = useState([
        { id: 1, name: "Team 1", wins: 0, losses: 0 },
        { id: 2, name: "Team 2", wins: 0, losses: 1 },
        { id: 3, name: "Team 3", wins: 1, losses: 2 },
    ]);

    // Save university name (future API call)
    const handleSaveUniversityName = () => {
        console.log("Saved:", universityName);
    };

    // Handle removing a team
    const handleRemoveTeam = (id) => {
        setTeams(teams.filter((team) => team.id !== id));
    };

    return (
        <Box
            sx={{
                maxWidth: "750px",
                margin: "auto",
                padding: 4,
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                boxShadow: 3,
            }}
        >
            {/* University Name Editable */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <TextField
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    variant="outlined"
                    sx={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        flexGrow: 1,
                    }}
                />
                <Button
                    size="large"
                    onClick={handleSaveUniversityName}
                    sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        "&:hover": { backgroundColor: "#135ba1" },
                    }}
                >
                    SAVE
                </Button>
            </Box>

            {/* University Image Upload */}
            <Paper
                sx={{
                    padding: 3,
                    marginTop: 4,
                    borderRadius: "12px",
                    textAlign: "center",
                }}
            >
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<UploadIcon />}
                    sx={{
                        marginBottom: 2,
                        padding: "12px 24px",
                    }}
                >
                    UPLOAD UNIVERSITY IMAGE
                    <input type="file" hidden />
                </Button>
                <Box
                    sx={{
                        width: "100%",
                        height: "250px",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                    }}
                >
                    University Image Placeholder
                </Box>
            </Paper>
            {/* University Image Upload */}
            <Paper
                sx={{
                    padding: 3,
                    marginTop: 4,
                    borderRadius: "12px",
                    textAlign: "center",
                }}
            >
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<UploadIcon />}
                    sx={{
                        marginBottom: 2,
                        padding: "12px 24px",
                    }}
                >
                    UPLOAD UNIVERSITY IMAGE
                    <input type="file" hidden />
                </Button>
                <Box
                    sx={{
                        width: "100%",
                        height: "250px",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                    }}
                >
                    University Image Placeholder
                </Box>
            </Paper>

            {/* Editable Summary */}
            <TextField
                fullWidth
                multiline
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                label="University Summary"
                variant="outlined"
                sx={{
                    marginTop: 4,
                    backgroundColor: "white",
                    borderRadius: "5px",
                }}
            />

            {/* Tabs for Teams & Events */}
            <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginTop: 3,
                    boxShadow: 2,
                    padding: "10px 0",
                }}
            >
                <Tab label="TEAMS" />
                <Tab label="EVENTS" />
            </Tabs>

            {/* Team List (if Teams tab is selected) */}
            {selectedTab === 0 && (
                <Box sx={{ marginTop: 3 }}>
                    {teams.map((team) => (
                        <Card
                            key={team.id}
                            sx={{
                                marginBottom: 2,
                                borderRadius: "12px",
                                boxShadow: 3,
                                padding: "16px",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <CardContent>
                                <Grid container alignItems="center" spacing={2}>
                                    {/* Team Name & University */}
                                    <Grid item xs={5}>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            {team.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#666" }}
                                        >
                                            Rochester Institute of Technology
                                        </Typography>
                                    </Grid>

                                    {/* Win/Loss Stats */}
                                    <Grid item xs={4} textAlign="center">
                                        <Typography
                                            sx={{
                                                fontSize: "1.1em",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {team.wins}W | {team.losses}L
                                        </Typography>
                                    </Grid>

                                    {/* Dropdown Menu for Remove */}
                                    <Grid item xs={3} textAlign="right">
                                        <Select
                                            defaultValue=""
                                            onChange={(e) => {
                                                if (e.target.value === "remove")
                                                    handleRemoveTeam(team.id);
                                            }}
                                            sx={{
                                                backgroundColor: "white",
                                                minWidth: "120px",
                                                "& .MuiSelect-select": {
                                                    padding: "6px 12px",
                                                    textAlign: "right",
                                                },
                                            }}
                                        >
                                            <MenuItem value="">
                                                Options
                                            </MenuItem>
                                            <MenuItem
                                                value="remove"
                                                sx={{
                                                    color: "red",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Remove Team
                                            </MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Events Placeholder (future functionality) */}
            {selectedTab === 1 && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6">
                        Events will be displayed here...
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export { University };
