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
        </Paper>
    );
};

export { Search };
