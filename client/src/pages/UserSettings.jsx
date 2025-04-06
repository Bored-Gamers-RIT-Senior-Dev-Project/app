import {
    Avatar,
    Box,
    Button,
    FormControl,
    FormLabel,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ImageUploader } from "../components/ImageUploader";
import { useAuth } from "../hooks/useAuth/index";
import { usePostSubmit } from "../hooks/usePostSubmit";

const universityList = [
    "Rochester Institute of Technology",
    "Harvard University",
    "MIT",
    "Stanford University",
];

const UserSettings = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); //React router useNavigate hook
    const [imageUrl, setImageUrl] = useState(user?.profileImageURL);
    const [image, setImage] = useState(null); // State to hold the uploaded image
    useEffect(() => {
        if (user === null) {
            //User is 'undefined' before Firebase inits, 'null' if user is not logged in.
            navigate("/signin");
        }
        setImageUrl(user.profileImageUrl);
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

    if (!user) {
        console.error(`UserSettings: user is ${user}!`);
        return <Box></Box>;
    }
    const emailEncoded = encodeURI(user.email);

    return (
        <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
            <Avatar
                src={imageUrl}
                alt={user?.displayName}
                sx={{ height: "7em", width: "7em", margin: "auto" }}
            />

            <Box component="form" onSubmit={handleUserSettingsSubmit}>
                <Typography variant="h4" textAlign="center">
                    User Settings
                </Typography>

                {/* Profile Picture Upload */}
                <FormControl fullWidth sx={{ mt: 3 }}>
                    <ImageUploader
                        label="Upload Profile Picture"
                        onUpload={(image) => setImage(image)}
                    />
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
                    type="submit"
                >
                    Save Changes
                </Button>
            </Box>
        </Paper>
    );
};

export { UserSettings };
// code formatted and comments added using chatgpt
