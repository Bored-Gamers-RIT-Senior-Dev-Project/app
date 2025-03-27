import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Button,
    FormControl,
    FormLabel,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth/index";

const universityList = [
    "Rochester Institute of Technology",
    "Harvard University",
    "MIT",
    "Stanford University",
];

const UserSettings = () => {
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedTeamOption, setSelectedTeamOption] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState(null);

    const handleNotificationChange = (event) => {
        const value = event.target.name;
        setSelectedNotifications((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };
    const { user } = useAuth();
    const navigate = useNavigate(); //React router useNavigate hook
    useEffect(() => {
        if (user === null) {
            //User is 'undefined' before Firebase inits, 'null' if user is not logged in.
            navigate("/signin");
        }
    }, [user, navigate]);
    if (!user) {
        console.error(`UserSettings: user is ${user}!`);
        return;
    }

    const emailEncoded = encodeURI(user.email);

    return (
        <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
            <Typography variant="h4" textAlign="center">
                User Settings
            </Typography>

            {/* Profile Picture Upload */}
            <FormControl fullWidth sx={{ mt: 3 }}>
                <FormLabel>Profile Picture</FormLabel>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload / Drag & Drop
                    <input type="file" hidden />
                </Button>
            </FormControl>

            {/* Change Password */}
            <FormControl fullWidth sx={{ mt: 3 }}>
                <FormLabel>Change Password</FormLabel>
                <TextField label="Email" fullWidth margin="dense" />
                <TextField
                    label="Old Password"
                    type="password"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="dense"
                />
            </FormControl>

            {/* Payment Section (Placeholder) */}
            <Paper variant="outlined" sx={{ mt: 3, padding: 2 }}>
                <Typography variant="h6">Payment Portal</Typography>
                <Button
                    href={`https://buy.stripe.com/test_8wMaETffobOKgmc7ss?prefilled_email=${emailEncoded}`}
                    target="_blank"
                >
                    Click here to pay registration fee with Stripe
                </Button>
            </Paper>

            {/* Save Changes Button */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
            >
                Save Changes
            </Button>
        </Paper>
    );
};

export { UserSettings };
// code formatted and comments added using chatgpt
