import { Box, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { TeamList } from "../components/TeamList";
import { UniversitySelect } from "../components/UniversitySelect";

const JoinTeamPage = () => {
    const [selectedUniversity, selectUniversity] = useState(null);
    const universities = useLoaderData();
    return (
        <Box
            sx={{
                width: {
                    xs: "90vw",
                    md: "800px",
                },
                p: 2,
            }}
        >
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h3" textAlign="center">
                    Join the Competition
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
                            />
                        </Box>
                    </Grid>
                    <Grid size={12}></Grid>
                </Grid>
            </Paper>
            <Box sx={{ margin: 2 }}>
                {selectedUniversity && (
                    <TeamList university={selectedUniversity} />
                )}
            </Box>
        </Box>
    );
};
export { JoinTeamPage };
