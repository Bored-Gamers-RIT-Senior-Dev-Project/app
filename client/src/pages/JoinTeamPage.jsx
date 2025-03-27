import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useActionData, useLoaderData, useNavigate } from "react-router";
import { TeamList } from "../components/TeamList";
import { UniversitySelect } from "../components/UniversitySelect";
import { useAuth } from "../hooks/useAuth";

const JoinTeamPage = () => {
    const { user, forceRefresh } = useAuth(true);
    const [selectedUniversity, selectUniversity] = useState(null);
    const [universities, teams] = useLoaderData();
    const navigate = useNavigate();
    const actionData = useActionData();

    useEffect(() => {
        if (user?.teamId) {
            navigate(`/teams/${user?.teamId}`);
        } else if (user?.roleName !== "Spectator") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (actionData) {
            forceRefresh();
        }
    }, [actionData, forceRefresh]);

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
            </Paper>
            {selectedUniversity && (
                <TeamList university={selectedUniversity} teams={teams} />
            )}
        </Box>
    );
};

export { JoinTeamPage };
