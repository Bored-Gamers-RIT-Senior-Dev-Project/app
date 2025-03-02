import { Search as SearchIcon } from "@mui/icons-material";
import { useState } from "react";

import {
    Box,
    FormControl,
    Grid2 as Grid,
    InputAdornment,
    InputLabel,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import { DynamicSelect } from "../components/DynamicSelect";

const Search = () => {
    // const [selectedUniversity, setSelectedUniversity] = useState(null);
    // const [selectedCity, setSelectedCity] = useState(null);
    const [sorting, setSorting] = useState("alphabetical");
    const [searchBar, setSearchBar] = useState("");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: {
                    xs: "90vw",
                    md: "800px",
                },
                // maxWidth: "95vw",
            }}
        >
            <Paper component="div" sx={{ padding: { xs: 1, md: 3 } }}>
                <Typography variant="h4" textAlign="center" sx={{ pb: 3 }}>
                    Search
                </Typography>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 9 }}>
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
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="sortBy" id="sortByLabel">
                                Sort By
                            </InputLabel>
                            <DynamicSelect
                                fullWidth
                                id="sortBy"
                                labelId="sortByLabel"
                                label="Sort By"
                                variant="outlined"
                                value={sorting}
                                onChange={({ target }) =>
                                    setSorting(target.value)
                                }
                                options={{
                                    alphabetical: "Alphabetical",
                                    universityName: "University Name",
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                {/* <Accordion>
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
                            <Grid size={{ xs: 12, md: 6 }}>
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
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}></Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion> */}
            </Paper>
        </Box>
    );
};

export { Search };
