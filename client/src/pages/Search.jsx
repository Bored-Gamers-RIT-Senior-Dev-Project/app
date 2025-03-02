import { useState } from "react";

import { ExpandMore, Search as SearchIcon } from "@mui/icons-material";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Grid2 as Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
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

const Search = () => {
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [sorting, setSorting] = useState("");
    const [searchBar, setSearchBar] = useState("");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "800px",
                width: "100%",
            }}
        >
            <Paper component="div" sx={{ padding: { xs: 1, md: 3 } }}>
                <Typography variant="h4" textAlign="center" sx={{ pb: 3 }}>
                    Search
                </Typography>

                <TextField
                    label="Search"
                    variant="outlined"
                    color="primary"
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
                    sx={{ width: "100%" }}
                />
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        Advanced Search
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Autocomplete
                                    options={universityList}
                                    value={selectedUniversity}
                                    onChange={(e, newValue) =>
                                        setSelectedUniversity(newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="University Name"
                                        />
                                    )}
                                />
                            </Grid>
                            {/* <Grid size={{ xs: 12, md: 6 }}>
                                <Autocomplete
                                    options={cityList}
                                    value={selectedCity}
                                    onChange={(e, newValue) =>
                                        setSelectedCity(newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Home City"
                                        />
                                    )}
                                />
                            </Grid> */}
                            <Grid size={{ xs: 12, md: 6 }}></Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </Box>
    );
};

export { Search };
