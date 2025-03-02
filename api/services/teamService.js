const db = require("../config/db");

/**
 * Searches for teams based on the search term.
 *
 * @param {string} teamName - The term to search for.
 * @param {boolean} partial - If partial matches should be included.  Defaults to true.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchTeams = async (teamName, partial = true) => {
    //TODO create teamModel and move SQL interactions there
    const sql = `
        SELECT 
            t.TeamID AS ID, 
            t.TeamName AS Name, 
            'Team' AS Type,
            u.UniversityName AS AssociatedUniversity
        FROM Team t
        JOIN University u ON t.UniversityID = u.UniversityID
        WHERE 
            t.TeamName ILIKE ? 
            OR u.UniversityName ILIKE ?`;
    const teamQuery = await db.query(sql, [
        partial ? `%${teamName}%` : teamName,
    ]);
    teamQuery[0];
};

module.exports = { searchTeams };
