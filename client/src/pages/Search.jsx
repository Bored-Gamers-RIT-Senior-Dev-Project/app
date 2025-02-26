import { useState } from "react";

import { Search as SearchIcon } from "@mui/icons-material";

import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import { usePostSubmit } from "../hooks/usePostSubmit";

const universityList = [
    "Rochester Institute of Technology",
    "Harvard University",
    "MIT",
    "Stanford University",
];

const cityList = [
    "Rochester",
    "New York City",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
];

const SearchBar = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    "&:hover": { backgroundColor: alpha(theme.palette.common.black, 0.25) },
    margin: "0 auto",
    width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(1),
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    padding: theme.spacing(1, 1, 1, 5),
}));

import { events } from "../utils/events";
import { ErrorData, MessageData, Severity } from "../utils/messageData";

const Search = () => {
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [sorting, setSorting] = useState("");
    const [searchBar, setSearchBar] = useState("");
    const submit = usePostSubmit();

    return (
        <>
            <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
                <Typography variant="h4" textAlign="center" sx={{ pb: 3 }}>
                    Search
                </Typography>

                <TextField
                    label="Search"
                    variant="filled"
                    name="search"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                        <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                    value={searchBar}
                    onChange={(_e, value) => setSearchBar(value)}
                    />
                </SearchBar>
            </Paper>
            <Paper variant="outlined" sx={{ mt: 2, mb: 2, padding: 2 }}>
                <FormLabel>Advanced Search</FormLabel>
                <Autocomplete
                    sx={{ mt: 2 }}
                    options={universityList}
                    value={selectedUniversity}
                    onChange={(e, newValue) => setSelectedUniversity(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select your University" />
                    )}
                />
                <Autocomplete
                    sx={{ mt: 2 }}
                    options={cityList}
                    value={selectedCity}
                    onChange={(e, newValue) => setSelectedCity(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select your City" />
                    )}
                />
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Sort by:</InputLabel>
                        <Select
                            value={sorting}
                            onChange={(e) => setSorting(e.target.value)}
                        >
                            <MenuItem value="popularity">Popularity</MenuItem>
                            <MenuItem value="recent_activity">
                                Recent Activity
                            </MenuItem>
                            <MenuItem value="win_rate">Win Rate</MenuItem>
                            <MenuItem value="rank">Rank</MenuItem>
                            <MenuItem value="members">
                                Number of Members
                            </MenuItem>
                            <MenuItem value="date_created">
                                Date Created (Newest First)
                            </MenuItem>
                            <MenuItem value="alphabetical">
                                Alphabetical Order (A-Z)
                            </MenuItem>
                            <MenuItem value="upcoming_matches">
                                Upcoming Matches
                            </MenuItem>
                            <MenuItem value="availability">
                                Team Availability
                            </MenuItem>
                            <MenuItem value="game_mode">
                                Game Mode Specialization
                            </MenuItem>
                            <MenuItem value="region">Region/Location</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

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
                <Button
                    onClick={() => submit({ searchBar })}
                    variant="contained"
                >
                    Search
                </Button>
                <Button
                    onClick={() =>
                        events.publish(
                            "message",
                            new MessageData(
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
                            new ErrorData("Oh, no!", Severity.ERROR, {
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
                        events.publish(
                            "message",
                            new MessageData(undefined, "Hooray!")
                        )
                    }
                    variant="contained"
                    color="secondary"
                >
                    Click here to send a third message!
                </Button>
            </Paper>
        </>
    );
};

export { Search };
