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

router.get("/getByID/:tournamentID", async (req, res, next) => {
    const { tournamentID } = req.params;
    try {
        const tournament = await TournamentService.searchTournaments(
            tournamentID
        );
        res.status(200).json(tournament);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
