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

//TODO: JSdocs
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

//TODO: Jsdocs
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
 * TODO: JSDocs
 * @param {} teamId
 * @param {*} teamName
 * @param {*} description
 * @param {*} profileImageUrl
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

module.exports = {
    getTeam,
    getMembers,
    createTeam,
    getTeams,
    getTeamById,
    searchTeams,
    getTeamsByUniversityId,
    teamUpdateRequest,
};
