const teamModel = require("../models/teamModel");

/**
 * Searches for teams based on the search term.
 *
 * @param {string} teamName - The team name to search for.
 * @param {string} universityName - the University Name to search for.  Default to null.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchTeams = async (teamName, universityName = null) => {
    //TODO create teamModel and move SQL interactions there
    let sql = `
        SELECT 
            t.TeamID AS Id, 
            t.TeamName,
            t.ProfileImageURL,
            t.Description,
            u.UniversityName,
            'Team' AS Type
        FROM Teams t
        JOIN Universities u ON t.UniversityID = u.UniversityID
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

module.exports = { searchTeams };
