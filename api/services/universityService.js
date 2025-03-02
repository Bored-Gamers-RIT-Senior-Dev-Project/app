const db = require("../config/db");

/**
 * Searches universities based on the search term.
 *
 * @param {string} universityName - The search term for the university name.
 * @param {boolean} partial - If the search should include partial matches
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (universityName, partial = true) => {
    //TODO: Create universityModel and move sql logic there.
    let sql = `
        SELECT 
            UniversityId AS Id,
            UniversityName, 
            Location,
            LogoURL,
            Description,
            WebsiteURL,
            'University' AS Type
        FROM Universities
        WHERE 
            UniversityName LIKE ?`;

    const query = await db.query(sql, [
        partial ? `%${universityName}%` : universityName,
    ]);
    return query[0];
};

module.exports = { searchUniversities };
