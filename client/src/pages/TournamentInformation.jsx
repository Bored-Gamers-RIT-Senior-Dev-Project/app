import { ArrowBack } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { API_URL, setMatchResult } from "../utils/api";

const style = {
    // https://mui.com/material-ui/react-modal/
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

/**
 * A popup that lets admins edit the score
 * @param {*} props with the match, which is null if the modal should be closed,
 * and handleClose, a function to close the modal
 * @returns the score popup
 */
const ScorePopup = ({ match, handleClose, onScoreUpdated }) => {
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (match) {
            setScore1(match.score1 ?? 0);
            setScore2(match.score2 ?? 0);
        }
    }, [match]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // Use the centralized API caller
            await setMatchResult({
                matchId: parseInt(match.matchId, 10),
                score1: parseInt(score1, 10),
                score2: parseInt(score2, 10),
            });
            onScoreUpdated();
        } catch (error) {
            console.error("Error updating match:", error);
        } finally {
            setSubmitting(false);
            handleClose(); // This closes the popup regardless of the outcome.
            window.location.reload(); // This refreshes the page.
        }
    };

    if (!match) return null;

    return (
        <Modal open={!!match} onClose={handleClose}>
            <Box sx={style}>
                <Typography align="center" variant="h4">
                    Update Score
                </Typography>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack spacing={1} alignItems="center">
                        <Typography>{match.team1Name}</Typography>
                        <input
                            type="number"
                            min="0"
                            value={score1}
                            onChange={(e) => setScore1(e.target.value)}
                            style={{ width: "60px" }}
                        />
                    </Stack>
                    <Typography variant="h6">vs</Typography>
                    <Stack spacing={1} alignItems="center">
                        <Typography>{match.team2Name}</Typography>
                        <input
                            type="number"
                            min="0"
                            value={score2}
                            onChange={(e) => setScore2(e.target.value)}
                            style={{ width: "60px" }}
                        />
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    spacing={2}
                    mt={3}
                    justifyContent="center"
                >
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

ScorePopup.propTypes = {
    match: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    onScoreUpdated: PropTypes.func.isRequired,
};

const TournamentInformation = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const isFacilitator = [2, 3, 5, 8].includes(user?.roleId);
    const [tournament, setTournament] = useState(null);
    const [matches, setMatches] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        matchTeam: "",
        tournamentName: "",
        status: "",
        sortBy: "",
        dateRange: [null, null],
    });

    const [openScorePopup, setOpenScorePopup] = useState(null); // openScorePopup is the match or null

    /**
     * Open the ScorePopup
     */
    const handleOpen = (match) => setOpenScorePopup(match);

    /**
     * Close the ScorePopup
     */
    const handleClose = () => setOpenScorePopup(null);

    /**
     * Figure out who won a match
     * (hopefully no one names their team "Tie" - this is just for visual
     * purposes so nothing serious will break if they do)
     * @param {*} match the match data, with the keys team1, team2, team1Score,
     * and team2Score
     * @returns team1 if team1 won, team2 if team 2 won, or "Tie" if the scores
     * are equal
     */
    const winner = (match) => {
        if (match.team1Score > match.team2Score) {
            return match.team1;
        }
        if (match.team1Score < match.team2Score) {
            return match.team2;
        }
        return "Tie";
    };

    const navigate = useNavigate();

    // Dropdown state for Match Filters
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
        const fetchData = async () => {
            try {
                const [tournamentRes, matchesRes] = await Promise.all([
                    fetch(API_URL + `/tournament/search?tournamentID=${id}`),
                    fetch(
                        API_URL + `/tournament/searchMatches?tournamentID=${id}`
                    ),
                ]);
                let tournamentData = await tournamentRes.json();
                if (Array.isArray(tournamentData)) {
                    tournamentData = tournamentData[0];
                } else if (
                    tournamentData &&
                    Array.isArray(tournamentData.result)
                ) {
                    tournamentData = tournamentData.result[0];
                }
                if (tournamentData) {
                    setTournament(tournamentData);
                    setFilters((prev) => ({
                        ...prev,
                        tournamentName: tournamentData.tournamentName,
                    }));
                }
                let matchesData = await matchesRes.json();
                if (!Array.isArray(matchesData)) {
                    if (Array.isArray(matchesData.result)) {
                        matchesData = matchesData.result;
                    } else {
                        matchesData = [];
                    }
                }
                setMatches(matchesData);
            } catch (err) {
                console.error(
                    "Failed to fetch tournament info or matches:",
                    err
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const filteredMatches = (matches || [])
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
        <>
            <Box sx={{ maxWidth: "900px", margin: "auto", padding: 2 }}>
                {/* Match Filters Dropdown Button */}

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="contained"
                        startIcon={<ArrowBack />}
                    >
                        Go Back
                    </Button>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    disableScrollLock
                    keepMounted
                >
                    <Paper sx={{ padding: 1, borderRadius: "10px", m: 1 }}>
                        <Typography gutterBottom>Match Filters</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={18} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Match Team Name"
                                    name="matchTeam"
                                    value={filters.matchTeam}
                                    onChange={handleFilterChange}
                                />
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
                </Menu>

                {/* Tournament Details & Matches List */}
                <Paper
                    sx={{ padding: 3, borderRadius: "10px", marginBottom: 3 }}
                >
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

                    <Box mt={2}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Matches
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleMenuOpen}
                            sx={{ mb: 2 }}
                        >
                            Match Filters
                        </Button>
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
                                                ml={4}
                                            >
                                                {getMatchCountdown(
                                                    match.matchTime
                                                )}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                {match.score1} - {match.score2}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="primary"
                                        mt={0.5}
                                    >
                                        Winner:{" "}
                                        {match.winnerId
                                            ? match.winnerId === match.team1Id
                                                ? match.team1Name
                                                : match.team2Name
                                            : "TBD"}
                                    </Typography>
                                    {isFacilitator && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleOpen(match)}
                                        >
                                            Update Score
                                        </Button>
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No matches found.
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
            <ScorePopup
                match={openScorePopup}
                handleClose={handleClose}
            ></ScorePopup>
        </>
    );
};

export { TournamentInformation };
