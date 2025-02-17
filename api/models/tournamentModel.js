const db = require("../config/db");

/**
 * Creates a new tournament in the database.
 * @param {string} tournamentName Name of the tournament.
 * @param {string} startDate Start date of tournament in YYYY-MM-DD format.
 * @param {string} endDate End date of tournament in YYYY-MM-DD format.
 * @param {string} status Status of the tournament. Should always be "Upcoming" when creating a tournament.
 * @param {string} location The location of the tournament. Likely an address or university name.
 * @returns {Promise<object>} Returns the created tournament record.
 * @throws {Error} Error if the tournament cannot be inserted into the database.
 */
const createTournament = async (
    tournamentName,
    startDate,
    endDate,
    status,
    location
) => {
    try {
        const [result] = await db.query(
            `INSERT INTO Tournaments (TournamentName, StartDate, EndDate, Status, Location)
             VALUES (?, ?, ?, ?, ?)`,
            [tournamentName, startDate, endDate, status, location]
        );
        return {
            id: result.insertId,
            tournamentName,
            startDate,
            endDate,
            status,
            location,
        };
    } catch (error) {
        console.error("Error creating tournament:", error);
        throw error;
    }
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
    // TODO: Implement settings match results
    throw new Error("Not implemented");
};

/**
 * Inserts new matches for the next round into the database.
 */
const insertNextRoundMatches = async () => {
    // TODO: Implement adding matches to next round of tournament
    throw new Error("Not implemented");
};

module.exports = {
    createTournament,
    readTournament,
    updateTournament,
    createMatch,
    readTournamentMatches,
    setMatchWinner,
    insertNextRoundMatches,
};
