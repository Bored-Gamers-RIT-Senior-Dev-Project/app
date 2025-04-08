const db = require("../config/db");

/**
 * Gets a team by its teamID
 * @param {number} teamId The team's ID in the database
 * @returns {object} The team columns if found, null if no team is found
 */
const getTeam = async (teamId) => {
    const sql = `SELECT 
    t.TeamID AS id,
    t.TeamName AS teamName,
    t.ProfileImageURL AS profileImageUrl,
    t.UniversityID AS universityId,
    u.UniversityName AS universityName,
    t.Description AS description,
    t.CreatedAt AS createdAt,
    COUNT(DISTINCT teamMember.UserID) AS members,
    CONCAT(captain.FirstName, ' ', captain.LastName) AS captainName,
    captain.Email AS captainEmail,
    captain.UserId AS captainId
FROM
    teams t
        JOIN
    users captain ON captain.UserID = t.TeamLeaderID
        JOIN
    users teamMember ON teamMember.TeamID = t.TeamId
        JOIN
    universities u ON t.UniversityID = u.UniversityID
    WHERE t.TeamID = ?`;
    const [rows] = await db.query(sql, [teamId]);
    if (rows.length < 1) {
        return null;
    }

    return rows[0];
};

/**
 * Gets a list of all team members
 * @param {number} teamId Team's ID
 * @param {boolean} showUnapproved If members who haven't been confirmed by a University ID should be allowed.
 * @returns {List<object>} List of users with the correct teamID.
 */
const getMembers = async (teamId, showUnapproved) => {
    const sql = `
        SELECT * FROM users WHERE TeamId = ?
    `;
    const [rows] = await db.query(sql, [teamId]);

    return rows;
};

/**
 * Searches for teams based on the search term.
 *
 * @param {string} teamName - The team name to search for.
 * @param {string} universityName - the University Name to search for.  Default to null.
 * @param {boolean} partial - If partial matches should be included.  Defaults to true.
 * @param {boolean} approvedOnly - If only approved entries should be listed in the result.  Defaults to true.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchTeams = async (
    teamName,
    universityName = null,
    partial = true,
    approvedOnly = true
) => {
    let sql = `
        SELECT 
            t.TeamID AS Id, 
            t.TeamName,
            t.ProfileImageURL,
            t.Description,
            u.UniversityName,
            'Team' AS Type
        FROM teams t
        JOIN universities u ON t.UniversityID = u.UniversityID
        WHERE 
            (t.TeamName LIKE ?`;
    const fieldPacket = [partial ? `%${teamName}%` : teamName];
    if (universityName) {
        fieldPacket.push(partial ? `%${universityName}%` : universityName);
        sql += ` OR u.UniversityName LIKE ?)`;
    } else sql += ")";
    if (approvedOnly) {
        sql += " AND t.IsApproved = true";
    }

    const teamQuery = await db.query(sql, fieldPacket);

    return teamQuery[0];
};

/**
 * Gets a list of teams from the database
 * @param {boolean} [approvedOnly=true] Determines if the query should only return teams approved by a University Rep.
 * @returns The team list
 */
const getTeams = async (approvedOnly = true) => {
    const sql = `SELECT 
    t.TeamID AS id,
    t.TeamName AS teamName,
    t.ProfileImageURL AS profileImageUrl,
    t.UniversityID AS universityId,
    u.UniversityName AS universityName,
    t.Description AS description,
    t.CreatedAt AS createdAt,
    COUNT(DISTINCT teamMember.UserID) AS members,
    CONCAT(captain.FirstName, ' ', captain.LastName) AS captainName,
    captain.Email AS captainEmail
FROM
    teams t
        JOIN
    users captain ON captain.UserID = t.TeamLeaderID
        JOIN
    users teamMember ON teamMember.TeamID = t.TeamId
        JOIN
    universities u ON t.UniversityID = u.UniversityID
    ${approvedOnly ? " WHERE t.IsApproved = true" : ""}
    GROUP BY t.TeamID
`;

    const query = await db.query(sql);
    return query[0];
};

/**
 * Gets all teams associated with a university by university ID
 * @param {*} universityId The ID of the university.
 * @param {boolean} [approvedOnly=true] Determines if the query should only return teams approved by a University Rep.
 * @return {*} A promise that resolves to an array of teams.
 */
const getTeamsByUniversityId = async (universityId, approvedOnly = true) => {
    let sql = `SELECT *
        FROM teams
        WHERE
            UniversityId = ?`;
    if (approvedOnly) {
        sql += "\n AND IsApproved = true";
    }

    const query = await db.query(sql, [universityId]);

    return query[0];
};

/**
 * Gets a team's information based on its ide
 * @param {number} teamId The Id to search for
 * @param {boolean} showUnapproved Whether or not the information should include unapproved teams
 * @param {boolean} showPendingChanges Whether or not to retrieve pending changes to the team's information
 * @returns
 */
