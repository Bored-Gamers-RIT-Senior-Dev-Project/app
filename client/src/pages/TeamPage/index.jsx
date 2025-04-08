import { useState } from "react";
import { useLoaderData } from "react-router";
import { TeamEditor } from "./TeamEditor";
import { TeamView } from "./TeamView";

import { Alert, Box, Paper } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { pageWidth } from "../../utils/theme";
import { MemberList } from "./MemberList";

const TeamPage = () => {
    const team = useLoaderData();
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);

    const isCaptain = user?.userId == team.captainId;

    return (
        <Box
            sx={{
                width: pageWidth,
                display: "flex",
                justifyContent: "center",
                padding: { xs: 2, md: 4 },
            }}
        >
            <Paper
                sx={{
                    padding: { xs: 2, md: 4 },
                    width: "100%",
                    height: "100%",
                    maxWidth: "1200px",
                    margin: "auto",
                }}
            >
                {!team.isApproved && (
                    <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        This team has not been approved by a university
                        representative. It will not be publicly visible until it
                        is reviewed and approved.
                    </Alert>
                )}
                {team.pendingChanges && (
                    <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        This team has pending changes. Changes will not be
                        visible to the public until they are reviewed and
                        approved by a university representative.
                    </Alert>
                )}
                {editMode && isCaptain ? (
                    <TeamEditor
                        teamName={
                            team.pendingChanges?.teamName ?? team.teamName
                        }
                        teamSummary={
                            team.pendingChanges?.description ?? team.description
                        }
                        teamImage={
                            team.pendingChanges?.profileImageUrl ??
                            team.profileImageUrl
                        }
                        exitEditMode={() => setEditMode(false)}
                    />
                ) : (
                    <TeamView
                        showEditButton={isCaptain}
                        teamName={team.teamName}
                        teamSummary={team.description}
                        teamImage={team.profileImageUrl}
                        enterEditMode={() => setEditMode(true)}
                    />
                )}
                <MemberList
                    members={team.members}
                    captainId={team.captainId}
                    currentUserId={user?.userId}
                />
            </Paper>
        </Box>
    );
};

export { TeamPage };
