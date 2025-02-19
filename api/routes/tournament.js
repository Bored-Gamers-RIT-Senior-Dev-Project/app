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
        startsBefore,
        startsAfter,
        endsBefore,
        endsAfter,
        status,
        location,
        sortBy,
        sortAsDescending,
    } = req.query;
    try {
        const tournament = await TournamentService.searchTournaments(
            tournamentID,
            tournamentName,
            startDate,
            endDate,
            startsBefore,
            startsAfter,
            endsBefore,
            endsAfter,
            status,
            location,
            sortBy,
            sortAsDescending
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

router.post("/update", async (req, res, next) => {
    const {
        tournamentID,
        tournamentName,
        startDate,
        endDate,
        location,
        userRoleID,
    } = req.body;
    if (!tournamentID || !userRoleID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.updateTournament(
            tournamentID,
            tournamentName,
            startDate,
            endDate,
            null,
            location,
            userRoleID
        );
        res.status(201).json({
            message: "Tournament updated successfully",
            tournament,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/cancel", async (req, res, next) => {
    const { tournamentID, userRoleID } = req.body;
    if (!tournamentID || !userRoleID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.updateTournament(
            tournamentID,
            null,
            null,
            null,
            "Cancelled",
            null,
            userRoleID
        );
        res.status(201).json({
            message: "Tournament cancelled",
            tournament,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/match/search", async (req, res, next) => {
    const {
        matchID,
        tournamentID,
        teamID,
        before,
        after,
        sortBy,
        sortAsDescending,
    } = req.query;
    try {
        const matches = await TournamentService.searchMatches(
            matchID,
            tournamentID,
            teamID,
            before,
            after,
            sortBy,
            sortAsDescending
        );
        if (matchID && matches === null) {
            return res.status(404).json({ error: "Match not found." });
        }
        if (!matchID && matches === null) {
            return res.status(200).json([]);
        }
        return res.status(200).json(matches);
    } catch (error) {
        next(error);
    }
});

router.post("/match/setResult", async (req, res, next) => {
    const { matchID, winnerID, score1, score2 } = req.body;
    if (!matchID || !winnerID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const match = await TournamentService.updateMatchResult(
            matchID,
            winnerID,
            score1,
            score2
        );
        res.status(201).json({
            message: "Match updated successfully",
            match,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
