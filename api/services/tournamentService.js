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
        const userRoleIDnum = Number(userRoleID);
        // Validate that the roleID is an integer.
        if (!Number.isInteger(userRoleIDnum)) {
            const error = new Error(
                "Invalid user role. Value must be integer."
            );
            error.status = 400;
            throw error;
        }
        // Check if the user has an authorized role (2=SuperAdmin or 3=AdminEmployee).
        if (userRoleIDnum !== 2 && userRoleIDnum !== 3) {
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
 * @param {number|string} tournamentID - The tournament ID.
 * @param {number|string} team1ID - Team 1 ID.
 * @param {number|string} team2ID - Team 2 ID.
 * @param {string} matchTime - The match time as an ISO 8601 string ("2025-02-17T00:00:00Z").
 * @returns {Promise<object>} Returns a promise that resolves to the created match record.
 * @throws {Error} Throws an error with status 400 if any of the IDs are not valid integers, or if the match cannot be created.
 */
const createMatch = async (tournamentID, team1ID, team2ID, matchTime) => {
    try {
        // Convert the provided IDs to numbers.
        const tournamentIDInt = Number(tournamentID);
        const team1IDInt = Number(team1ID);
        const team2IDInt = Number(team2ID);
        // Validate that the tournamentID is an integer.
        if (!Number.isInteger(tournamentIDInt)) {
            const error = new Error(
                "Invalid tournamentID. Value must be integer."
            );
            error.status = 400;
            throw error;
        }
        // Validate that both team1ID and team2ID are integers.
        if (!Number.isInteger(team1IDInt) || !Number.isInteger(team2IDInt)) {
            const error = new Error(
                "Invalid team IDs. Both team1ID and team2ID must be integers."
            );
            error.status = 400;
            throw error;
        }
        // Convert matchTime from an ISO 8601 string to MySQL DATETIME format ("YYYY-MM-DD HH:MM:SS").
        const formattedMatchTime = new Date(matchTime)
            .toISOString() // Converts to "2025-02-17T00:00:00.000Z"
            .slice(0, 19) // Trims to "2025-02-17T00:00:00"
            .replace("T", " "); // Replaces the "T" with a space
        // TODO:
        // - Validate that the tournamentID exists.
        // - Validate matchTime
        // - Validate that matchTime is greater than the tournament's StartTime.
        // - Validate that team1ID and team2ID are associated with teams in the tournament.
        const match = await TournamentModel.createMatch(
            tournamentIDInt,
            team1IDInt,
            team2IDInt,
            formattedMatchTime
        );
        return match;
    } catch (error) {
        // Propagate any errors encountered.
        throw error;
    }
};

/**
 * Search information about tournament matches from the database.
 */
const searchMatches = async (
    matchID = null,
    tournamentID = null,
    teamID = null,
    matchTime = null
) => {
    try {
        // If matchID is provided, use it exclusively for the search.
        if (matchID !== null) {
            // Convert the matchID to a number for validation.
            const id = Number(matchID);
            // Check if the conversion results in an integer.
            if (!Number.isInteger(id)) {
                const error = new Error(
                    "Invalid matchID. Value must be integer."
                );
                error.status = 400;
                throw error;
            }
            const match = await TournamentModel.searchMatches(
                matchID,
                null,
                null,
                null
            );
            return match;
        } else {
            // When matchID is null, build search query based on other criteria.
            const match = await TournamentModel.searchMatches(
                null,
                tournamentID,
                teamID,
                matchTime
            );
            return match;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Sets the winner of a match in the database.
 */
const updateMatchResult = async (matchID, winnerID, Score1, Score2) => {
    try {
        // Convert the provided params to numbers.
        const matchIDInt = Number(matchID);
        const winnerIDInt = Number(winnerID);
        const Score1Int = Number(Score1);
        const Score2Int = Number(Score2);
        // Validate that the matchID is an integer.
        if (!Number.isInteger(matchIDInt)) {
            const error = new Error("Invalid matchID. Value must be integer.");
            error.status = 400;
            throw error;
        }
        // Validate that the winnerID is an integer.
        if (!Number.isInteger(winnerIDInt)) {
            const error = new Error("Invalid winnerID. Value must be integer.");
            error.status = 400;
            throw error;
        }
        // Validate that both team1ID and team2ID are integers.
        if (!Number.isInteger(Score1Int) || !Number.isInteger(Score2Int)) {
            const error = new Error(
                "Invalid score. Both scores must be integers."
            );
            error.status = 400;
            throw error;
        }
        // TODO:
        // - Validate matchID exists
        const match = await TournamentModel.updateMatchResult(
            matchIDInt,
            winnerIDInt,
            Score1Int,
            Score2Int
        );
        return match;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTournament,
    searchTournaments,
    updateTournament,
    createMatch,
    searchMatches,
    updateMatchResult,
};
