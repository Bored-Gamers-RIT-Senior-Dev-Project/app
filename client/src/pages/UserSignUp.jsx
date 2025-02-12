import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    LinearProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useDeferredValue, useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";
import { signUpWithEmail } from "../utils/firebase/auth";

// From https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react:
import { zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";
/**
 * @import { ZxcvbnResult, Score } from "@zxcvbn-ts/core"
 */
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { translations } from "@zxcvbn-ts/language-en";

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

// From https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react
const options = {
    // recommended
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
    },
    // recommended
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    // recommended
    useLevenshteinDistance: true,
};

zxcvbnOptions.setOptions(options);

/**
 * Score the given password
 * From https://zxcvbn-ts.github.io/zxcvbn/guide/framework-examples/#react
 * @param {string} password The password to score
 * @returns {ZxcvbnResult} zxcvbn's password scoring
 */
const usePasswordStrength = (password) => {
    const [result, setResult] = useState(null);
    const deferredPassword = useDeferredValue(password);

    useEffect(() => {
        zxcvbnAsync(deferredPassword).then((response) => setResult(response));
    }, [deferredPassword]);

    return result;
};
/**
 * Based on the score, return an adjective describing that score
 * @param {Score} score the score of the password
 * @returns {string} an adjective: one of "Excellent", "Good", "OK" or "Bad"
 */
const passwordAdjective = (score) => {
    switch (score) {
        case 0:
        case 1:
            return "Bad";
        case 2:
            return "OK";
        case 3:
            return "Good";
        case 4:
            return "Excellent";
    }
};
/**
 * Given a zxcvbn score, return a color
 * @param {Score} score the score of the password
 * @returns {string} A color
 */
const passwordColor = (score) => {
    // https://coolors.co/ad1a24-5d5a0e-386141
    switch (score) {
        case 0:
        case 1:
            return "#AD1A24";
        case 2:
            // Yeah, not very many yellows work against a white background
            return "#5D5A0E";
        case 3:
        case 4:
            return "#386141";
    }
};
/**
 * @typedef {Object} SignUpData
 * @property {string} email the email
 * @property {string} username the username
 * @property {string} password the password
 * @property {string} repeatPassword should be the same as the password, but might not be
 */

/**
 * A component for the password bar
 * @param {Object} params
 * @param {SignUpData} params.signUpData
 * @returns the password strength component
 */
const PasswordStrength = ({ signUpData }) => {
    const result = usePasswordStrength(signUpData.password) ?? {
        score: 0,
    };
    const score = result.score;
    let reason = "";
    if (result.feedback && result.feedback.suggestions) {
        for (const item of result.feedback.suggestions) {
            reason += translations.suggestions[item] + " ";
        }
    }
    const color = passwordColor(score);
    const adjective = passwordAdjective(score);
    return (
        <Box sx={{ width: "100%", color: color }}>
            <Typography color="inherit">
                Password strength: <b>{adjective}</b>
            </Typography>
            <LinearProgress
                variant="determinate"
                value={(score / 4) * 100}
                color="inherit"
            />
            <Typography color="inherit">{reason}</Typography>
        </Box>
    );
};

PasswordStrength.propTypes = {
    signUpData: PropTypes.object,
};

const UserSignUp = () => {
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
