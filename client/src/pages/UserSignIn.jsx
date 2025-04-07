// Chatgpt helped me write function in this file and its the async functionW
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useActionData, useLocation, useNavigate } from "react-router";
import { GoogleSignIn } from "../components/GoogleSignIn";
import { useAuth } from "../hooks/useAuth";
import { events } from "../utils/events";
import { signInWithEmail } from "../utils/firebase/auth";
import { ErrorData, MessageData } from "../utils/messageData";

const handleErrors = (error) => {
    switch (error.message) {
        case "Firebase: Error (auth/invalid-credential).":
            new ErrorData("Invalid username or password.").send();
            break;
        default:
            console.error("Sign-in error:", error.message);
            events.publish(
                "message",
                new ErrorData("An unexpected error occurred")
            );
    }
};

const UserSignIn = () => {
    const [signInData, setSignInData] = useState({ email: "", password: "" });
    const actionData = useActionData();
    const { state } = useLocation();
    const { user, setUser } = useAuth();

    const navigate = useNavigate();

    const handleSignInChange = (e) => {
        setSignInData({ ...signInData, [e.target.name]: e.target.value });
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        events.publish("spinner.open");
        try {
            await signInWithEmail(signInData.email, signInData.password); //Authentication updates for preexisting users handled in AuthProvider.
        } catch (error) {
            handleErrors(error);
            events.publish("spinner.close");
        }
    };

    //ActionData is the response from the usePostSubmit action, defined in router.jsx
    //Will be undefined until the action is complete.  Then, we can use it to handle the result.
    useEffect(() => {
        if (actionData) {
            events.publish("spinner.close");
            events.publish(
                "message",
                new MessageData(undefined, actionData.message)
            );
            setUser(actionData.user);
        }
    }, [actionData, navigate, setUser]);

    //If the user is already signed in, redirect to home
    // TODO: Redirect to previously viewed page, home if this is the user's first stop on the site
    useEffect(() => {
        events.publish("spinner.close");
        if (user) {
            navigate(state?.redirect ? state.redirect : "/");
        }
    }, [state, user, navigate]);

    return (
        <Box
            sx={{
                maxWidth: "500px",
                margin: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
        >
            <Typography variant="h4" textAlign="center">
                User Sign In
            </Typography>
            <form onSubmit={handleSignInSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={signInData.email}
                    onChange={handleSignInChange}
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Sign In
                </Button>
            </form>
            <GoogleSignIn />
            {/*TODO: "Forgot Password/Forgot Username" link*/}
            {/* TODO: Sign up link should look more like a link rather than plaintext  */}
            <Typography
                sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
                onClick={() => navigate("/signup", { state })}
            >
                No account? Sign Up
            </Typography>
        </Box>
    );
};

export { UserSignIn };
