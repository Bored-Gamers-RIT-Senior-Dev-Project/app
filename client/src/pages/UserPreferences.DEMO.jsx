import { Error } from "@mui/icons-material";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";

const UserPreferences = () => {
    const { user } = useAuth();
    const [usernameBar, setUsernameBar] = useState(user?.username);
    const submit = usePostSubmit();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/signin");
    }, [user, navigate]);

    return (
        <Paper
            sx={{
                padding: { xs: 1, md: 3 },
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <Typography variant="h1">Demo</Typography>
            <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={usernameBar}
                onChange={(event) => setUsernameBar(event.target.value)}
                onKeyDown={(event) =>
                    event.key === "Enter" && submit({ usernameBar })
                }
            />
            <Button onClick={() => submit({ usernameBar })} variant="contained">
                Search
            </Button>
            <Button
                onClick={() =>
                    events.publish("message", {
                        title: "Success!",
                        message: "Message sent!",
                        severity: "success",
                    })
                }
                variant="contained"
                color="secondary"
            >
                Click here to send a message!
            </Button>
            <Button
                onClick={() =>
                    events.publish("message", {
                        message: "Oh, no!",
                        severity: "error",
                        icon: <Error />,
                        autoHideDuration: 5000,
                    })
                }
                variant="contained"
                color="primary"
            >
                Click here to send a different message!
            </Button>
            <Button
                onClick={() =>
                    events.publish("message", {
                        message: "Hooray!",
                    })
                }
                variant="contained"
                color="secondary"
            >
                Click here to send a third message!
            </Button>
        </Paper>
    );
};
export { UserPreferences };
