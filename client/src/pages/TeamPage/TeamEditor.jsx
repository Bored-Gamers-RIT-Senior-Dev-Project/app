import { Save as SaveIcon } from "@mui/icons-material";
import { Avatar, Box, IconButton, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { ImageUploader } from "../../components/ImageUploader";
import { usePostSubmit } from "../../hooks/usePostSubmit";

const TeamEditor = ({ teamName, teamSummary, teamImage, exitEditMode }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);

    const imageUrl = useMemo(
        () => (image ? URL.createObjectURL(image) : teamImage),
        [image, teamImage]
    );

    const submit = usePostSubmit();

    const handleSave = () => {
        if (description || name || image) {
            submit(
                { teamName: name, description, image },
                { encType: "multipart/form-data" }
            );
        }
        exitEditMode();
    };

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                gap: 1,
            }}
        >
            <IconButton
                onClick={handleSave}
                sx={{ position: "absolute", right: 0 }}
            >
                <SaveIcon sx={{ color: "blue" }} />
            </IconButton>
            <Box sx={{ position: "relative" }}>
                <Avatar
                    src={imageUrl}
                    alt={name ?? teamName}
                    sx={{ height: "7em", width: "7em" }}
                />
                <ImageUploader
                    onUpload={(file) => setImage(file)}
                    label="Upload"
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        minWidth: "100%",
                    }}
                />
            </Box>
            <Typography variant="h4" sx={{ width: "100%" }}>
                <TextField
                    value={name ?? teamName}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    autoFocus
                    fullWidth
                    slotProps={{
                        htmlInput: {
                            sx: {
                                textAlign: "center",
                                padding: 0,
                            },
                        },
                        input: {
                            sx: {
                                fontSize: "inherit",
                                padding: 0,
                            },
                        },
                    }}
                    sx={{ textAlign: "center" }}
                />
            </Typography>
            <TextField
                fullWidth
                multiline
                minRows={3}
                value={description ?? teamSummary}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
            />
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
