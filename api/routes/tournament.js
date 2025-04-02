const express = require("express");
const router = express.Router();
const TournamentService = require("../services/tournamentService");
const { makeObjectCamelCase } = require("../utils");

/**
 * POST /create
 * Create a new tournament.
 */
router.post("/create", async (req, res, next) => {
    const { tournamentName, startDate, endDate, location } = req.body;
    if (!tournamentName || !startDate || !location) {
        return res
            .status(400)
            .json({ message: "Invalid request format or parameter(s)." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const tournament = await TournamentService.createTournament(
            uid,
            tournamentName,
            startDate,
            endDate,
            location
        );
        if (!tournament) {
            return res
                .status(500)
                .json({ error: "Unknown error creating tournament." });
        }
        return res.status(201).json({
            message: "Tournament created successfully.",
            tournament: makeObjectCamelCase(tournament),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /search
 * Search for tournaments based on various query parameters.
 */
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
        return res.status(200).json(makeObjectCamelCase(tournament));
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /updateDetails
 * Update tournament details.
 */
router.put("/updateDetails", async (req, res, next) => {
    const { tournamentID, tournamentName, startDate, endDate, location } =
        req.body;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }

    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const tournament = await TournamentService.updateTournamentDetails(
            uid,
            tournamentID,
            tournamentName,
            startDate,
            endDate,
            null,
            location
        );
        return res.status(200).json({
            message: "Tournament updated successfully",
            tournament: makeObjectCamelCase(tournament),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /start
 * Start a tournament.
 */
router.put("/start", async (req, res, next) => {
    const { tournamentID } = req.body;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        await TournamentService.startTournament(uid, tournamentID);
        return res.status(200).json({
            message: "Tournament started successfully.",
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /getBracket
 * Retrieve the tournament bracket.
 */
router.get("/getBracket", async (req, res, next) => {
    const { tournamentID } = req.query;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request." });
    }
    try {
        const [tournament, thisBracket] =
            await TournamentService.getTournamentBracket(tournamentID);
        return res.status(200).json({
            tournament: makeObjectCamelCase(tournament),
            bracket: makeObjectCamelCase(thisBracket),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /cancel
 * Cancel a tournament.
 */
router.put("/cancel", async (req, res, next) => {
    const { tournamentID } = req.body;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const tournament = await TournamentService.updateTournamentDetails(
            uid,
            tournamentID,
            null,
            null,
            null,
            "Cancelled",
            null
        );
        return res.status(201).json({
            message: "Tournament cancelled",
            tournament: makeObjectCamelCase(tournament),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /delete
 * Delete a tournament.
 */
router.delete("/delete", async (req, res, next) => {
    const { tournamentID } = req.body;
    if (!tournamentID) {
        return res.status(400).json({ message: "Invalid request format." });
    }

    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        await TournamentService.deleteTournament(uid, tournamentID);
        return res.status(200).json({
            message: "Tournament deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /addTeam
 * Add a team to a tournament.
 */
router.post("/addTeam", async (req, res, next) => {
    const { tournamentID, teamID } = req.body;
    if (!tournamentID || !teamID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const teams = await TournamentService.addTournamentParticipant(
            uid,
            tournamentID,
            teamID
        );
        return res.status(201).json({
            message: "Team added to tournament successfully",
            teams,
        });
    } catch (error) {
        if (
            error.message === "Team is already registered for this tournament."
        ) {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
});

/**
 * DELETE /removeTeam
 * Remove a team from a tournament.
 */
router.delete("/removeTeam", async (req, res, next) => {
    const { tournamentID, teamID } = req.body;
    if (!tournamentID || !teamID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        await TournamentService.removeTournamentParticipant(
            uid,
            tournamentID,
            teamID
        );
        return res.status(201).json({
            message: "Team removed from tournament successfully",
        });
    } catch (error) {
        if (error.message === "Team not found in this tournament.") {
            return res.status(200).json({ error: error.message });
        }
        next(error);
    }
});

/**
 * PUT /disqualifyTeam
 * Disqualify a team from a tournament.
 */
router.put("/disqualifyTeam", async (req, res) => {
    const { tournamentID, teamID } = req.body;
    if (!tournamentID || !teamID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        await TournamentService.disqualifyTournamentParticipant(
            uid,
            tournamentID,
            teamID,
            null,
            null,
            "disqualified",
            null,
            null
        );
        return res.status(201).json({
            message: "Team disqualified from tournament successfully",
        });
    } catch (error) {
        if (error.message === "Team not found in this tournament.") {
            return res.status(200).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
});

/**
 * GET /searchParticipatingTeams
 * Search for tournament participants.
 */
router.get("/searchParticipatingTeams", async (req, res, next) => {
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
        return res.status(200).json(makeObjectCamelCase(participant));
    } catch (error) {
        next(error);
    }
});

/**
 * POST /addFacilitator
 * Add a facilitator to a tournament.
 */
router.post("/addFacilitator", async (req, res, next) => {
    const { tournamentID, userID } = req.body;
    if (!tournamentID || !userID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const facilitators = await TournamentService.addTournamentFacilitator(
            uid,
            tournamentID,
            userID
        );
        return res.status(201).json({
            message: "Facilitator added successfully",
            facilitators,
        });
    } catch (error) {
        if (
            error.message === "Facilitator already exists for this tournament."
        ) {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
});

/**
 * POST /removeFacilitator
 * Remove a facilitator from a tournament.
 */
router.post("/removeFacilitator", async (req, res) => {
    const { tournamentID, userID } = req.body;
    if (!tournamentID || !userID) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const facilitators =
            await TournamentService.removeTournamentFacilitator(
                uid,
                tournamentID,
                userID
            );
        return res.status(201).json({
            message: "Facilitator removed successfully",
            facilitators,
        });
    } catch (error) {
        if (error.message === "Facilitator not found in this tournament.") {
            return res.status(200).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
});

/**
 * GET /searchFacilitators
 * Search for tournament facilitators based on query parameters.
 */
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
        return res.status(200).json(makeObjectCamelCase(facilitators));
    } catch (error) {
        next(error);
    }
});

/**
 * GET /searchMatches
 * Search for matches using various query parameters.
 */
router.get("/searchMatches", async (req, res, next) => {
    const {
        matchID,
        tournamentID,
        bracketSide,
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
            bracketSide,
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
        return res.status(200).json(makeObjectCamelCase(matches));
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /setMatchResult
 * Set the result of a match.
 */
router.put("/setMatchResult", async (req, res, next) => {
    const { matchID, score1, score2 } = req.body;
    if (!matchID || !score1) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const match = await TournamentService.updateMatchResult(
            uid,
            matchID,
            score1,
            score2
        );
        return res.status(201).json({
            message: "Match updated successfully",
            match: makeObjectCamelCase(match),
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
