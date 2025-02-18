import { Error } from "@mui/icons-material";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";
import { MessageData, Severity } from "../utils/messageData";

const Search = () => {
    const [searchBar, setSearchBar] = useState("");
    const submit = usePostSubmit();

    return (
        <Paper
            sx={{
                padding: { xs: 1, md: 3 },
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <Typography variant="h1">Search</Typography>
            <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchBar}
                onChange={(event) => setSearchBar(event.target.value)}
                onKeyDown={(event) =>
                    event.key === "Enter" && submit({ searchBar })
                }
            />
            <Button onClick={() => submit({ searchBar })} variant="contained">
                Search
            </Button>
            <Button
                onClick={() =>
                    events.publish(
                        "message",
                        MessageData(
                            "Success!",
                            "Message sent!",
                            Severity.SUCCESS
                        )
                    )
                }
                variant="contained"
                color="secondary"
            >
                Click here to send a message!
            </Button>
            <Button
                onClick={() =>
                    events.publish(
                        "message",
                        ErrorData("Oh, no!", Severity.ERROR, {
                            icon: <Error />,
                            autoHideDuration: 5000,
                        })
                    )
                }
                variant="contained"
                color="primary"
            >
                Click here to send a different message!
            </Button>
            <Button
                onClick={() =>
                    events.publish("message", MessageData(undefined, "Hooray!"))
                }
                variant="contained"
                color="secondary"
            >
                Click here to send a third message!
            </Button>
        </Paper>
    );
};
export { Search };
