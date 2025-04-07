import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const MatchesPage = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        matchTeam: "",
        tournamentName: "",
        status: "",
        sortBy: "",
        dateRange: [null, null],
    });

    const formatDateRange = (start, end) => {
        const options = { dateStyle: "medium" };
        const startDate = start
            ? new Date(start).toLocaleDateString(undefined, options)
            : "N/A";
        const endDate = end
            ? new Date(end).toLocaleDateString(undefined, options)
            : "N/A";
        return `${startDate} - ${endDate}`;
    };

    const getMatchCountdown = (matchTime) => {
        const matchDate = new Date(matchTime);
        return formatDistanceToNow(matchDate, { addSuffix: true });
    };

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch(
                    `http://localhost:3000/api/tournaments/${id}/matches`
                );
                const data = await res.json();
                if (data) {
                    setTournament(data);
                    setFilters((prev) => ({
                        ...prev,
                        tournamentName: data.tournamentName,
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch matches:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [id]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            matchTeam: "",
            tournamentName: tournament?.tournamentName || "",
            status: "",
            sortBy: "",
            dateRange: [null, null],
        });
    };

    const filteredMatches = (tournament?.matches || [])
        .filter(
            (match) =>
                match.team1Name
                    .toLowerCase()
                    .includes(filters.matchTeam.toLowerCase()) ||
                match.team2Name
                    .toLowerCase()
                    .includes(filters.matchTeam.toLowerCase())
        )
        .filter((match) =>
            filters.status === ""
                ? true
                : filters.status.toLowerCase() === "completed"
                ? match.score1 !== null && match.score2 !== null
                : filters.status.toLowerCase() === "upcoming"
                ? new Date(match.matchTime) > new Date()
                : filters.status.toLowerCase() === "live"
                ? false
                : true
        )
        .filter((match) => {
            const [start, end] = filters.dateRange;
            if (!start || !end) return true;
            const matchDate = new Date(match.matchTime);
            return matchDate >= start && matchDate <= end;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case "dateAsc":
                    return new Date(a.matchTime) - new Date(b.matchTime);
                case "dateDesc":
                    return new Date(b.matchTime) - new Date(a.matchTime);
                case "score":
                    return b.score1 + b.score2 - (a.score1 + a.score2);
                case "team":
                    return a.team1Name.localeCompare(b.team1Name);
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: "900px", margin: "auto", padding: 2 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 3,
                }}
            >
                Match Schedule
            </Typography>

            <Paper sx={{ padding: 3, borderRadius: "10px", marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Match Filters
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Match Team Name"
                            name="matchTeam"
                            value={filters.matchTeam}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tournament Name"
                            name="tournamentName"
                            value={filters.tournamentName}
                            InputProps={{ readOnly: true }}
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
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="Upcoming">Upcoming</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Live">Live</MenuItem>
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
                            <MenuItem value="dateAsc">Date ↑</MenuItem>
                            <MenuItem value="dateDesc">Date ↓</MenuItem>
                            <MenuItem value="score">Score</MenuItem>
                            <MenuItem value="team">Team Name</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={filters.dateRange[0]}
                                onChange={(newDate) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        dateRange: [newDate, prev.dateRange[1]],
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="End Date"
                                value={filters.dateRange[1]}
                                onChange={(newDate) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        dateRange: [prev.dateRange[0], newDate],
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={clearFilters}
                        >
                            Clear All Filters
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box width="100%">
                        <Typography variant="h6" fontWeight="bold">
                            {tournament.tournamentName} (
                            {filteredMatches.length} matches)
                        </Typography>
                        <Typography>
                            {formatDateRange(
                                tournament.startDate,
                                tournament.endDate
                            )}
                        </Typography>
                        <Typography>{tournament.location}</Typography>
                        <Typography variant="body2">
                            Status: {tournament.status}
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Matches
                    </Typography>

                    {filteredMatches.length > 0 ? (
                        filteredMatches.map((match) => (
                            <Box
                                key={match.matchId}
                                display="flex"
                                flexDirection="column"
                                gap={0.5}
                                px={2}
                                py={1}
                                border="1px solid #ccc"
                                borderRadius="10px"
                                mb={1}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexWrap="wrap"
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <Typography>
                                            {match.team1Name}
                                        </Typography>
                                        <Typography
                                            fontWeight="bold"
                                            color="primary"
                                        >
                                            vs
                                        </Typography>
                                        <Typography>
                                            {match.team2Name}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                        >
                                            {getMatchCountdown(match.matchTime)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {match.score1} - {match.score2}
                                        </Typography>
                                    </Box>
                                </Box>
                                {match.winnerId && (
                                    <Typography
                                        variant="body2"
                                        color="primary"
                                        mt={0.5}
                                    >
                                        Winner:{" "}
                                        {match.winnerId === match.team1Id
                                            ? match.team1Name
                                            : match.team2Name}
                                    </Typography>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No matches found.
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export { MatchesPage };
