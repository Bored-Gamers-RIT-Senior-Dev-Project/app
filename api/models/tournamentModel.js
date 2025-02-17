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
 * Searches tournaments by one or more optional criteria.
 * If tournamentID is provided (not null), this function returns the single tournament
 * record with that ID. Otherwise, it uses any of the provided parameters (tournamentName,
 * startDate, endDate, status, location) to filter the tournaments.
 * @param {number|null} tournamentID ID for the tournament. If provided, only the tournament with this ID is returned.
 * @param {string|null} tournamentName Name of the tournament.
 * @param {string|null} startDate Start date of the tournament in YYYY-MM-DD format. Returns tournaments starting on or after this date.
 * @param {string|null} endDate End date of the tournament in YYYY-MM-DD format. Returns tournaments ending on or before this date.
 * @param {string|null} status Status of the tournament (e.g., "Upcoming", "Active", etc.).
 * @param {string|null} location The location of the tournament, such as an address or university name.
 * @returns {Promise<object|null|object[]>} Returns a single tournament object if tournamentID is provided, an array of tournament objects
 *                                          matching the search criteria otherwise, or null if no tournaments are found.
 * @throws {Error} Throws an error if the database query fails.
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
        if (tournamentID !== null) {
            const [rows] = await db.query(
                `
                SELECT * 
                FROM Tournaments
                WHERE TournamentID = ?
            `,
                [tournamentID]
            );
            if (rows.length === 0) {
                return null;
            } else if (rows.length > 1) {
                throw Error("Search error for tournament ID: " + tournamentID);
            }
            return rows[0];
        } else {
            let search = "SELECT * FROM Tournaments WHERE 1=1";
            const params = [];

            // Only add a search parameter if the parameter is not null
            if (tournamentName !== null) {
                search += " AND TournamentName = ?";
                params.push(tournamentName);
            }
            if (startDate !== null) {
                search += " AND StartDate >= ?";
                params.push(startDate);
            }
            if (endDate !== null) {
                search += " AND EndDate <= ?";
                params.push(endDate);
            }
            if (status !== null) {
                search += " AND Status = ?";
                params.push(status);
            }
            if (location !== null) {
                search += " AND Location = ?";
                params.push(location);
            }
            console.log("My Search: " + search + params);
            const [rows] = await db.query(search, params);

            if (rows.length === 0) {
                return null;
            }
            return rows;
        }
    } catch (error) {
        console.error("Error searching for tournament:", error.message);
        throw error;
    }
};

/**
 * Creates a match for the tournament in the database.
 */
const createMatch = async (tournamentID, team1ID, team2ID, matchTime) => {
    try {
        const [result] = await db.query(
            `INSERT INTO Matches (tournamentID, team1ID, team2ID, matchTime)
             VALUES (?, ?, ?, ?)`,
            [tournamentID, team1ID, team2ID, matchTime]
        );
        return {
            id: result.insertId,
            tournamentID,
            team1ID,
            team2ID,
            matchTime,
        };
    } catch (error) {
        console.error("Error creating match:", error);
        throw error;
    }
};

/**
 * Search tournament matches from the database.
 */
const searchTournamentMatches = async () => {
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
    createMatch,
    searchTournaments,
    searchTournamentMatches,
    setMatchWinner,
};
