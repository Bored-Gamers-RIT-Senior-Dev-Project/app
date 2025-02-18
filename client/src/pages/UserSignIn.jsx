// Chatgpt helped me write function in this file and its the async function
import { Google } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";
import { signInWithEmail, signInWithGoogle } from "../utils/firebase/auth";
import { ErrorData, MessageData } from "../utils/messageData";

const handleErrors = (error) => {
    switch (error.message) {
        default:
            console.error("Sign-in error:", error);
            events.publish(
                "message",
                ErrorData("An unexpected error occurred")
            );
    }
};

const UserSignIn = () => {
    const [signInData, setSignInData] = useState({ email: "", password: "" });
    const actionData = useActionData();
    const submit = usePostSubmit();
    const navigate = useNavigate();

    const handleSignInChange = (e) => {
        setSignInData({ ...signInData, [e.target.name]: e.target.value });
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        events.publish("spinner.open");
        try {
            const user = await signInWithEmail(
                signInData.email,
                signInData.password
            );
            const idToken = await user.getIdToken();
            submit({ idToken, method: "email" });
        } catch (error) {
            handleErrors(error);
            events.publish("spinner.close");
        }
    };

    const handleGoogleSignIn = async () => {
        events.publish("spinner.open");
        try {
            const user = await signInWithGoogle();
            const idToken = await user.getIdToken();
            const { displayName, photoURL, email } = user;
            submit({ idToken, displayName, photoURL, email, method: "google" });
        } catch (error) {
            //TODO: If the user is new and an error took place in the API, we need to handle that case and erase the user from Firebase.
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
                MessageData(undefined, actionData.message)
            );
            if (actionData.message === "Signin successful") {
                navigate("/"); // Redirect to home on successful sign-in
            }
        }
    }, [actionData, navigate]);
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
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleGoogleSignIn}
                startIcon={<Google />}
            >
                Sign in with Google
            </Button>
            {/*TODO: "Forgot Password/Forgot Username" link*/}
            {/* TODO: Sign up link should look more like a link rather than plaintext  */}
            <Typography
                sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
                onClick={() => navigate("/signup")}
            >
                No account? Sign Up
            </Typography>
        </Box>
    );
};

export { UserSignIn };
