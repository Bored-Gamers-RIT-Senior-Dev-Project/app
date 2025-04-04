import { useState } from "react";
import { useLoaderData } from "react-router";
import { TeamEditor } from "./TeamEditor";
import { TeamView } from "./TeamView";

import { Box, Paper } from "@mui/material";
import { MemberList } from "./MemberList";

const TeamPage = () => {
    const team = useLoaderData();
    const [editMode, setEditMode] = useState(false);

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: { xs: 2, md: 4 },
            }}
        >
            <Paper
                sx={{
                    padding: { xs: 2, md: 4 },
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "auto",
                }}
            >
                {editMode ? (
                    <TeamEditor
                        teamName={team.teamName}
                        teamDescription={team.summary}
                        exitEditMode={() => setEditMode(false)}
                    />
                ) : (
                    <TeamView
                        teamName={team.teamName}
                        teamSummary={team.description}
                        members={team.members}
                        enterEditMode={() => setEditMode(true)}
                    />
                )}
                <MemberList members={team.members} captainId={team.captainId} />
            </Paper>
        </Box>
    );
};

export { TeamPage };
