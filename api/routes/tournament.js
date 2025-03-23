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

router.post("/updateDetails", async (req, res, next) => {
    const { tournamentID, tournamentName, startDate, endDate, location } =
        req.body;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.updateTournamentDetails(
            tournamentID,
            tournamentName,
            startDate,
            endDate,
            null,
            location
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
    const { tournamentID } = req.body;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.updateTournamentDetails(
            tournamentID,
            null,
            null,
            null,
            "Cancelled",
            null
        );
        res.status(201).json({
            message: "Tournament cancelled",
            tournament,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/addTeam", async (req, res, next) => {
    const { tournamentID, teamID } = req.body;
    if (!tournamentID || !teamID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const teams = await TournamentService.addTournamentParticipant(
            tournamentID,
            teamID
        );
        res.status(201).json({
            message: "Team added to tournament successfully",
            teams,
        });
    } catch (error) {
        if (error.message === "Team already exists for this tournament.") {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

router.post("/removeTeam", async (req, res) => {
    const { tournamentID, teamID } = req.body;
    if (!tournamentID || !teamID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const teams = await TournamentService.removeTournamentParticipant(
            tournamentID,
            teamID
        );
        res.status(201).json({
            message: "Team removed from tournament successfully",
            teams,
        });
    } catch (error) {
        if (error.message === "Team not found in this tournament.") {
            return res.status(200).json({ error: error.message });
        }
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

router.post("/disqualifyTeam", async (req, res) => {
    const { tournamentID, teamID } = req.body;
    if (!tournamentID || !teamID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const teams = await TournamentService.updateTournamentParticipant(
            tournamentID,
            teamID,
            null,
            null,
            "disqualified",
            null,
            null
        );
        res.status(201).json({
            message: "Team disqualified from tournament successfully",
            teams,
        });
    } catch (error) {
        if (error.message === "Team not found in this tournament.") {
            return res.status(200).json({ error: error.message });
        }
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

router.get("/searchParticipants", async (req, res, next) => {
    const {
        tournamentID,
        teamID,
        teamName,
        teamLeaderID,
        teamLeaderName,
        round,
        byes,
        status,
        bracketSide,
        nextMatchID,
        universityID,
        universityName,
        isApproved,
        sortBy,
        sortAsDescending,
    } = req.query;
    try {
        const participant =
            await TournamentService.searchTournamentParticipants(
                tournamentID,
                teamID,
                teamName,
                teamLeaderID,
                teamLeaderName,
                round,
                byes,
                status,
                bracketSide,
                nextMatchID,
                universityID,
                universityName,
                isApproved,
                sortBy,
                sortAsDescending
            );
        if (teamID && tournamentID && participant === null) {
            return res
                .status(404)
                .json({ error: "Participant not found in tournament." });
        }
        if (!tournamentID && !teamID && participant === null) {
            return res.status(200).json([]);
        }
        return res.status(200).json(participant);
    } catch (error) {
        next(error);
    }
});

router.post("/addFacilitator", async (req, res, next) => {
    const { tournamentID, userID } = req.body;
    if (!tournamentID || !userID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const facilitators = await TournamentService.addTournamentFacilitator(
            tournamentID,
            userID
        );
        res.status(201).json({
            message: "Facilitator added successfully",
            facilitators,
        });
    } catch (error) {
        if (
            error.message === "Facilitator already exists for this tournament."
        ) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

router.post("/removeFacilitator", async (req, res) => {
    const { tournamentID, userID } = req.body;
    if (!tournamentID || !userID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const facilitators =
            await TournamentService.removeTournamentFacilitator(
                tournamentID,
                userID
            );
        res.status(201).json({
            message: "Facilitator removed successfully",
            facilitators,
        });
    } catch (error) {
        if (error.message === "Facilitator not found in this tournament.") {
            return res.status(200).json({ error: error.message });
        }
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

router.get("/listFacilitators", async (req, res, next) => {
    const { tournamentID } = req.query;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const facilitators =
            await TournamentService.searchTournamentFacilitators(tournamentID);
        res.status(200).json({ facilitators });
    } catch (error) {
        next(error);
    }
});

router.get("/searchFacilitators", async (req, res, next) => {
    const { tournamentID, userID, name, email, universityID } = req.query;
    try {
        const facilitators =
            await TournamentService.searchTournamentFacilitators(
                tournamentID,
                userID,
                name,
                email,
                universityID
            );
        res.status(200).json({ facilitators });
    } catch (error) {
        next(error);
    }
});

router.post("/start", async (req, res) => {
    const { tournamentID } = req.body;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const tournament = await TournamentService.startTournament(
            tournamentID
        );
        res.status(200).json({
            message: "Tournament started successfully.",
        });
    } catch (error) {
        error.message;
    }
});

router.get("/getBracket", async (req, res, next) => {
    const { tournamentID } = req.query;
    try {
        const participants =
            await TournamentService.searchTournamentParticipants(tournamentID);
        const numTeams = participants.length;

        if (numTeams === 0) {
            return res
                .status(404)
                .json({ error: "No teams found in the tournament" });
        }

        const totalRounds = Math.ceil(Math.log2(numTeams));

        const leftBracket = await TournamentService.searchMatches(
            null,
            tournamentID,
            "left",
            null,
            null,
            null,
            "participant1.BracketOrder",
            null
        );
        const rightBracket = await TournamentService.searchMatches(
            null,
            tournamentID,
            "right",
            null,
            null,
            null,
            "participant1.BracketOrder",
            null
        );

        if (!leftBracket.length && !rightBracket.length) {
            return res.status(404).json({ error: "Please start tournament" });
        }
        return res.status(200).json({
            TournamentID: tournamentID,
            Bracket: [{ leftBracket, rightBracket }],
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
