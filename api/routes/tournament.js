const express = require("express");
const router = express.Router();
const TournamentService = require("../services/tournamentService");

router.post("/create", async (req, res, next) => {
    const { tournamentName, startDate, endDate, location, userRoleID } =
        req.body;
    if (!tournamentName || !startDate || !endDate || !location || !userRoleID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.createTournament(
            tournamentName,
            startDate,
            endDate,
            location,
            userRoleID
        );
        res.status(201).json({
            message: "Tournament created successfully",
            tournament,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/search", async (req, res, next) => {
    const {
        tournamentID,
        tournamentName,
        startDate,
        endDate,
        status,
        location,
    } = req.query;
    try {
        const tournament = await TournamentService.searchTournaments(
            tournamentID || null,
            tournamentName || null,
            startDate || null,
            endDate || null,
            status || null,
            location || null
        );
        if (tournamentID && tournament === null) {
            return res.status(404).json({ error: "Tournament not found." });
        }
        if (!tournamentID && tournament === null) {
            return res.status(200).json([]);
        }
        return res.status(200).json(tournament);
    } catch (error) {
        next(error);
    }
});

router.post("/match/create", async (req, res, next) => {
    const { tournamentID, team1ID, team2ID, matchTime } = req.body;
    if (!tournamentID || !team1ID || !team2ID || !matchTime) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const match = await TournamentService.createMatch(
            tournamentID,
            team1ID,
            team2ID,
            matchTime
        );
        res.status(201).json({
            message: "Match created successfully",
            match,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
