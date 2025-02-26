import { Search as SearchIcon } from "@mui/icons-material";
import { useState } from "react";

import { Search as SearchIcon } from "@mui/icons-material";

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    InputAdornment,
    InputLabel,
    Paper,
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

const Search = () => {
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [sorting, setSorting] = useState("");
    const [searchBar, setSearchBar] = useState("");
    const submit = usePostSubmit();

    return (
        <Box
            sx={{
                width: {
                    xs: "90vw",
                    md: "800px",
                },
                // maxWidth: "95vw",
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
            spacing={1}
        >
            <Paper
                component="div"
                sx={(theme) => {
                    return {
                        padding: { xs: 1, md: 3 },
                        position: "sticky",
                        top: "4em",
                        zIndex: theme.zIndex.appBar,
                    };
                }}
            >
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
            {results.length === 0 ? (
                <Paper>
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                        No Results Found
                    </Typography>
                </Paper>
            ) : (
                results.map((result) =>
                    result.type === "University" ? (
                        <InfoElement
                            imageUrl={result.logoUrl}
                            title={result.universityName}
                            subtitle={result.location}
                            onClick={() => navigate(`/university/${result.id}`)}
                            key={"University" + result.id}
                        />
                    ) : (
                        <InfoElement
                            imageUrl={result.profileImageUrl}
                            title={result.teamName}
                            subtitle={result.universityName}
                            key={"Team" + result.id}
                        />
                    )
                )
            )}
        </Box>
    );
};

export { Search };
