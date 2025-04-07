import { Box, Paper } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { pageWidth } from "../../utils/theme";
import { TeamList } from "./TeamList";
import { UniversityEditor } from "./UniversityEditor";
import { UniversityView } from "./UniversityView";

const UniversityPage = () => {
    const university = useLoaderData();
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);

    const isUniversityAdmin =
        user?.roleId == 8 && user?.universityId == university.universityId;

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
                    width: "100%",
                    height: "100%",
                    maxWidth: "1200px",
                    margin: "auto",
                    overflow: "hidden",
                }}
            >
                {editMode && isUniversityAdmin ? (
                    <UniversityEditor
                        universityName={university.universityName}
                        universityDescription={university.description}
                        universityLocation={university.location}
                        universityLogo={university.logoUrl}
                        universityBanner={university.bannerUrl}
                        exitEditMode={() => setEditMode(false)}
                    />
                ) : (
                    <UniversityView
                        showEditButton={isUniversityAdmin}
                        universityName={university.universityName}
                        universityDescription={university.description}
                        universityLocation={university.location}
                        universityLogo={university.logoUrl}
                        universityBanner={university.bannerUrl}
                        enterEditMode={() => setEditMode(true)}
                    />
                )}
                <TeamList teams={university.teams} />
            </Paper>
        </Box>
    );
};

export { UniversityPage };
