import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Button,
    colors,
    IconButton,
    InputAdornment,
    LinearProgress,
    Paper,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";
import { signUpWithEmail } from "../utils/firebase/auth";

/**
 * @class ErrorData a convenience for representing the data needed for an error
 */
class ErrorData {
    /**
     * Create a new ErrorData
     * @param {string} message The user-facing message for this error
     * @param {string} [severity] The severity, or "error" if not specified.
     * Should be one of "info", "error", "warning", or "success", if provided
     */
    constructor(message, severity = "error") {
        this.message = message;
        const allowedErrors = ["info", "error", "warning", "success"];
        if (!allowedErrors.includes(severity)) {
            console.warn(`ErrorData: Unexpected severity ${severity}`);
        }
        this.severity = severity;
    }
}

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

    events.publish("message", errorData);
    console.error("Sign-in error:", error);
};
/**
 * A component for the password bar
 * @returns the password strength component
 */
const PasswordStrength = (signUpData) => {
    return (
        <Box sx={{ width: "100%", color: "red" }}>
            <Typography color="inherit">
                <b></b>
            </Typography>
            <LinearProgress
                variant="determinate"
                value={50}
                color="inherit"
            ></LinearProgress>
            <Typography color="inherit">D</Typography>
        </Box>
    );
};

const UserSignUp = () => {
    const [signUpData, setSignUpData] = useState({
        email: "",
        username: "",
        password: "",
        repeatPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const submit = usePostSubmit();
    const actionData = useActionData();
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
            events.publish("Message", {
                message: "Passwords do not match",
                severity: "warning",
            });
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
            });
        } catch (error) {
            handleFirebaseSignUpError(error);
        } finally {
            events.publish("spinner.close");
        }
    };

    useEffect(() => {
        if (actionData) {
            events.publish("spinner.close");
            events.publish("message", { message: actionData.message });
            if (actionData.message === "Welcome!") {
                navigate("/"); // Redirect to home on successful sign-up
            }
        }
    }, [actionData, navigate]);

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
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
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
                <PasswordStrength signUpData={signUpData} />
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
