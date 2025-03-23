import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth/index";
import { usePostSubmit } from "../hooks/usePostSubmit";

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

    const submit = usePostSubmit();

    const handleUserSettingsSubmit = async (e) => {
        e.preventDefault();
        // TODO: Finish this function
    };

    return (
        <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
            <form onSubmit={handleUserSettingsSubmit}>
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
                        Upload
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

                {/* Notification Preferences */}
                <Paper variant="outlined" sx={{ mt: 3, padding: 2 }}>
                    <FormControl component="fieldset">
                        <FormLabel>Notification Preferences</FormLabel>
                        <FormGroup>
                            {[
                                "Marketing",
                                "Tournament News",
                                "University Updates",
                                "Team Updates",
                                "Event Reminders",
                            ].map((option) => (
                                <FormControlLabel
                                    key={option}
                                    control={
                                        <Checkbox
                                            checked={selectedNotifications.includes(
                                                option
                                            )}
                                            onChange={handleNotificationChange}
                                            name={option}
                                        />
                                    }
                                    label={option}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Paper>

                {/* Role Selection */}
                <Paper variant="outlined" sx={{ mt: 3, padding: 2 }}>
                    <FormControl component="fieldset">
                        <FormLabel>I want to:</FormLabel>
                        <RadioGroup
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <FormControlLabel
                                value="Follow"
                                control={<Radio />}
                                label="Follow the Tournament"
                            />
                            <FormControlLabel
                                value="Participate"
                                control={<Radio />}
                                label="Participate"
                            />
                            <FormControlLabel
                                value="Represent"
                                control={<Radio />}
                                label="Represent a University"
                            />
                        </RadioGroup>
                    </FormControl>
                </Paper>

                {/* University Selection */}
                <FormControl fullWidth sx={{ mt: 3 }}>
                    <FormLabel>University</FormLabel>
                    <Autocomplete
                        options={universityList}
                        value={selectedUniversity}
                        onChange={(event, newValue) =>
                            setSelectedUniversity(newValue)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select your University"
                            />
                        )}
                    />
                </FormControl>

                {/* Team Selection */}
                <Paper variant="outlined" sx={{ mt: 3, padding: 2 }}>
                    <FormControl component="fieldset">
                        <FormLabel>Team</FormLabel>
                        <RadioGroup
                            value={selectedTeamOption}
                            onChange={(e) =>
                                setSelectedTeamOption(e.target.value)
                            }
                        >
                            <FormControlLabel
                                value="Start"
                                control={<Radio />}
                                label="Start a New Team"
                            />
                            <FormControlLabel
                                value="Join"
                                control={<Radio />}
                                label="Join an Existing Team"
                            />
                            <FormControlLabel
                                value="Later"
                                control={<Radio />}
                                label="I'll do this later"
                            />
                        </RadioGroup>
                        {selectedTeamOption === "Join" ||
                        selectedTeamOption === "Start" ? (
                            <TextField
                                label="Enter Team Name"
                                fullWidth
                                margin="dense"
                                sx={{ mt: 2 }}
                            />
                        ) : null}
                    </FormControl>
                </Paper>

                {/* Payment Section (Placeholder) */}
                <Paper variant="outlined" sx={{ mt: 3, padding: 2 }}>
                    <Typography variant="h6">Payment Portal</Typography>
                    <Typography variant="body2">
                        (Payment integration will be added here.)
                    </Typography>
                </Paper>

                {/* Save Changes Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    type="submit"
                >
                    Save Changes
                </Button>
            </form>
        </Paper>
    );
};

export { UserSettings };
// code formatted and comments added using chatgpt
