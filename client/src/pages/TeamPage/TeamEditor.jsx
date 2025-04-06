import { Save as SaveIcon, Upload as UploadIcon } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { usePostSubmit } from "../../hooks/usePostSubmit";

const TeamEditor = ({ teamName, teamSummary, teamImage, exitEditMode }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const submit = usePostSubmit();

    const handleSave = () => {
        if (description || name || imageUrl) {
            submit({ teamName: name, description, profileImageUrl: imageUrl });
        }
        exitEditMode();
    };

    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ mb: 2 }}
            >
                <Avatar
                    src={imageUrl ?? teamImage}
                    alt={name ?? teamName}
                    sx={{ height: "5em", width: "5em", margin: "auto" }}
                />
                <Button
                    component="label"
                    variant="contained"
                    size="small"
                    startIcon={<UploadIcon />}
                >
                    Update Team Image
                    <input type="file" hidden />
                </Button>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >
                <TextField
                    value={name ?? teamName}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    autoFocus
                    fullWidth
                />
                <IconButton onClick={handleSave}>
                    <SaveIcon sx={{ color: "blue" }} />
                </IconButton>
            </Box>

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={description ?? teamSummary}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                />
            </Box>
        </Box>
    );
};

//Credit for proptypes: Copilot generation
TeamEditor.propTypes = {
    teamName: PropTypes.string.isRequired,
    teamImage: PropTypes.string.isRequired,
    teamSummary: PropTypes.string.isRequired,
    exitEditMode: PropTypes.func.isRequired,
};

export { TeamEditor };
