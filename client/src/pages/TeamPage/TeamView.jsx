import { Edit as EditIcon } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";

const TeamView = ({
    showEditButton,
    teamName,
    teamSummary,
    teamImage,
    enterEditMode,
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 1,
            }}
        >
            {showEditButton && (
                <IconButton
                    onClick={enterEditMode}
                    sx={{
                        position: "absolute",
                        right: 0,
                    }}
                >
                    <EditIcon sx={{ color: "blue" }} />
                </IconButton>
            )}
            <Avatar
                src={teamImage}
                alt={teamName}
                sx={{ height: "7em", width: "7em" }}
            />
            <Typography variant="h4">{teamName}</Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">{teamSummary}</Typography>
            </Box>
        </Box>
    );
};

//Credit for proptypes: Copilot generation
TeamView.propTypes = {
    showEditButton: PropTypes.bool.isRequired,
    teamName: PropTypes.string.isRequired,
    teamImage: PropTypes.string.isRequired,
    teamSummary: PropTypes.string.isRequired,
    enterEditMode: PropTypes.func.isRequired,
};

export { TeamView };
