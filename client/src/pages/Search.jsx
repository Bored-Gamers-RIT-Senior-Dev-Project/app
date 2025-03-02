import { Search as SearchIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

import {
    Button,
    ButtonBase,
    FormControl,
    Grid2 as Grid,
    InputAdornment,
    InputLabel,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import { useActionData, useLoaderData } from "react-router";
import { DynamicSelect } from "../components/DynamicSelect";
import { ImageHolder } from "../components/ImageHolder";
import { usePostSubmit } from "../hooks/usePostSubmit";

const UniversityElement = ({ university }) => {
    return (
        <Paper sx={{ display: "flex" }}>
            <ImageHolder
                src={university.logoUrl}
                sx={{
                    width: "8rem",
                    height: "8rem",
                    objectFit: "cover",
                    borderRadius: "2rem",
                }}
            />
            <Typography type="h3">{university.universityName}</Typography>
        </Paper>
    );
};

UniversityElement.propTypes = {
    university: PropTypes.shape({
        logoUrl: PropTypes.string.isRequired,
        universityName: PropTypes.string.isRequired,
    }).isRequired,
};

const TeamElement = ({ team }) => {
    return (
        <ButtonBase sx={{ width: "100%" }}>
            <Paper sx={{ display: "flex", width: "100%" }}>
                <ImageHolder
                    src={team.profileImageUrl}
                    sx={{
                        width: "8rem",
                        height: "8rem",
                        objectFit: "cover",
                        borderRadius: "2rem",
                    }}
                />
                <Typography type="h3">{team.teamName}</Typography>
            </Paper>
        </ButtonBase>
    );
};

TeamElement.propTypes = {
    team: PropTypes.shape({
        profileImageUrl: PropTypes.string.isRequired,
        teamName: PropTypes.string.isRequired,
    }).isRequired,
};

const Search = () => {
    // const [selectedUniversity, setSelectedUniversity] = useState(null);
    // const [selectedCity, setSelectedCity] = useState(null);

    const submit = usePostSubmit();
    const actionData = useActionData();
    const loaderData = useLoaderData();

    const [sorting, setSorting] = useState("alphabetical");
    const [searchBar, setSearchBar] = useState("");

    const handleSearch = () => {
        submit({ value: searchBar });
    };

    const results = useMemo(() => {
        const data = actionData ?? loaderData;
        switch (sorting) {
            case "alphabetical":
                return data.result.sort((a, b) => {
                    const valueA =
                        a.type === "University" ? a.universityName : a.teamName;
                    const valueB =
                        b.type === "University" ? b.universityName : b.teamName;
                    if (valueA > valueB) return 1;
                    if (valueB > valueA) return -1;
                    return 0;
                });
            case "universityName":
                return data.result.sort((a, b) => {
                    if (a.universityName > b.universityName) return 2;
                    if (b.universityName > a.universityName) return -2;
                    if (b.type === "University") return 1;
                    return -1;
                });
        }
    }, [actionData, loaderData, sorting]);

    return (
        <Grid
            container
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
            <Grid size={12}>
                <Paper component="div" sx={{ padding: { xs: 1, md: 3 } }}>
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
                        sx={{ position: "sticky" }}
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
            </Grid>
            {results.length === 0 ? (
                <Grid size={12}>
                    <Paper>
                        <Typography variant="h3">No Results Found</Typography>
                    </Paper>
                </Grid>
            ) : (
                results.map((result) =>
                    result.type === "University" ? (
                        <Grid size={12} key={"University" + result.id}>
                            <UniversityElement university={result} />
                        </Grid>
                    ) : (
                        <Grid size={12} key={"Team" + result.id}>
                            <TeamElement team={result} />
                        </Grid>
                    )
                )
            )}
        </Grid>
    );
};

export { Search };
