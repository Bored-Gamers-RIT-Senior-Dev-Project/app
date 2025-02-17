const TournamentModel = require("../models/tournamentModel");

/**
 * Creates a new tournament in the database.
 */
const createTournament = async (
    tournamentName,
    startDate,
    endDate,
    location
) => {
    try {
        // Create the tournament in the database.
        const tournament = await TournamentModel.createTournament(
            tournamentName,
            startDate,
            endDate,
            "Upcoming",
            location
        );
        return tournament;
    } catch (error) {
        throw error;
    }
};

/**
 * Searches tournaments in database.
 * If tournamentID is specified, all other search terms are ignored.
 * If tournamentID is specified and is not an integer, this function will return error.
 */
const searchTournaments = async (
    tournamentID = null,
    startDate = null,
    endDate = null,
    status = null,
    location = null
) => {
    try {
        if (tournamentID !== null) {
            const id = Number(tournamentID);
            if (!Number.isInteger(id)) {
                const error = new Error(
                    "Invalid tournamentID. Value must be integer."
                );
                error.status = 400;
                throw error;
            }
            const tournament = await TournamentModel.searchTournaments(
                tournamentID,
                null,
                null,
                null,
                null,
                null
            );
            return tournament;
        } else {
            const tournament = await TournamentModel.searchTournaments(
                null,
                tournamentName,
                startDate,
                endDate,
                status,
                location
            );
            return tournament;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Updates the tournament state in the database.
 */
const updateTournament = async () => {
    // TODO: Implement updating tournament state
    throw new Error("Not implemented");
};

/**
 * Creates a match for the tournament in the database.
 */
const createMatch = async () => {
    // TODO: Implement match creation
    throw new Error("Not implemented");
};

/**
 * Read information about tournament matches from the database.
 */
const readTournamentMatches = async () => {
    // TODO: Implement querying tournament matches
    throw new Error("Not implemented");
};

/**
 * Sets the winner of a match in the database.
 */
const setMatchWinner = async () => {
    // TODO: Implement setting match results
    throw new Error("Not implemented");
};

/**
 * Inserts new matches for the next round into the database.
 */
const nextRound = async () => {
    // TODO: Implement adding matches to next round of tournament
    throw new Error("Not implemented");
};

module.exports = {
    createTournament,
    searchTournaments,
    updateTournament,
    createMatch,
    readTournamentMatches,
    setMatchWinner,
    nextRound,
};
