import { Edit as EditIcon } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";

const UniversityView = ({
    showEditButton,
    universityName,
    universityDescription,
    universityBanner,
    universityLogo,
    universityLocation,
    enterEditMode,
}) => {
    return (
        <Box>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: "12em",
                    background: "lightgray",
                    backgroundImage: `url(${universityBanner})`,
                    padding: 1,
                }}
            />
            <Box
                sx={{
                    padding: { xs: 2, md: 4 },
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
                    src={universityLogo}
                    alt={universityName}
                    sx={{ height: "7em", width: "7em" }}
                />
                <Typography variant="h4">{universityName}</Typography>
                <Typography variant="h5">{universityLocation}</Typography>
                <Box sx={{ mb: 2 }}>
                    {universityDescription.split("\n").map((p, index) => (
                        <Typography
                            key={index}
                            variant="body1"
                            sx={{ minHeight: "1em" }}
                        >
                            {p}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

//Credit for proptypes: Copilot generation
UniversityView.propTypes = {
    showEditButton: PropTypes.bool.isRequired,
    universityName: PropTypes.string.isRequired,
    universityBanner: PropTypes.string.isRequired,
    universityLogo: PropTypes.string.isRequired,
    universityLocation: PropTypes.string.isRequired,
    universityDescription: PropTypes.string.isRequired,
    enterEditMode: PropTypes.func.isRequired,
};

export { UniversityView };
