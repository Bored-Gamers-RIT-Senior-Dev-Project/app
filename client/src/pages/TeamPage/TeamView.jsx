import { Edit as EditIcon } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";

const TeamView = ({ teamName, teamSummary, teamImage, enterEditMode }) => {
    return (
        <Box>
            <Avatar
                src={teamImage}
                alt={teamName}
                sx={{ height: "5em", width: "5em" }}
            />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >
                <Typography variant="h4">{teamName}</Typography>
                <IconButton onClick={enterEditMode}>
                    <EditIcon sx={{ color: "blue" }} />
                </IconButton>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">{teamSummary}</Typography>
            </Box>
        </Box>
    );
};

//Credit for proptypes: Copilot generation
TeamView.propTypes = {
    teamName: PropTypes.string.isRequired,
    teamImage: PropTypes.string.isRequired,
    teamSummary: PropTypes.string.isRequired,
    enterEditMode: PropTypes.func.isRequired,
};

export { TeamView };
