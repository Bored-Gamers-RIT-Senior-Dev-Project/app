const db = require("../config/db");

/**
 * Creates a new tournament in the database.
 * @param {string} tournamentName - Name of the tournament.
 * @param {string} startDate - Start date of tournament in YYYY-MM-DD format.
 * @param {string} endDate - End date of tournament in YYYY-MM-DD format.
 * @param {string} location - The location of the tournament. Likely an address or university name.
 * @returns {Promise<object>} Returns the created tournament record.
 * @throws {Error} Throws an error if the tournament cannot be inserted into the database.
 */
const createTournament = async (
    tournamentName,
    startDate,
    endDate,
    location
) => {
    try {
        const [result] = await db.query(
            `INSERT INTO tournaments (TournamentName, StartDate, EndDate, Status, Location)
             VALUES (?, ?, ?, ?, ?)`,
            [tournamentName, startDate, endDate, "Upcoming", location]
        );
        return {
            id: result.insertId,
            tournamentName,
            startDate,
            endDate,
            status: "Upcoming",
            location,
        };
    } catch (error) {
        console.error("Error creating tournament:", error);
        throw error;
    }
};

/**
 * Searches tournaments by one or more optional criteria.
 * If tournamentID is defined, this function returns the tournament record with that ID.
 * Otherwise, it uses any of the provided parameters to filter the tournaments.
 * @param {number} [tournamentID] - ID for the tournament. If provided, only the tournament with this ID is returned.
 * @param {string} [tournamentName] - Name of the tournament.
 * @param {string} [startDate] - Start date of the tournament in YYYY-MM-DD format.
 * @param {string} [endDate] - End date of the tournament in YYYY-MM-DD format.
 * @param {string} [startsBefore] - Returns tournaments starting on or before this date.
 * @param {string} [startsAfter] - Returns tournaments starting on or after this date.
 * @param {string} [endsBefore] - Returns tournaments ending on or before this date.
 * @param {string} [endsAfter] - Returns tournaments ending on or after this date.
 * @param {string} [status] - Status of the tournament (e.g., "Upcoming", "Active", etc.).
 * @param {string} [location] - The location of the tournament.
 * @param {string} [sortBy] - Field to sort the results by.
 * @param {boolean} [sortAsDescending] - If true, sorts the results in descending order.
 * @returns {Promise<object[]>} Returns an array of tournament objects. Returns an empty array if no tournaments are found.
 * @throws {Error} Throws an error if the database query fails.
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
                `SELECT * 
                 FROM tournaments
                 WHERE TournamentID = ?`,
                [tournamentID]
            );
            if (rows.length === 0) {
                return [];
            } else if (rows.length > 1) {
                throw Error("Search error for tournament ID: " + tournamentID);
            }
            return rows; // Always return an array.
        } else {
            let search = "SELECT * FROM tournaments WHERE 1=1";
            const params = [];

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

            const [rows] = await db.query(search, params);
            return rows; // rows will be an empty array if no records were found.
        }
    } catch (error) {
        console.error("Error searching for tournament:", error.message);
        throw error;
    }
};

/**
 * Adds a participant to a tournament.
 * @param {number} tournamentID - ID of the tournament.
 * @param {number} teamID - ID of the team to add.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the operation fails.
 */
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

/**
 * Removes a participant from a tournament.
 * @param {number} tournamentID - ID of the tournament.
 * @param {number} teamID - ID of the team to remove.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the operation fails.
 */
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

// Define enums using frozen objects.
const MatchStatus = Object.freeze({
    ACTIVE: "active",
    LOST: "lost",
    WINNER: "winner",
    DISQUALIFIED: "disqualified",
});

const BracketSide = Object.freeze({
    LEFT: "left",
    RIGHT: "right",
});

