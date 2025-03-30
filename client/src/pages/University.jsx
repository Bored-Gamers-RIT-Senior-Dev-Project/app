import UploadIcon from "@mui/icons-material/CloudUpload";
import {
    Box,
    Button,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { InfoElement } from "../components/InfoElement";

/**
 * The University page component.
 * @returns {JSX.Element} University Page
 */
const University = () => {
    const university = useLoaderData();
    const [universityData, setUniversityData] = useState(university);
    const [selectedTab, setSelectedTab] = useState(0);

    /**
     * Handles the save action for the university name.
     */
    const handleSaveUniversityName = () => {
        console.log("Saved:", universityData);
    };

    /**
     * Handles how components process form changes
     * @param {string} key The key of the universityData object to update.
     * @param {*} value The value to set for the specified key.
     */
    const handleFormChange = (key, value) => {
        setUniversityData((current) => ({ ...current, [key]: value }));
    };

    return (
        <Paper
            sx={{
                width: { sm: "95vw", md: "800px" },
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
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
                    value={universityData.universityName}
                    onChange={(e) =>
                        handleFormChange("universityName", e.target.value)
                    }
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

            {/* Editable Summary */}
            <TextField
                fullWidth
                multiline
                rows={4}
                value={universityData.description}
                onChange={(e) =>
                    handleFormChange("description", e.target.value)
                }
                label="University Summary"
                variant="outlined"
                sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                }}
            />

            {/* Tabs for Teams & Events */}
            <Paper>
                <Tabs
                    value={selectedTab}
                    onChange={(e, newValue) => setSelectedTab(newValue)}
                >
                    <Tab label="Teams" />
                    <Tab label="Events" />
                </Tabs>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        padding: 1,
                    }}
                >
                    {/* Team List (if Teams tab is selected) */}
                    {selectedTab === 0 ? (
                        universityData.teams.map((team) => (
                            <InfoElement
                                key={team.id}
                                imageUrl={team.profileImageUrl}
                                title={team.teamName}
                                text={team.description}
                            />
                        ))
                    ) : (
                        /* Events Placeholder (future functionality) */
                        <Box sx={{ padding: 1 }}>
                            <Typography variant="h6">
                                Events will be displayed here...
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Paper>
    );
};

export { University };
