const db = require("../config/db");

/**
 * Searches universities based on the search term.
 *
 * @param {string} teamName - The search term for the team name.
 * @param {string} universityName - The name of the university to search for, optional.
 * @param {boolean} partial - If the search should include partial matches
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (
    teamName,
    universityName = null,
    partial = true
) => {
    //TODO: Create universityModel and move sql logic there.
    const sql = `
        SELECT 
            t.TeamID AS ID, 
            t.TeamName AS Name, 
            'Team' AS Type,
            u.UniversityName AS AssociatedUniversity
        FROM Team t
        JOIN University u ON t.UniversityID = u.UniversityID
        WHERE 
            t.TeamName ILIKE ?`;
    const fieldPacket = [partial ? `%${teamName}%` : teamName];
    if (universityName) {
        sql += ` OR u.UniversityName ILIKE ?`;
        fieldPacket.push(partial ? `%${universityName}%` : universityName);
    }

    const query = await db.query(sql, fieldPacket);
    return query[0];
};

module.exports = { searchUniversities };
