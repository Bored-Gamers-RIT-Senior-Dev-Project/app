const express = require("express");
const router = express.Router();
const TournamentService = require("../services/tournamentService");

router.post("/create", async (req, res, next) => {
    const { tournamentName, startDate, endDate, location } = req.body;
    if (!tournamentName || !startDate || !endDate || !location) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.createTournament(
            tournamentName,
            startDate,
            endDate,
            location
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
        res.status(200).json(tournament);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
