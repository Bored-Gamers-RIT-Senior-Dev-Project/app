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

const getTeamsByUniversityId = async (universityId, approvedOnly = true) => {
    let sql = `SELECT *
        FROM Teams
        WHERE
            UniversityId = ?`;
    if (approvedOnly) sql += "\n AND IsApproved = true";

    const query = await db.query(sql, [universityId]);

    return query[0];
};

module.exports = { searchTeams, getTeamsByUniversityId };
