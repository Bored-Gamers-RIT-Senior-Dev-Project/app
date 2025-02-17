const TournamentModel = require("../models/tournamentModel");

/**
 * Safely decodes a URI-encoded string.
 * @param {string|null|undefined} value - The URI-encoded string to decode.
 * @returns {string|null} The decoded string, or null if the input is null or undefined.
 */
const safeDecode = (value) => {
    return value !== null && value !== undefined
        ? decodeURIComponent(value)
        : null;
};

/**
 * Creates a new tournament in the database with the status of "Upcoming".
 * This function validates the user role to ensure that only authorized users (with roleID 2 or 3).
 * @param {string} tournamentName - Name of the tournament.
 * @param {string} startDate - Start date of the tournament in YYYY-MM-DD format.
 * @param {string} endDate - End date of the tournament in YYYY-MM-DD format.
 * @param {string} location - The location of the tournament (likely an address or university name).
 * @param {string|number} userRoleID - The role ID of the user attempting to create the tournament.
 * @returns {Promise<object>} Returns a promise that resolves to the created tournament record.
 * @throws {Error} Throws an error with status 400 if userRoleID is not an integer, or with status 401 if the role is unauthorized.
 */
const createTournament = async (
    tournamentName,
    startDate,
    endDate,
    location,
    userRoleID
) => {
    try {
        // Convert userRoleID to a number.
        const roleID = Number(userRoleID);
        // Validate that the roleID is an integer.
        if (!Number.isInteger(roleID)) {
            const error = new Error(
                "Invalid user role. Value must be integer."
            );
            error.status = 400;
            throw error;
        }
        // Check if the user has an authorized role (2 or 3).
        if (roleID !== 2 && roleID !== 3) {
            const error = new Error(
                "Unauthorized. Invalid userRoleID for tournament creation."
            );
            error.status = 401;
            throw error;
        }
        // Call the model to create the tournament with status "Upcoming".
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
 * Searches tournaments in the database based on provided parameters.
 * If tournamentID is specified (not null), all other search parameters are ignored and the function
 * returns a single tournament record. If tournamentID is provided but is not a valid integer, an error
 * with a 400 status is thrown. If tournamentID is null, the function searches based on the other criteria
 * @param {number|string|null} tournamentID - Tournament ID. Solely used for search if value is provided.
 * @param {string|null} tournamentName - Name of the tournament.
 * @param {string|null} startDate - Start date in YYYY-MM-DD format.
 * @param {string|null} endDate - End date in YYYY-MM-DD format.
 * @param {string|null} status - Tournament status.
 * @param {string|null} location - Location of the tournament (address or university name).
 * @returns {Promise<object|object[]|null>}
 *          If tournamentID is specified, returns a single tournament object or null if not found.
 *          Otherwise, returns an array of tournament objects that match the criteria, or null if none are found.
 * @throws {Error} Throws an error if tournamentID is provided and is not a valid integer, or if the query fails.
 */
const searchTournaments = async (
    tournamentID = null,
    tournamentName = null,
    startDate = null,
    endDate = null,
    status = null,
    location = null
) => {
    try {
        // If tournamentID is provided, use it exclusively for the search.
        if (tournamentID !== null) {
            // Convert the tournamentID to a number for validation.
            const id = Number(tournamentID);
            // Check if the conversion results in an integer.
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
            // When tournamentID is null, build search query based on other criteria.
            const tournament = await TournamentModel.searchTournaments(
                null,
                safeDecode(tournamentName),
                startDate,
                endDate,
                status,
                safeDecode(location)
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
