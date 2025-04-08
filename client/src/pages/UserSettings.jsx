import {
    Avatar,
    Box,
    Button,
    Card,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ImageUploader } from "../components/ImageUploader";
import { useAuth } from "../hooks/useAuth/index";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { reauthenticate, updateCredentials } from "../utils/firebase/auth";

const UserSettings = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); //React router useNavigate hook
    const [error, setError] = useState("");
    const [userForm, setUserForm] = useState({
        username: "",
        bio: "",
        image: undefined,
        newPassword: "",
        currentPassword: "",
    });
    useEffect(() => {
        if (user === null) {
            //User is 'undefined' before Firebase inits, 'null' if user is not logged in.
            navigate("/signin");
        } else if (user) {
            setUserForm((current) => ({
                ...current,
                username: user.username,
                email: user.email,
                bio: user.bio ?? "",
            }));
        }
    }, [user, navigate]);

    const imageUrl = useMemo(() => {
        if (userForm.image) {
            return URL.createObjectURL(userForm.image); // Create a URL for the uploaded image
        }
        return user.profileImageUrl;
    }, [user.profileImageUrl, userForm.image]);

    const submit = usePostSubmit();

    const handleUserSettingsSubmit = async (e) => {
        e.preventDefault();
        setError("");

        //Create new formdata object
        const formData = new FormData();

        //email and password need to be handled by Firebase first and require re-authentication.
        if (userForm.newPassword) {
            if (!(await reauthenticate(userForm.currentPassword))) {
                return false;
            }

            updateCredentials(userForm.email, userForm.newPassword);
        }

        //Append relevant fields to the formdata
        ["username", "bio", "image"].forEach((key) => {
            if (userForm[key] && userForm[key] != user?.[key]) {
                formData.append(key, userForm[key]);
            }
        });

        //If the form was given any values, submit. (Otherwise the user is clicking 'submit' without making changes)
        if (Array.from(formData.keys()).length > 0) {
            formData.append("userId", user.userId);
            submit(formData, { encType: "multipart/form-data" }); //Submitting as form-data for the sake of the image.
            //See router.jsx for action definition
        }
    };

    const handleSettingsUpdate = async (e) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value });
    };

    if (!user) {
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

            <Card
                component="form"
                variant="outlined"
                onSubmit={handleUserSettingsSubmit}
                sx={{ padding: 1 }}
            >
                <Typography variant="h6">My Profile</Typography>
                {/* Profile Picture Upload */}
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Avatar
                        src={imageUrl}
                        alt={user?.displayName}
                        sx={{ height: "7em", width: "7em", margin: "auto" }}
                    />
                    <ImageUploader
                        label="Upload Profile Picture"
                        onUpload={(image) =>
                            setUserForm({ ...userForm, image })
                        }
                        size="small"
                        color="secondary"
                    />
                </Box>

                <TextField
                    label="Username"
                    fullWidth
                    margin="dense"
                    name="username"
                    value={userForm.username ?? user?.username}
                    onChange={handleSettingsUpdate}
                />
                <TextField
                    label="Bio"
                    fullWidth
                    margin="dense"
                    name="bio"
                    multiline
                    minRows={3}
                    value={userForm.bio ?? user?.bio}
                    onChange={handleSettingsUpdate}
                />
                <TextField
                    label="Change Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    name="newPassword"
                    value={userForm.newPassword}
                    onChange={handleSettingsUpdate}
                />
                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    name="currentPassword"
                    value={userForm.currentPassword}
                    onChange={handleSettingsUpdate}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Save Changes
                </Button>
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
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
