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
import { useMemo, useState } from "react";
import { usePostSubmit } from "../../hooks/usePostSubmit";

const UniversityEditor = ({
    universityName,
    universityDescription,
    universityBanner,
    universityLogo,
    universityLocation,
    exitEditMode,
}) => {
    const [logoImage, setLogoImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [name, setName] = useState(null);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState(null);
    const submit = usePostSubmit();

    const bannerUrl = useMemo(
        () =>
            bannerImage ? URL.createObjectURL(bannerImage) : universityBanner,
        [bannerImage, universityBanner]
    );
    const logoUrl = useMemo(
        () => (logoImage ? URL.createObjectURL(logoImage) : universityLogo),
        [logoImage, universityLogo]
    );

    const handleSave = () => {
        if (description || name || logoImage || bannerImage) {
            const formData = new FormData();
            if (name) formData.append("universityName", name);
            if (description) formData.append("description", description);
            if (logoImage) formData.append("logoImage", logoImage);
            if (bannerImage) formData.append("bannerImage", bannerImage);

            submit(formData, { encType: "multipart/form-data" });
        }
        exitEditMode();
    };

    return (
        <Box>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: "12em",
                    background: "lightgray",
                    backgroundImage: `url(${bannerUrl ?? universityBanner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: 1,
                }}
            >
                <Button
                    component="label"
                    variant="contained"
                    size="small"
                    startIcon={<UploadIcon />}
                    sx={{ position: "absolute", right: "1em", bottom: "1em" }}
                >
                    Upload
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setBannerImage(e.target.files[0])}
                    />
                </Button>
            </Box>
            <Box
                sx={{
                    padding: { xs: 2, md: 4 },
                    boxSizing: "border-box",
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
                        src={logoUrl ?? universityLogo}
                        alt={name ?? universityName}
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
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setLogoImage(e.target.files[0])}
                        />
                    </Button>
                </Box>
                <Typography variant="h4" sx={{ width: "100%" }}>
                    <TextField
                        value={name ?? universityName}
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
                <Typography variant="h5" sx={{ width: "100%" }}>
                    <TextField
                        label="Location"
                        value={location ?? universityLocation}
                        onChange={(e) => setLocation(e.target.value)}
                        variant="outlined"
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
                    value={description ?? universityDescription}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                />
            </Box>
        </Box>
    );
};

//Credit for proptypes: Copilot generation
UniversityEditor.propTypes = {
    universityName: PropTypes.string.isRequired,
    universityBanner: PropTypes.string.isRequired,
    universityLogo: PropTypes.string.isRequired,
    universityLocation: PropTypes.string.isRequired,
    universityDescription: PropTypes.string.isRequired,
    exitEditMode: PropTypes.func.isRequired,
};

export { UniversityEditor };
