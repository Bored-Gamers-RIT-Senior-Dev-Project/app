import { useState } from "react";
import {
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    Autocomplete,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const universityList = ["Rochester Institute of Technology", "Harvard University", "MIT", "Stanford University"];

const UserSettings = () => {
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedTeamOption, setSelectedTeamOption] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState(null);

    const handleNotificationChange = (event) => {
        const value = event.target.name;
        setSelectedNotifications((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    return (
        <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
            <Typography variant="h4" textAlign="center">User Settings</Typography>

            {/* Profile Picture Upload */}
            <FormControl fullWidth sx={{ mt: 3 }}>
                <FormLabel>Profile Picture</FormLabel>
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                    Upload / Drag & Drop
                    <input type="file" hidden />
                </Button>
            </FormControl>
        </Paper>
    );
};

export { UserSettings };
// code formatted and comments added using chatgpt