const getTeamById = async (teamId, showUnapproved, showPendingChanges) => {
    const sql = `SELECT 
    t.TeamID AS id,
    t.TeamName AS teamName,
    t.ProfileImageURL AS profileImageUrl,
    t.UniversityID AS universityId,
    u.UniversityName AS universityName,
    t.Description AS description,
    t.CreatedAt AS createdAt,
    COUNT(DISTINCT teamMember.UserID) AS members,
    CONCAT(captain.FirstName, ' ', captain.LastName) AS captainName,
    captain.Email AS captainEmail
FROM
    teams t
        JOIN
    users captain ON captain.UserID = t.TeamLeaderID
        JOIN
    users teamMember ON teamMember.TeamID = t.TeamId
        JOIN
    universities u ON t.UniversityID = u.UniversityID
WHERE
    t.TeamId = ?
    ${showUnapproved ? "" : " AND t.IsApproved = true"}`;
    const result = await db.query(sql, [teamId]);
    if (result[0].length === 0) {
        return null;
    }
    return result[0][0];
};

/**
 * Create a new team in the database
 * @param {number} universityId The ID of the university the team belongs to.
 * @param {string} teamName The name of the newly created team
 * @param {number} userId The UserID value of the creator, used to make them the team's captain.
 * @returns {number} The newly created team's ID
 */
const createTeam = async (universityId, teamName, userId) => {
    const sql = `INSERT INTO teams (UniversityId, TeamName, TeamLeaderID) VALUES (?, ?, ?)`;
    const [resultSetHeader] = await db.query(sql, [
        universityId,
        teamName,
        userId,
    ]);
    return resultSetHeader.insertId;
};

/**
 * Creates a Team Update Request in the team_update table for admin review
 * @param {number} teamId The ID of the team being updated
 * @param {string|null} teamName The team's new name (will be null if the team leader did not specify a new team name)
 * @param {string|null} description The team's newly defined description
 * @param {string|null} profileImageUrl The URL of the team's profile image
 * @returns {Promise<boolean>} True of the update request is created successfully, false if something went wrong.
 */
const teamUpdateRequest = async (
    teamId,
    teamName,
    description,
    profileImageUrl
) => {
    const sql = `
        INSERT INTO team_update (UpdatedTeamID, TeamName, ProfileImageURL, Description)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
        teamId,
        teamName,
        profileImageUrl,
        description,
    ]);

    return result.affectedRows > 0;
};

const getTeamUpdate = async (updateId) => {
    const sql = `SELECT t.UniversityID, u.*
    FROM team_update u
    JOIN teams t ON u.UpdatedTeamId = t.TeamID
    WHERE u.TeamUpdateId = ?;
    `;
    const [rows] = await db.query(sql, [updateId]);
    if (rows.count < 1) {
        return null;
    }
    return rows[0];
};

const approveTeam = async (teamId) => {
    const sql = `UPDATE teams SET IsApproved = true WHERE TeamID = ?`;
    const [result] = await db.query(sql, [teamId]);
    return result.affectedRows > 0;
};

const denyTeam = async (teamId) => {
    const c = await db.getConnection();
    try {
        await c.beginTransaction();

        //Remove users from the denied team and set their role back to spectator.
        await c.query(
            "UPDATE users SET RoleID = 1, TeamID = null WHERE TeamID = ?;",
            [teamId]
        );

        //Delete the team.
        const [result] = await c.query("DELETE FROM teams WHERE TeamID = ?;", [
            teamId,
        ]);

        await c.commit();

        return result.affectedRows > 0;
    } catch (e) {
        await c.rollback();
        console.error("Error occurred denying user: ", e);
        return false;
    } finally {
        c.release();
    }
};

const approveTeamUpdate = async (teamUpdateId, userId) => {
    //SQL created with help from chatgpt
    const c = await db.getConnection();
    try {
        await c.beginTransaction();

        // Update the actual team using values from team_update
        await c.query(
            `UPDATE teams t
             JOIN team_update tu ON t.TeamID = tu.UpdatedTeamID
             SET
                 t.TeamName = COALESCE(tu.TeamName, t.TeamName),
                 t.ProfileImageURL = COALESCE(tu.ProfileImageURL, t.ProfileImageURL),
                 t.Description = COALESCE(tu.Description, t.Description)
             WHERE tu.TeamUpdateId = ?`,
            [teamUpdateId]
        );

        // Mark the update as approved
        const [updateResult] = await c.query(
            `UPDATE team_update
             SET ApprovedBy = ?
             WHERE TeamUpdateId = ?`,
            [userId, teamUpdateId]
        );

        await c.commit();
        return updateResult.affectedRows > 0;
    } catch (e) {
        await c.rollback();
        console.error("Error approving team update:", e);
        return false;
    } finally {
        c.release();
    }
};

const denyTeamUpdate = async (teamUpdateId) => {
    const sql = `DELETE FROM team_update WHERE TeamUpdateId = ?`;
    const [result] = await db.query(sql, [teamUpdateId]);
    return result.affectedRows > 0;
};

module.exports = {
    getTeam,
    getMembers,
    createTeam,
    getTeams,
    getTeamById,
    searchTeams,
    getTeamsByUniversityId,
    teamUpdateRequest,
    getTeamUpdate,
    approveTeam,
    denyTeam,
    approveTeamUpdate,
    denyTeamUpdate,
};
