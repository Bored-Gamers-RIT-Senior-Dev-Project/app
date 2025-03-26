import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { GoogleSignIn } from "../components/GoogleSignIn";
import { PasswordStrength } from "../components/PasswordStrength";
import { useAuth } from "../hooks/useAuth";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";
import { signUpWithEmail } from "../utils/firebase/auth";
import { ErrorData, Severity } from "../utils/messageData";

/**
 * Handle a sign up error from Firebase
 * @param {*} error the error
 */
const handleFirebaseSignUpError = (error) => {
    "use strict";
    // Handle specific error messages here if needed
    // The error code list is here:
    // https://firebase.google.com/docs/reference/js/auth#autherrorcodes
    const errorCodeLookup = {
        "auth/email-already-in-use": new ErrorData("Email already in use"),
        "auth/invalid-email": new ErrorData("Invalid Email"),
        "auth/weak-password": new ErrorData(
            "Password is too weak (too short?)"
        ),
    };
    const errorData =
        errorCodeLookup[error.code] ??
        new ErrorData("An unexpected error occurred");

    errorData.send();
    console.error("Sign-in error:", errorData);
};

const UserSignUp = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const [signUpData, setSignUpData] = useState({
        email: "",
        username: "",
        fname: "",
        lname: "",
        password: "",
        repeatPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const submit = usePostSubmit();
    const navigate = useNavigate();

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData({ ...signUpData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        events.publish("spinner.open");

        if (signUpData.password !== signUpData.repeatPassword) {
            //TODO: Make the form validate this automatically, rather than on submit.
            events.publish(
                "Message",
                new ErrorData("Passwords do not match", Severity.WARNING)
            );
            events.publish("spinner.close");
            return;
        }
        let idToken = null;
        try {
            const user = await signUpWithEmail(
                signUpData.email,
                signUpData.password
            );
            idToken = await user.getIdToken();
            submit({
                idToken,
                email: signUpData.email,
                username: signUpData.username,
                firstName: signUpData.fname,
                lastName: signUpData.lname,
            });
        } catch (error) {
            handleFirebaseSignUpError(error);
        } finally {
            events.publish("spinner.close");
        }
    };

    useEffect(() => {
        if (user) {
            navigate(state?.redirect ?? "/");
        }
    }, [user, navigate, state]);

    return (
        <Paper elevation={6} sx={{ p: 4, maxWidth: 600 }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Create Your Account
            </Typography>
            <form onSubmit={handleSignUpSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Username"
                    name="username"
                    value={signUpData.username}
                    onChange={handleSignUpChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="First Name"
                    name="fname"
                    value={signUpData.fname}
                    onChange={handleSignUpChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    name="lname"
                    value={signUpData.lname}
                    onChange={handleSignUpChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    fullWidth
                    required
                    margin="normal"
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    label="Repeat Password"
                    name="repeatPassword"
                    type={showPassword ? "text" : "password"}
                    value={signUpData.repeatPassword}
                    onChange={handleSignUpChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <PasswordStrength password={signUpData.password} />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Sign Up
                </Button>
            </form>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{ flexGrow: 1, borderBottom: "1px solid black", mx: 1 }}
                />
                <Typography>OR</Typography>
                <Box
                    sx={{ flexGrow: 1, borderBottom: "1px solid black", mx: 1 }}
                />
            </Box>
            <GoogleSignIn />
            {/* TODO: Sign in link should look more like a link rather than plaintext  */}
            <Typography
                sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
                onClick={() => navigate("/signin")}
            >
                Already have an account? Sign In
            </Typography>
        </Paper>
    );
};

export { UserSignUp };
