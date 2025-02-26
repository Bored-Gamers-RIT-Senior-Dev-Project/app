import { Search as SearchIcon } from "@mui/icons-material";
import { useState } from "react";

import {
    Box,
    Button,
    FormControl,
    Grid2 as Grid,
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
                <Grid
                    container
                    spacing={1}
                    component="form"
                    onKeyDown={(e) =>
                        e.key === "Enter" ? handleSearch() : null
                    }
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
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
                            onChange={(e) => setSearchBar(e.target.value)}
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
                                onKeyDown={(e) => console.log(e)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={2}>
                        <Button variant="contained" onClick={handleSearch}>
                            Search
                        </Button>
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
