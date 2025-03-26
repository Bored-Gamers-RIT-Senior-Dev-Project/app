import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useActionData, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";
import { signInWithGoogle } from "../utils/firebase/auth";
import { ErrorData, MessageData } from "../utils/messageData";

const GoogleSignIn = () => {
    const { setUser } = useAuth();

    /**
     * Processes errors that occur during the google sign-in process and reports them to the user.
     * @param {object} error The error that was caught.
     */
    const handleGoogleSignInErrors = (error) => {
        switch (error.message) {
            default:
                new ErrorData("An unexpected error occurred").send();
        }
    };

    const navigate = useNavigate();
    const submit = usePostSubmit();
    const actionData = useActionData();

    /**
     * Handles what takes place after the user clicks the "Google Sign-In" button
     */
    const handleGoogleSignIn = async () => {
        events.publish("spinner.open");
        try {
            const signIn = await signInWithGoogle();
            if (signIn.additionalUserInfo.isNewUser) {
                const { displayName, photoURL, email } = signIn.user;
                submit(
                    {
                        displayName,
                        photoURL,
                        email,
                    },
                    { action: "/signin" }
                );
            }
        } catch (error) {
            //TODO: If the user is new and an error took place in the API, we need to handle that case and erase the user from Firebase.
            handleGoogleSignInErrors(error);
        } finally {
            events.publish("spinner.close");
        }
    };

    useEffect(() => {
        if (actionData) {
            events.publish("spinner.close");
            new MessageData(undefined, actionData.message).send();
            setUser(actionData.user);
        }
    }, [actionData, navigate, setUser]);

    return (
        <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleGoogleSignIn}
            startIcon={<Google />}
        >
            Sign in with Google
        </Button>
    );
};

export { GoogleSignIn };
