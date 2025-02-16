const TournamentModel = require("../models/tournamentModel");
const { Tournament } = require("tournament-organizer");

/**
 * Creates a new tournament in the database.
 */
const createTournament = async () => {
    // TODO: Implement tournament creation
    throw new Error("Not implemented");
};

/**
 * Read basic information about a tournament from the database by ID.
 */
const readTournament = async () => {
    // TODO: Implement querying tournament info
    throw new Error("Not implemented");
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
    readTournament,
    updateTournament,
    createMatch,
    setMatchWinner,
    nextRound,
};
