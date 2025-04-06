import {
    Avatar,
    Box,
    Button,
    Card,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ImageUploader } from "../components/ImageUploader";
import { PasswordStrength } from "../components/PasswordStrength";
import { useAuth } from "../hooks/useAuth/index";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { changePassword } from "../utils/firebase/auth";

const universityList = [
    "Rochester Institute of Technology",
    "Harvard University",
    "MIT",
    "Stanford University",
];

const UserSettings = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); //React router useNavigate hook
    const [imageUrl, setImageUrl] = useState("");
    const [image, setImage] = useState(null); // State to hold the uploaded image

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (user === null) {
            //User is 'undefined' before Firebase inits, 'null' if user is not logged in.
            navigate("/signin");
        }
        user && setImageUrl(user.profileImageUrl);
    }, [user, navigate]);
    useEffect(() => {
        if (image) {
            setImageUrl(URL.createObjectURL(image)); // Create a URL for the uploaded image
        }
    }, [image]);

    const submit = usePostSubmit();

    const handleUserSettingsSubmit = async (e) => {
        e.preventDefault();
        // TODO: Finish this function
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        changePassword(currentPassword, newPassword);
    };

    if (!user) {
        console.error(`UserSettings: user is ${user}!`);
        return <Box></Box>;
    }
    const emailEncoded = encodeURI(user.email);

    return (
        <Paper
            sx={{
                padding: 3,
                maxWidth: 800,
                margin: "auto",
                display: "flex",
                alignContent: "center",
                flexDirection: "column",
                gap: 1,
            }}
        >
            <Typography variant="h4" textAlign="center">
                User Settings
            </Typography>
            <Avatar
                src={imageUrl}
                alt={user?.displayName}
                sx={{ height: "7em", width: "7em", margin: "auto" }}
            />
            {/* Profile Picture Upload */}

            <ImageUploader
                label="Upload Profile Picture"
                onUpload={(image) => setImage(image)}
            />

            {/* Change Password */}
            <Card
                component="form"
                variant="outlined"
                onSubmit={handleChangePassword}
                sx={{ padding: 1 }}
            >
                <Typography variant="h6">Change Password</Typography>
                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                />
                {/* Save Changes Button */}
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Change Password
                </Button>
                {newPassword.length > 0 && (
                    <PasswordStrength password={newPassword} />
                )}
            </Card>

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
        </Paper>
    );
};

export { UserSettings };
// code formatted and comments added using chatgpt
