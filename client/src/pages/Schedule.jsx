import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Button,
  Grid,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDistanceToNow } from "date-fns";

const Schedule = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    status: "",
    sortBy: "",
    matchTeam: "",
  });
  const [loading, setLoading] = useState(true);
  const tournamentStatuses = ["Active", "Completed", "Cancelled", "Upcoming"];

  const formatDateRange = (start, end) => {
    const options = { dateStyle: "medium" };
    const startDate = start ? new Date(start).toLocaleDateString(undefined, options) : "N/A";
    const endDate = end ? new Date(end).toLocaleDateString(undefined, options) : "N/A";
    return `${startDate} - ${endDate}`;
  };

  const getMatchCountdown = (matchTime) => {
    const matchDate = new Date(matchTime);
    return formatDistanceToNow(matchDate, { addSuffix: true });
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/tournaments/with-matches");
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
    setFilters({ name: "", location: "", status: "", sortBy: "", matchTeam: "" });
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
    .sort((a, b) => {
      if (filters.sortBy === "date") {
        return new Date(a.startDate) - new Date(b.startDate);
      } else if (filters.sortBy === "location") {
        return (a.location || "").localeCompare(b.location || "");
      }
      return 0;
    });

  return (
    <Box sx={{ maxWidth: "900px", margin: "auto", padding: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 3 }}>
        Tournament Schedule
      </Typography>

      <Box sx={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", mb: 3 }}>
        <Paper sx={{ padding: 3, borderRadius: "10px" }}>
          <Typography variant="h6" gutterBottom>
            Tournament Filters
          </Typography>
          <Grid container spacing={2}>
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
                  <MenuItem key={status} value={status}>{status}</MenuItem>
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
          </Grid>

          <Typography variant="h6" mt={3} gutterBottom>
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
              <Button fullWidth variant="outlined" onClick={clearFilters}>
                Clear All Filters
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
        <Stack spacing={2}>
          {filteredTournaments.map((tournament) => {
            const filteredMatches = (tournament.matches || []).filter(
              (match) =>
                match.team1Name.toLowerCase().includes(filters.matchTeam.toLowerCase()) ||
                match.team2Name.toLowerCase().includes(filters.matchTeam.toLowerCase())
            );

            return (
              <Accordion key={tournament.tournamentId} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box width="100%">
                    <Typography variant="h6" fontWeight="bold">
                      {tournament.tournamentName} ({filteredMatches.length} matches)
                    </Typography>
                    <Typography>
                      {formatDateRange(tournament.startDate, tournament.endDate)}
                    </Typography>
                    <Typography>{tournament.location}</Typography>
                    <Typography variant="body2">Status: {tournament.status}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Matches
                  </Typography>
                  {filteredMatches.length > 0 ? (
                    filteredMatches.map((match) => (
                      <Box
                        key={match.matchId}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        px={2}
                        py={1}
                        border="1px solid #ccc"
                        borderRadius="10px"
                        mb={1}
                      >
                        <Typography>{match.team1Name}</Typography>
                        <Typography fontWeight="bold" color="primary">
                          vs
                        </Typography>
                        <Typography>{match.team2Name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {getMatchCountdown(match.matchTime)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {match.score1} - {match.score2}
                        </Typography>
                        {match.winnerId && (
                          <Typography variant="body2" color="primary">
                            Winner: {match.winnerId === match.team1Id ? match.team1Name : match.team2Name}
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No matches found for this tournament.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export { Schedule };
