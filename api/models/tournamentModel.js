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
 * @param {string|null} startDate Start date of the tournament in YYYY-MM-DD format. Returns tournaments starting on this date.
 * @param {string|null} endDate End date of the tournament in YYYY-MM-DD format. Returns tournaments ending on this date.
 * @param {string|null} startsBefore - Start date of the tournament in YYYY-MM-DD format. Returns tournaments starting on or before this date.
 * @param {string|null} startsAfter - Start date of the tournament in YYYY-MM-DD format. Returns tournaments starting on or after this date.
 * @param {string|null} endsBefore - End date of the tournament in YYYY-MM-DD format. Returns tournaments ending on or before this date.
 * @param {string|null} endsAfter - End date of the tournament in YYYY-MM-DD format. Returns tournaments ending on or after this date.
 * @param {string|null} status Status of the tournament (e.g., "Upcoming", "Active", etc.).
 * @param {string|null} location The location of the tournament, such as an address or university name.
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {boolean} sortAsDescending - If true, sorts the results by DESCENDING. Defaults to ASCENDING.
 * @throws {Error} Throws an error if the database update fails.
 */
const searchTournaments = async (
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
) => {
    try {
        if (tournamentID) {
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
            if (tournamentName) {
                search += " AND TournamentName = ?";
                params.push(tournamentName);
            }
            if (startDate) {
                search += " AND StartDate = ?";
                params.push(startDate);
            }
            if (endDate) {
                search += " AND EndDate = ?";
                params.push(endDate);
            }
            if (startsBefore) {
                search += " AND StartDate <= ?";
                params.push(startsBefore);
            }
            if (startsAfter) {
                search += " AND StartDate >= ?";
                params.push(startsAfter);
            }
            if (endsBefore) {
                search += " AND EndDate <= ?";
                params.push(endsBefore);
            }
            if (endsAfter) {
                search += " AND EndDate >= ?";
                params.push(endsAfter);
            }
            if (status) {
                search += " AND Status = ?";
                params.push(status);
            }
            if (location) {
                search += " AND Location = ?";
                params.push(location);
            }
            if (sortBy) {
                search += " ORDER BY " + sortBy;
            }
            if (sortBy && sortAsDescending) {
                search += " DESC";
            }
            console.log("Tournament Search Query: " + search + params);
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

const addTournamentParticipants = async (tournamentID, teamID) => {
    try {
        await db.query(
            `INSERT INTO TournamentParticipants (TournamentID, TeamID) VALUES (?, ?)`,
            [tournamentID, teamID]
        );
    } catch (error) {
        console.error("Error adding team to tournament:", error);
        throw error;
    }
};

const removeTournamentParticipants = async (tournamentID, teamID) => {
    try {
        await db.query(
            `DELETE FROM TournamentParticipants WHERE TournamentID = ? AND TeamID = ?`,
            [tournamentID, teamID]
        );
    } catch (error) {
        console.error("Error removing team from tournament:", error);
        throw error;
    }
};

const updateTournamentParticipant = async (
    tournamentID,
    teamID,
    round,
    byes,
    status,
    bracketSide,
    nextMatchID
) => {
    try {
        let updates = [];
        let params = [];

        if (tournamentID) {
            updates.push("TournamentID = ?");
            params.push(tournamentID);
        }
        if (teamID) {
            updates.push("TeamID = ?");
            params.push(teamID);
        }
        if (round) {
            updates.push("Round = ?");
            params.push(round);
        }
        if (byes) {
            updates.push("Status = ?");
            params.push(status);
        }
        if (status) {
            updates.push("Status = ?");
            params.push(status);
        }
        if (bracketSide) {
            updates.push("BracketSide = ?");
            params.push(bracketSide);
        }
        if (nextMatchID) {
            updates.push("NextMatchID = ?");
            params.push(nextMatchID);
        }

        if (updates.length === 0) {
            throw new Error("No params provided for tournament update.");
        }

        params.push(tournamentID);
        params.push(teamID);

        const updateQuery = `UPDATE TournamentParticipants SET ${updates.join(
            ", "
        )} WHERE TournamentID = ? AND TeamID = ?`;
        await db.query(updateQuery, params);
    } catch (error) {
        console.error("Error updating participant:", error);
        throw error.message;
    }
};

const addTournamentFacilitator = async (tournamentID, userID) => {
    try {
        const [result] = await db.query(
            `INSERT INTO TournamentFacilitators (TournamentID, UserID)
             VALUES (?, ?)`,
            [tournamentID, userID]
        );
    } catch (error) {
        console.error("Error assigning tournament facilitator:", error);
        throw error;
    }
};

const removeTournamentFacilitator = async (tournamentID, userID) => {
    try {
        await db.query(
            `DELETE FROM TournamentFacilitators WHERE TournamentID = ? AND UserID = ?`,
            [tournamentID, userID]
        );
    } catch (error) {
        console.error("Error removing tournament facilitator:", error);
        throw error;
    }
};

const searchTournamentFacilitators = async (
    tournamentID,
    userID,
    name,
    email,
    universityID
) => {
    try {
        console.log("Setting params");
        let search =
            "SELECT Users.UserID, CONCAT(Users.FirstName, ' ', Users.LastName) AS FullName, Email, ProfileImageURL FROM TournamentFacilitators JOIN Users ON TournamentFacilitators.UserID = Users.UserID WHERE 1=1";
        const params = [];

        // Only add a search parameter if the parameter is not null
        if (tournamentID) {
            search += " AND TournamentID = ?";
            params.push(tournamentID);
        }
        if (userID) {
            search += " AND Users.UserID = ?";
            params.push(userID);
        }
        if (name) {
            search +=
                " AND CONCAT(Users.FirstName, ' ', Users.LastName) LIKE ?";
            params.push(`%${name}%`);
        }
        if (email) {
            search += " AND Email LIKE ?";
            params.push(`%${email}%`);
        }
        if (universityID) {
            search += " AND UniversityID = ?";
            params.push(universityID);
        }
        console.log("Tournament Search Query: " + search + params);
        const [rows] = await db.query(search, params);
        return rows;
    } catch (error) {
        console.error("Error searching for facilitator(s):", error.message);
        throw error;
    }
};

const updateTournamentDetails = async (
    tournamentID,
    tournamentName,
    startDate,
    endDate,
    status
) => {
    try {
        let updates = [];
        let params = [];

        if (tournamentName) {
            updates.push("TournamentName = ?");
            params.push(tournamentName);
        }
        if (startDate) {
            updates.push("StartDate = ?");
            params.push(startDate);
        }
        if (endDate) {
            updates.push("EndDate = ?");
            params.push(endDate);
        }
        if (status) {
            updates.push("Status = ?");
            params.push(status);
        }

        if (updates.length === 0) {
            throw new Error("No params provided for tournament update.");
        }

        params.push(tournamentID);

        const updateQuery = `UPDATE Tournaments SET ${updates.join(
            ", "
        )} WHERE TournamentID = ?`;
        await db.query(updateQuery, params);
    } catch (error) {
        console.error("Error updating tournament:", error);
        throw error.message;
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
 * Searches tournament matches from the database.
 *
 * This function retrieves match records from the Matches table based on the provided criteria.
 * If a matchID is provided (not null), it returns a single match record (or null if not found).
 * @param {number|null} matchID - ID for the match. When provided, all other criteria are ignored.
 * @param {number|null} tournamentID - ID for the tournament.
 * @param {number|null} teamID - ID for a team. Searches for matches where this team is either team1 or team2.
 * @param {string|null} before - Search for matches before this time in a format acceptable by the database ("YYYY-MM-DD HH:MM:SS").
 * @param {string|null} after - Search for matches after this time in a format acceptable by the database ("YYYY-MM-DD HH:MM:SS").
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {boolean|null} sortAsDescending - If true, sorts the results by DESCENDING. Defaults to ASCENDING.
 * @returns {Promise<object|null|object[]>}
 *          If matchID is provided, returns a single match object or null if not found.
 *          Otherwise, returns an array of match objects matching the criteria, or null if no matches are found.
 * @throws {Error} Throws an error if multiple matches are found for a given matchID or if a database error occurs.
 */
const searchMatches = async (
    matchID,
    tournamentID,
    teamID,
    before,
    after,
    sortBy,
    sortAsDescending
) => {
    try {
        console.log("Before: " + before + " and After: " + after);
        // If a matchID is provided, perform a search based solely on matchID.
        if (matchID) {
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
            // If matchID is not set, build query using other search criteria
            let search = "SELECT * FROM Matches WHERE 1=1";
            const params = [];
            if (tournamentID) {
                search += " AND TournamentID = ?";
                params.push(tournamentID);
            }
            if (teamID) {
                search += " AND (Team1ID = ? OR Team2ID = ?)";
                params.push(teamID, teamID);
            }
            if (before) {
                search += " AND matchTime <= ?";
                params.push(before);
            }
            if (after) {
                search += " AND matchTime >= ?";
                params.push(after);
            }
            if (sortBy) {
                search += " ORDER BY " + sortBy;
            }
            if (sortBy && sortAsDescending) {
                search += " DESC";
            }
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
    updateTournamentDetails,
    addTournamentParticipants,
    removeTournamentParticipants,
    updateTournamentParticipant,
    addTournamentFacilitator,
    removeTournamentFacilitator,
    searchTournamentFacilitators,
    createMatch,
    searchMatches,
    updateMatchResult,
};
