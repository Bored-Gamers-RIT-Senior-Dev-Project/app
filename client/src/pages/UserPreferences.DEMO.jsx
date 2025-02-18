import { Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { usePostSubmit } from "../hooks/usePostSubmit";

const UserPreferences = () => {
    const { user, idToken } = useAuth();
    const [usernameBar, setUsernameBar] = useState(user?.username);
    const submit = usePostSubmit();
    const navigate = useNavigate();

    useEffect(() => {
        if (idToken === null) navigate("/signin");
    }, [idToken, navigate]);

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
                    event.key === "Enter" &&
                    submit({ idToken, username: usernameBar })
                }
            />
            <Button
                onClick={() => submit({ idToken, username: usernameBar })}
                variant="contained"
            >
                Update Username
            </Button>
            <Button
                onClick={() =>
                    submit({
                        idToken,
                        teamId: 1,
                        roleId: 4,
                    })
                }
                variant="contained"
                color="secondary"
            >
                Make me a Participant on Team 1!
            </Button>
            <Button
                onClick={() =>
                    submit({
                        idToken,
                        teamId: 7,
                        roleId: 4,
                    })
                }
                variant="contained"
                color="secondary"
            >
                Make me a participant on Team #49!
            </Button>
            <Button
                onClick={() =>
                    submit({
                        idToken,
                        teamId: 49,
                        roleId: 3,
                        universityId: null,
                    })
                }
                variant="contained"
                color="primary"
            >
                Make me a superadmin!
            </Button>
            <Button
                onClick={() =>
                    submit({
                        idToken,
                        teamId: null,
                        roleId: 3,
                        universityId: 1,
                    })
                }
                variant="contained"
                color="secondary"
            >
                Make me a representative from University 1!
            </Button>
            <Button
                onClick={() =>
                    submit({
                        idToken,
                        teamId: null,
                        roleId: 3,
                        universityId: 7,
                    })
                }
                variant="contained"
                color="secondary"
            >
                Make me a representative from University #7!
            </Button>
        </Paper>
    );
};
export { UserPreferences };
