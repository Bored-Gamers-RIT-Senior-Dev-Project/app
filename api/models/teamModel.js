const db = require("../config/db");

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
    let sql = `SELECT 
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
    ${approvedOnly ? "WHERE t.IsApproved" : null}
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

const getTeamById = async (teamId, showUnapproved, showPendingChanges) => {
    const sql = `SELECT * FROM teams WHERE TeamID = ?`;
    if (!showUnapproved) {
        sql += " AND IsApproved = true";
    }
    //TODO: Logic to handle showPendingChanges once we've established how pending changes are stored.
    const result = await db.query(sql, [teamId]);
    if (result[0].length === 0) {
        return null;
    }
    return result[0][0];
};

module.exports = {
    getTeams,
    getTeamById,
    searchTeams,
    getTeamsByUniversityId,
};
