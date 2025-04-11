import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid2 as Grid,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../utils/api";

const Schedule = () => {
    const [tournaments, setTournaments] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        location: "",
        status: "",
        sortBy: "",
        startDate: null,
        endDate: null,
    });
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);

    const navigate = useNavigate();
    const tournamentStatuses = ["Active", "Completed", "Cancelled", "Upcoming"];

    const formatDateRange = (start, end) => {
        const options = { dateStyle: "medium" };
        const startDate = start ? new Date(start).toLocaleDateString(undefined, options) : "N/A";
        const endDate = end ? new Date(end).toLocaleDateString(undefined, options) : "N/A";
        return `${startDate} - ${endDate}`;
    };

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await fetch(API_URL + "/tournament/search");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTournaments(data);
                } else if (Array.isArray(data.result)) {
                    setTournaments(data.result);
                } else {
                    console.error("Unexpected API response:", data);
                    setTournaments([]);
                }
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            name: "",
            location: "",
            status: "",
            sortBy: "",
            startDate: null,
            endDate: null,
        });
    };

    const filteredTournaments = tournaments
        .filter((tournament) =>
            tournament.tournamentName.toLowerCase().includes(filters.name.toLowerCase())
        )
        .filter(
            (tournament) =>
                filters.location === "" ||
                (tournament.location &&
                    tournament.location.toLowerCase().includes(filters.location.toLowerCase()))
        )
        .filter(
            (tournament) =>
                filters.status === "" ||
                tournament.status.toLowerCase() === filters.status.toLowerCase()
        )
        .filter((tournament) => {
            const start = filters.startDate;
            const end = filters.endDate;
            const tournamentStartDate = new Date(tournament.startDate);
            if (start && tournamentStartDate < new Date(start)) return false;
            if (end && tournamentStartDate > new Date(end)) return false;
            return true;
        })
        .sort((a, b) => {
            if (filters.sortBy === "date") {
                return new Date(a.startDate) - new Date(b.startDate);
            } else if (filters.sortBy === "location") {
                return (a.location || "").localeCompare(b.location || "");
            }
            return 0;
        });

    const openManageDialog = (tournament) => {
        setSelectedTournament({
            ...tournament,
            startDate: new Date(tournament.startDate),
            endDate: new Date(tournament.endDate),
        });
        setDialogOpen(true);
    };

    const handleDialogChange = (field, value) => {
        setSelectedTournament((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveChanges = () => {
        console.log("Saving tournament:", selectedTournament);
        setDialogOpen(false);
    };

    return (
        <Box sx={{ maxWidth: "900px", margin: "auto", padding: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 3 }}>
                All Tournaments
            </Typography>

            <Box sx={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", mb: 3 }}>
                <Paper sx={{ padding: 3, borderRadius: "10px" }}>
                    <Grid container spacing={2}>
                        {/* Filter Fields */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tournament Name"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                displayEmpty
                            >
                                <MenuItem value="">Filter by Status</MenuItem>
                                {tournamentStatuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                displayEmpty
                            >
                                <MenuItem value="">Sort By</MenuItem>
                                <MenuItem value="date">Start Date</MenuItem>
                                <MenuItem value="location">Location</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={filters.startDate}
                                    onChange={(newValue) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            startDate: newValue,
                                        }))
                                    }
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={filters.endDate}
                                    onChange={(newValue) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            endDate: newValue,
                                        }))
                                    }
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="outlined" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                filteredTournaments.map((tournament) => (
                    <Accordion key={tournament.tournamentId} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box width="100%">
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{
                                        color: "primary.main",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => navigate(`/tournaments/${tournament.tournamentId}/matches`)}
                                >
                                    {tournament.tournamentName}
                                </Typography>
                                <Typography>{formatDateRange(tournament.startDate, tournament.endDate)}</Typography>
                                <Typography>{tournament.location}</Typography>
                                <Typography variant="body2">Status: {tournament.status}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => openManageDialog(tournament)}
                                    >
                                        Manage Tournament
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        onClick={() =>
                                            console.log("Start tournament:", tournament.tournamentId)
                                        }
                                    >
                                        Start Tournament
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        fullWidth
                                        onClick={() =>
                                            console.log("Cancel tournament:", tournament.tournamentId)
                                        }
                                    >
                                        Cancel Tournament
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={() =>
                                            console.log("Delete tournament:", tournament.tournamentId)
                                        }
                                    >
                                        Delete Tournament
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Select
                                        fullWidth
                                        displayEmpty
                                        defaultValue=""
                                        onChange={(e) =>
                                            console.log(
                                                `Team action "${e.target.value}" for tournament ${tournament.tournamentId}`
                                            )
                                        }
                                    >
                                        <MenuItem value="">Team Options</MenuItem>
                                        <MenuItem value="addTeam">Add Team</MenuItem>
                                        <MenuItem value="removeTeam">Remove Team</MenuItem>
                                        <MenuItem value="disqualifyTeam">Disqualify Team</MenuItem>
                                    </Select>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Select
                                        fullWidth
                                        displayEmpty
                                        defaultValue=""
                                        onChange={(e) =>
                                            console.log(
                                                `Facilitator action "${e.target.value}" for tournament ${tournament.tournamentId}`
                                            )
                                        }
                                    >
                                        <MenuItem value="">Facilitator Options</MenuItem>
                                        <MenuItem value="listFacilitators">List Facilitators</MenuItem>
                                        <MenuItem value="addFacilitator">Add Facilitator</MenuItem>
                                        <MenuItem value="removeFacilitator">Remove Facilitator</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}

            {/* Tournament Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Tournament</DialogTitle>
                <DialogContent dividers>
                    {selectedTournament && (
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tournament Name"
                                    value={selectedTournament.tournamentName}
                                    onChange={(e) =>
                                        handleDialogChange("tournamentName", e.target.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    value={selectedTournament.location}
                                    onChange={(e) => handleDialogChange("location", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Start Date"
                                        value={selectedTournament.startDate}
                                        onChange={(newValue) => handleDialogChange("startDate", newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="End Date"
                                        value={selectedTournament.endDate}
                                        onChange={(newValue) => handleDialogChange("endDate", newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    fullWidth
                                    value={selectedTournament.status}
                                    onChange={(e) => handleDialogChange("status", e.target.value)}
                                >
                                    {tournamentStatuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveChanges}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export { Schedule };
