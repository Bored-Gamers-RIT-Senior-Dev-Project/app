import { useState } from "react";
import {
    Paper,
    Typography,
    TextField,
    FormControl,
    FormLabel,
    Autocomplete,
    Select,
    MenuItem,
    InputLabel,
    Box
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

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
    "Phoenix"
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

    return (
        <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
            <Typography variant="h4" textAlign="center" sx={{ pb: 3 }}>Search</Typography>

            <SearchBar>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
            </SearchBar>

        
        <Paper variant="outlined" sx={{ mt: 2, mb: 2, padding: 2 }}>
                <FormLabel>Advanced Search</FormLabel>
                <Autocomplete 
                    sx={{ mt: 2 }}
                    options={universityList}
                    value={selectedUniversity}
                    onChange={(e, newValue) => setSelectedUniversity(newValue)}
                    renderInput={(params) => <TextField {...params} label="Select your University" />}
                />
                <Autocomplete 
                    sx={{ mt: 2 }}
                    options={cityList}
                    value={selectedCity}
                    onChange={(e, newValue) => setSelectedCity(newValue)}
                    renderInput={(params) => <TextField {...params} label="Select your City" />}
                />
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Sort by:</InputLabel>
                        <Select value={sorting} onChange={(e) => setSorting(e.target.value)}>
                            <MenuItem value="popularity">Popularity</MenuItem>
                            <MenuItem value="recent_activity">Recent Activity</MenuItem>
                            <MenuItem value="win_rate">Win Rate</MenuItem>
                            <MenuItem value="rank">Rank</MenuItem>
                            <MenuItem value="members">Number of Members</MenuItem>
                            <MenuItem value="date_created">Date Created (Newest First)</MenuItem>
                            <MenuItem value="alphabetical">Alphabetical Order (A-Z)</MenuItem>
                            <MenuItem value="upcoming_matches">Upcoming Matches</MenuItem>
                            <MenuItem value="availability">Team Availability</MenuItem>
                            <MenuItem value="game_mode">Game Mode Specialization</MenuItem>
                            <MenuItem value="region">Region/Location</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>
        </Paper>
    );
};

export { Search };
