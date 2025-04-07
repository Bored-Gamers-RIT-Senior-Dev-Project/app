import { Edit as EditIcon, Link } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";

const UniversityView = ({
    showEditButton,
    universityName,
    universityUrl,
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
                    backgroundSize: "cover",
                    backgroundPosition: "center",
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
                <a
                    href={universityUrl ? universityUrl : null}
                    style={{ color: "unset" }}
                >
                    <Typography variant="h4" sx={{ position: "relative" }}>
                        {universityName}
                        {universityUrl && (
                            <Link
                                sx={{
                                    position: "absolute",
                                    left: "101%",
                                    color: "blue",
                                    top: "10%",
                                    height: "80%",
                                }}
                            />
                        )}
                    </Typography>
                </a>
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
    universityUrl: PropTypes.string.isRequired,
    universityLogo: PropTypes.string.isRequired,
    universityLocation: PropTypes.string.isRequired,
    universityDescription: PropTypes.string.isRequired,
    enterEditMode: PropTypes.func.isRequired,
};

export { UniversityView };
