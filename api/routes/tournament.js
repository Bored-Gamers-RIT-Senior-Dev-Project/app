const express = require("express");
const router = express.Router();
const TournamentService = require("../services/tournamentService");

router.post("/create", async (req, res, next) => {
    console.log(
        Date.now() +
            " - endpoint:/api/tournament/create - Method:" +
            req.method +
            " - IP:" +
            req.ip +
            "- Body: " +
            JSON.stringify(req.body)
    );
    const { tournamentName, startDate, endDate, status, location } = req.body;
    if (!tournamentName || !startDate || !endDate || !status || !location) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.createTournament(
            tournamentName,
            startDate,
            endDate,
            status,
            location
        );
        res.status(201).json({
            message: "Tournament created",
            tournament,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
