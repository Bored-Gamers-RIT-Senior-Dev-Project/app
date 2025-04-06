import { Save as SaveIcon, Upload as UploadIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { usePostSubmit } from "../../hooks/usePostSubmit";

const UniversityEditor = ({
    teamName,
    teamSummary,
    teamImage,
    exitEditMode,
}) => {
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
                    src={imageUrl ?? teamImage}
                    alt={name ?? teamName}
                    sx={{ height: "7em", width: "7em" }}
                />
                <Button
                    component="label"
                    variant="contained"
                    size="small"
                    startIcon={<UploadIcon />}
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        minWidth: "100%",
                    }}
                >
                    Upload
                    <input type="file" hidden />
                </Button>
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
UniversityEditor.propTypes = {
    teamName: PropTypes.string.isRequired,
    teamImage: PropTypes.string.isRequired,
    teamSummary: PropTypes.string.isRequired,
    exitEditMode: PropTypes.func.isRequired,
};

export { UniversityEditor };