/**
 * Updates a tournament participant's details.
 * @param {number} tournamentID - ID of the tournament.
 * @param {number} teamID - ID of the team.
 * @param {number} [round] - The current round for the team.
 * @param {number} [byes] - Number of byes awarded.
 * @param {"active"|"lost"|"winner"|"disqualified"} [status] - Current status.
 * @param {"left"|"right"} [bracketSide] - The side of the bracket.
 * @param {number} [nextMatchID] - ID of the next match.
 * @param {number} [bracketOrder] - Order in the bracket.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if no parameters are provided or if the update fails.
 */
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

        if (round) {
            updates.push("Round = ?");
            params.push(round);
        }
        if (byes === 0 || byes) {
            updates.push("Byes = ?");
            params.push(byes);
        }
        if (status) {
            if (!Object.values(MatchStatus).includes(status)) {
                throw new Error(
                    `Invalid status: ${status}. Valid statuses are: ${Object.values(
                        MatchStatus
                    ).join(", ")}.`
                );
            }
            updates.push("Status = ?");
            params.push(status);
        }
        if (bracketSide) {
            if (!Object.values(BracketSide).includes(bracketSide)) {
                throw new Error(
                    `Invalid bracketSide: ${bracketSide}. Valid values are: ${Object.values(
                        BracketSide
                    ).join(", ")}.`
                );
            }
            updates.push("BracketSide = ?");
            params.push(bracketSide);
        }
        if (nextMatchID === -1) {
            updates.push("NextMatchID = NULL");
        } else if (nextMatchID === 0) {
            updates.push("NextMatchID = 0");
            params.push(nextMatchID);
        } else if (nextMatchID) {
            updates.push("NextMatchID = ?");
            params.push(nextMatchID);
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

/**
 * Searches tournament participants based on various criteria.
 * @param {number|null} tournamentID - ID of the tournament.
 * @param {number|null} teamID - ID of the team.
 * @param {string|null} teamName - Name of the team (supports partial match).
 * @param {number|null} teamLeaderID - ID of the team leader.
 * @param {string|null} teamLeaderName - Name of the team leader.
 * @param {number|null} round - The current round for the participant.
 * @param {number|null} byes - Number of byes awarded.
 * @param {string|null} status - Status of the participant.
 * @param {string|null} bracketSide - Bracket side ("left" or "right").
 * @param {number|null} nextMatchID - ID of the next match.
 * @param {number|null} universityID - ID of the university.
 * @param {string|null} universityName - Name of the university (supports partial match).
 * @param {boolean|null} isApproved - Approval status of the team.
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {boolean} sortAsDescending - If true, sorts results in descending order.
 * @returns {Promise<object[]|null>} Returns an array of participant records or null if none found.
 * @throws {Error} Throws an error if the search query fails.
 */
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
            searchQuery += " AND users.TeamLeaderFullName = ?";
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
        if (nextMatchID === 0 || nextMatchID) {
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

/**
 * Adds a facilitator to a tournament.
 * @param {number} tournamentID - ID of the tournament.
 * @param {number} userID - ID of the facilitator user.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the operation fails.
 */
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

/**
 * Removes a facilitator from a tournament.
 * @param {number} tournamentID - ID of the tournament.
 * @param {number} userID - ID of the facilitator user.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the operation fails.
 */
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

/**
 * Searches tournament facilitators based on provided criteria.
 * @param {number|null} tournamentID - ID of the tournament.
 * @param {number|null} userID - ID of the facilitator user.
 * @param {string|null} name - Facilitator's full or partial name.
 * @param {string|null} email - Facilitator's email address.
 * @param {number|null} universityID - ID of the university.
 * @returns {Promise<object[]|null>} Returns an array of facilitator records or null if none found.
 * @throws {Error} Throws an error if the query fails.
 */
const searchTournamentFacilitators = async (
    tournamentID,
    userID,
    name,
    email,
    universityID
) => {
    try {
        let search =
            "SELECT users.UserID, CONCAT(users.FirstName, ' ', users.LastName) AS FullName, Email, ProfileImageURL FROM tournament_facilitators JOIN users ON tournament_facilitators.UserID = users.UserID WHERE 1=1";
        const params = [];

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
        const [rows] = await db.query(search, params);
        return rows;
    } catch (error) {
        console.error("Error searching for facilitator(s):", error.message);
        throw error;
    }
};

/**
 * Updates tournament details.
 * @param {number} tournamentID - ID of the tournament to update.
 * @param {string|null} tournamentName - New tournament name.
 * @param {string|null} startDate - New start date in YYYY-MM-DD format.
 * @param {string|null} endDate - New end date in YYYY-MM-DD format.
 * @param {string|null} status - New status (e.g., "Upcoming", "Active").
 * @param {string|null} location - New location for the tournament.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if no update parameters are provided or if the update fails.
 */
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

const deleteTournament = async (tournamentID) => {
    const conn = await db.getConnection(); // assuming you're using a pool
    try {
        await conn.beginTransaction();

        // Delete dependent rows in other tables
        await conn.query(
            `DELETE FROM tournament_participants WHERE TournamentID = ?`,
            [tournamentID]
        );
        await conn.query(`DELETE FROM matches WHERE TournamentID = ?`, [
            tournamentID,
        ]);
        await conn.query(
            `DELETE FROM tournament_facilitators WHERE TournamentID = ?`,
            [tournamentID]
        );

        // Delete the tournament
        await conn.query(`DELETE FROM tournaments WHERE TournamentID = ?`, [
            tournamentID,
        ]);

        await conn.commit();
    } catch (error) {
        await conn.rollback();
        console.error("Error deleting tournament:", error);
        throw error;
    } finally {
        conn.release();
    }
};

/**
 * Creates a match record for the tournament in the database.
 * @param {number} tournamentID - The tournament ID.
 * @param {number} team1ID - Team 1 ID.
 * @param {number} team2ID - Team 2 ID.
 * @param {string} matchTime - The match time in MySQL DATETIME format ("YYYY-MM-DD HH:MM:SS").
 * @returns {Promise<object>} Returns the created match object.
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
 * If matchID is provided, returns a single match record; otherwise, returns an array of matches.
 * @param {number|null} matchID - ID for the match. When provided, all other criteria are ignored.
 * @param {number|null} tournamentID - ID for the tournament.
 * @param {string|null} bracketSide - Bracket side filter.
 * @param {number|null} teamID - ID for a team.
 * @param {string|null} before - Matches before this datetime ("YYYY-MM-DD HH:MM:SS").
 * @param {string|null} after - Matches after this datetime ("YYYY-MM-DD HH:MM:SS").
 * @param {string|null} sortBy - Field to sort the results by.
 * @param {boolean|null} sortAsDescending - If true, sorts the results by descending order.
 * @param {number|null} round - Round number to filter matches.
 * @returns {Promise<object|null|object[]>} Returns a match object, an array of match objects, or null if not found.
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
            let search = `
                SELECT *
                FROM (
                    SELECT
                        matches.MatchID,
                        matches.TournamentID,
                        matches.MatchTime,
                        matches.Team1ID,
                        team1.TeamName AS Team1Name,
                        team1.ProfileImageURL as Team1ProfileImageURL,
                        matches.Score1,
                        matches.Team2ID,
                        team2.TeamName AS Team2Name,
                        team2.ProfileImageURL as Team2ProfileImageURL,
                        matches.Score2,
                        matches.WinnerID,
                        participant1.BracketSide AS BracketSide,
                        participant1.BracketOrder AS BracketOrder,
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
                    JOIN tournament_participants participant1 
                        ON matches.TournamentID = participant1.TournamentID 
                        AND matches.Team1ID = participant1.TeamID
                    JOIN tournament_participants participant2 
                        ON matches.TournamentID = participant2.TournamentID 
                        AND matches.Team2ID = participant2.TeamID
                ) AS sub
                WHERE 1=1
            `;

            const params = [];
            if (tournamentID) {
                search += " AND sub.TournamentID = ?";
                params.push(tournamentID);
            }
            if (teamID) {
                search += " AND (sub.Team1ID = ? OR sub.Team2ID = ?)";
                params.push(teamID, teamID);
            }
            if (before) {
                search += " AND sub.MatchTime <= ?";
                params.push(before);
            }
            if (after) {
                search += " AND sub.MatchTime >= ?";
                params.push(after);
            }
            if (bracketSide) {
                search += " AND sub.BracketSide = ?";
                params.push(bracketSide);
            }
            if (round) {
                search += " AND sub.MatchRound = ?";
                params.push(round);
            }
            if (sortBy) {
                search += ` ORDER BY sub.${sortBy}`;
                if (sortAsDescending) {
                    search += " DESC";
                }
            }

            const [rows] = await db.query(search, params);
            return rows.length === 0 ? null : rows;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Sets the winner of a match and updates the match result in the database.
 * @param {number} matchID - ID of the match to update.
 * @param {number} winnerID - ID for the winning team.
 * @param {number} team1Score - Score for team one.
 * @param {number} team2Score - Score for team two.
 * @returns {Promise<object>} Returns the updated match result.
 * @throws {Error} Throws an error if the update fails.
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
    deleteTournament,
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
