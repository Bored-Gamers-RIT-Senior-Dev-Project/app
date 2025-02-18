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
            let search =
                //Remove the time from query output: "SELECT TournamentID, TournamentName, DATE(StartDate) AS StartDate, DATE(EndDate) AS EndDate, Status, Location FROM Tournaments WHERE 1=1";
                "SELECT * FROM Tournaments WHERE 1=1";
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
 * Creates a match record for the tournament in the database.
 * @param {number} tournamentID - The ID for the tournament.
 * @param {number} team1ID - Team 1 ID.
 * @param {number} team2ID - Team 2 ID.
 * @param {string} matchTime - The match time in MySQL DATETIME format ("YYYY-MM-DD HH:MM:SS").
 * @returns {Promise<object>} Returns a promise that resolves to the created match object.
 * @throws {Error} Throws an error if the match cannot be created.
 */
const createMatch = async (tournamentID, team1ID, team2ID, matchTime) => {
    try {
        // Execute the INSERT query to create a match record.
        const [result] = await db.query(
            `INSERT INTO Matches (tournamentID, team1ID, team2ID, matchTime)
             VALUES (?, ?, ?, ?)`,
            [tournamentID, team1ID, team2ID, matchTime]
        );
        // Return an object representing the created match.
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
 * Searches tournament matches from the database.
 *
 * This function retrieves match records from the Matches table based on the provided criteria.
 * If a matchID is provided (not null), it returns a single match record (or null if not found).
 * @param {number|null} matchID - ID for the match. When provided, all other criteria are ignored.
 * @param {number|null} tournamentID - ID for the tournament.
 * @param {number|null} teamID - ID for a team. Searches for matches where this team is either team1 or team2.
 * @param {string|null} matchTime - The match time in a format acceptable by the database ("YYYY-MM-DD HH:MM:SS").
 * @returns {Promise<object|null|object[]>}
 *          If matchID is provided, returns a single match object or null if not found.
 *          Otherwise, returns an array of match objects matching the criteria, or null if no matches are found.
 * @throws {Error} Throws an error if multiple matches are found for a given matchID or if a database error occurs.
 */
const searchMatches = async (
    matchID = null,
    tournamentID = null,
    teamID = null,
    matchTime = null
) => {
    try {
        // If a matchID is provided, perform a search based solely on matchID.
        if (matchID !== null) {
            const [rows] = await db.query(
                `
                SELECT * 
                FROM Matches
                WHERE MatchID = ?
                `,
                [matchID]
            );
            if (rows.length === 0) {
                return null;
            } else if (rows.length > 1) {
                throw Error("Search error for match ID: " + matchID);
            }
            return rows[0];
        } else {
            // Build the dynamic SQL query based on provided criteria.
            let search = "SELECT * FROM Matches WHERE 1=1";
            const params = [];

            // Add condition for tournamentID if provided.
            if (tournamentID !== null) {
                search += " AND TournamentID = ?";
                params.push(tournamentID);
            }
            // Add condition for teamID if provided: checks both Team1ID and Team2ID.
            if (teamID !== null) {
                search += " AND (Team1ID = ? OR Team2ID = ?)";
                params.push(teamID, teamID);
            }
            // Add condition for matchTime if provided.
            if (matchTime !== null) {
                search += " AND matchTime = ?";
                params.push(matchTime);
            }
            // Execute the query with the dynamically built conditions.
            const [rows] = await db.query(search, params);

            if (rows.length === 0) {
                return null;
            }
            return rows;
        }
    } catch (error) {
        console.error("Error searching for match:", error.message);
        throw error;
    }
};

/**
 * Sets the winner of a match and updates match results in the database.
 * @param {number} matchID - ID of the match to update.
 * @param {number} winnerID - ID for the winning team.
 * @param {number} team1Score - Score for team one.
 * @param {number} team2Score - Score for team two.
 * @returns {Promise<object>} Returns a promise to an object containing the updated match result.
 * @throws {Error} Throws an error if the update query fails.
 */
const updateMatchResult = async (matchID, winnerID, team1Score, team2Score) => {
    try {
        // Execute the UPDATE query to update the match results.
        const [result] = await db.query(
            `UPDATE Matches SET Score1 = ?, Score2 = ?, WinnerID = ? WHERE MatchID = ?;`,
            [team1Score, team2Score, winnerID, matchID]
        );
        // Return an object representing the updated match.
        return {
            matchID,
            winnerID,
            team1Score,
            team2Score,
        };
    } catch (error) {
        console.error("Error updating match result:", error);
        throw error;
    }
};

module.exports = {
    createTournament,
    searchTournaments,
    createMatch,
    searchMatches,
    updateMatchResult,
};
