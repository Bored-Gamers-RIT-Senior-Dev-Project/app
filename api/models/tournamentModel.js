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
            `INSERT INTO tournaments (TournamentName, StartDate, EndDate, Status, Location)
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
                FROM tournaments
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
                //Remove the time from query output: "SELECT TournamentID, TournamentName, DATE(StartDate) AS StartDate, DATE(EndDate) AS EndDate, Status, Location FROM tournaments WHERE 1=1";
                "SELECT * FROM tournaments WHERE 1=1";
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

const addTournamentParticipant = async (tournamentID, teamID) => {
    try {
        await db.query(
            `INSERT INTO tournament_participants (TournamentID, TeamID) VALUES (?, ?)`,
            [tournamentID, teamID]
        );
    } catch (error) {
        console.error("Error adding team to tournament:", error);
        throw error;
    }
};

const removeTournamentParticipant = async (tournamentID, teamID) => {
    try {
        await db.query(
            `DELETE FROM tournament_participants WHERE TournamentID = ? AND TeamID = ?`,
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
    nextMatchID,
    bracketOrder
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
            updates.push("Byes = ?");
            params.push(byes);
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
        } else if (nextMatchID == 0) {
            updates.push("NextMatchID = NULL");
        }
        if (bracketOrder) {
            updates.push("BracketOrder = ?");
            params.push(bracketOrder);
        }

        if (updates.length === 0) {
            throw new Error("No params provided for participant update.");
        }

        params.push(tournamentID);
        params.push(teamID);

        const updateQuery = `UPDATE tournament_participants SET ${updates.join(
            ", "
        )} WHERE TournamentID = ? AND TeamID = ?`;
        await db.query(updateQuery, params);
    } catch (error) {
        console.error("Error updating participant:", error);
        throw error.message;
    }
};

const searchTournamentParticipants = async (
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
) => {
    try {
        let searchQuery = `
        SELECT 
            tournament_participants.TeamID,
            tournament_participants.Round AS TeamRound,
            tournament_participants.Byes AS TeamByeCount,
            tournament_participants.Status AS ParticipantStatus,
            tournament_participants.BracketSide AS TeamBracketSide,
            tournament_participants.NextMatchID AS TeamNextMatchID,
            tournament_participants.BracketOrder AS TeamBracketOrder,
            tournament_participants.TournamentID,
            tournaments.TournamentName,
            tournaments.Status AS TournamentStatus,
            teams.TeamName,
            teams.ProfileImageURL AS TeamProfileImageURL,
            teams.TeamLeaderID,
            teams.IsApproved AS TeamApprovalStatus,
            teams.CreatedAt AS TeamCreatedAt,
            CONCAT(users.FirstName, ' ', users.LastName) AS TeamLeaderFullName,
            universities.UniversityName,
            universities.LogoURL AS UniversityLogoURL
            FROM tournament_participants
            JOIN tournaments ON tournament_participants.TournamentID = tournaments.TournamentID
            JOIN teams ON tournament_participants.TeamID = teams.TeamID
            JOIN universities ON teams.UniversityID = universities.UniversityID
            JOIN users ON teams.TeamLeaderID = users.UserID
        WHERE 1=1
      `;
        const params = [];

        if (tournamentID) {
            searchQuery += " AND tournament_participants.TournamentID = ?";
            params.push(tournamentID);
        }
        if (teamID) {
            searchQuery += " AND tournament_participants.TeamID = ?";
            params.push(teamID);
        }
        if (teamLeaderName) {
            searchQuery += " AND users.";
        }
        if (round) {
            searchQuery += " AND tournament_participants.Round = ?";
            params.push(round);
        }
        if (byes) {
            searchQuery += " AND tournament_participants.Byes = ?";
            params.push(byes);
        }
        if (status) {
            searchQuery += " AND tournament_participants.Status = ?";
            params.push(status);
        }
        if (bracketSide) {
            searchQuery += " AND tournament_participants.BracketSide = ?";
            params.push(bracketSide);
        }
        if (nextMatchID) {
            searchQuery += " AND tournament_participants.NextMatchID = ?";
            params.push(nextMatchID);
        }
        if (universityID) {
            searchQuery += " AND teams.UniversityID = ?";
            params.push(universityID);
        }
        if (teamName) {
            searchQuery += " AND teams.TeamName LIKE ?";
            params.push(`%${teamName}%`);
        }
        if (teamLeaderID) {
            searchQuery += " AND teams.TeamLeaderID = ?";
            params.push(teamLeaderID);
        }
        if (isApproved) {
            searchQuery += " AND teams.IsApproved = ?";
            params.push(isApproved);
        }
        if (universityName) {
            searchQuery += " AND users.UniversityName LIKE ?";
            params.push(`%${universityName}%`);
        }
        if (sortBy) {
            console.log("Sorting by ", sortBy);
            searchQuery += " ORDER BY " + sortBy;
        }
        if (sortBy && sortAsDescending) {
            searchQuery += " DESC";
        }
        const [rows] = await db.query(searchQuery, params);
        return rows;
    } catch (error) {
        console.error(
            "Error searching for tournament participants:",
            error.message
        );
        throw error;
    }
};

const addTournamentFacilitator = async (tournamentID, userID) => {
    try {
        const [result] = await db.query(
            `INSERT INTO tournament_facilitators (TournamentID, UserID)
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
            `DELETE FROM tournament_facilitators WHERE TournamentID = ? AND UserID = ?`,
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
            "SELECT users.UserID, CONCAT(users.FirstName, ' ', users.LastName) AS FullName, Email, ProfileImageURL FROM tournament_facilitators JOIN users ON tournament_facilitators.UserID = users.UserID WHERE 1=1";
        const params = [];

        // Only add a search parameter if the parameter is not null
        if (tournamentID) {
            search += " AND TournamentID = ?";
            params.push(tournamentID);
        }
        if (userID) {
            search += " AND users.UserID = ?";
            params.push(userID);
        }
        if (name) {
            search +=
                " AND CONCAT(users.FirstName, ' ', users.LastName) LIKE ?";
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
    status,
    location
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
        if (location) {
            updates.push("Location = ?");
            params.push(location);
        }

        if (updates.length === 0) {
            throw new Error("No params provided for tournament update.");
        }

        params.push(tournamentID);

        const updateQuery = `UPDATE tournaments SET ${updates.join(
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
            `INSERT INTO matches (tournamentID, team1ID, team2ID, matchTime)
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
 * This function retrieves match records from the matches table based on the provided criteria.
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
    bracketSide,
    teamID,
    before,
    after,
    sortBy,
    sortAsDescending,
    round
) => {
    try {
        if (matchID) {
            const [rows] = await db.query(
                `
          SELECT * 
          FROM matches
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
            // Build query using other search criteria
            let search = `
            SELECT
                matches.TournamentID,
                matches.MatchTime,
                matches.Team1ID,
                team1.TeamName,
                matches.Score1,
                matches.Team2ID,
                team2.TeamName,
                matches.Score2,
                CASE 
                WHEN matches.WinnerID IS NULL THEN participant1.Round
                ELSE 
                    CASE 
                    WHEN matches.WinnerID = matches.Team1ID THEN participant2.Round
                    ELSE participant1.Round
                    END
                END AS MatchRound
            FROM matches
            JOIN teams team1 ON matches.Team1ID = team1.TeamID
            JOIN teams team2 ON matches.Team2ID = team2.TeamID
            JOIN tournament_participants participant1 ON matches.TournamentID = participant1.TournamentID AND matches.Team1ID = participant1.TeamID
            JOIN tournament_participants participant2 ON matches.TournamentID = participant2.TournamentID AND matches.Team1ID = participant2.TeamID
            WHERE 1=1
        `;
            const params = [];
            if (tournamentID) {
                search += " AND matches.TournamentID = ?";
                params.push(tournamentID);
            }
            if (teamID) {
                search += " AND (Team1ID = ? OR Team2ID = ?)";
                params.push(teamID, teamID);
            }
            if (before) {
                search += " AND matches.MatchTime <= ?";
                params.push(before);
            }
            if (after) {
                search += " AND matches.MatchTime >= ?";
                params.push(after);
            }
            if (bracketSide) {
                search += " AND participant1.BracketSide = ?";
                params.push(bracketSide);
            }
            if (round) {
                search += " AND matches.MatchRound = ?";
                params.push(round);
            }
            if (sortBy) {
                search += " ORDER BY " + sortBy;
            }
            if (sortBy && sortAsDescending) {
                search += " DESC";
            }
            console.log("Tournament Search Query: " + search, params);
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
        const [result] = await db.query(
            `UPDATE matches SET Score1 = ?, Score2 = ?, WinnerID = ? WHERE MatchID = ?;`,
            [team1Score, team2Score, winnerID, matchID]
        );
    } catch (error) {
        console.error("Error updating match result:", error);
        throw error;
    }
};

module.exports = {
    createTournament,
    searchTournaments,
    updateTournamentDetails,
    addTournamentParticipant,
    removeTournamentParticipant,
    updateTournamentParticipant,
    searchTournamentParticipants,
    addTournamentFacilitator,
    removeTournamentFacilitator,
    searchTournamentFacilitators,
    createMatch,
    searchMatches,
    updateMatchResult,
};
