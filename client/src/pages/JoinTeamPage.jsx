import { Box, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { TeamList } from "../components/TeamList";
import { UniversitySelect } from "../components/UniversitySelect";

const JoinTeamPage = () => {
    const [selectedUniversity, selectUniversity] = useState(null);
    const [universities, teams] = useLoaderData();

    return (
        <Box
            sx={{
                width: {
                    xs: "90vw",
                    md: "800px",
                },
            }}
        >
            <Paper sx={{ p: 2, m: 2 }}>
                <Typography variant="h3" textAlign="center">
                    Join the Competition
                </Typography>
                <Typography variant="h6" textAlign="center">
                    Select Your College to View Available Teams
                </Typography>
                <Grid container spacing={1}>
                    <Grid size={12}>
                        <Box sx={{ maxWidth: "700px", margin: "auto" }}>
                            <UniversitySelect
                                universities={universities}
                                label="Select your College"
                                onChange={(_, newValue) =>
                                    newValue && selectUniversity(newValue.id)
                                }
                                onEmptied={() => selectUniversity(null)}
                            />
                        </Box>
                    </Grid>
                    <Grid size={12}></Grid>
                </Grid>
            </Paper>
            {selectedUniversity && (
                <TeamList university={selectedUniversity} teams={teams} />
            )}
        </Box>
    );
};

export { JoinTeamPage };
