const db = require("../config/db");

/**
 * Searches universities based on the search term.
 *
 * @param {string} universityName - The search term for the university name.
 * @param {boolean} partial - If the search should include partial matches
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (universityName, partial = true) => {
    let sql = `
        SELECT 
            UniversityId AS Id,
            UniversityName, 
            Location,
            LogoURL,
            Description,
            WebsiteURL,
            'University' AS Type
        FROM universities
        WHERE 
            UniversityName LIKE ?`;

    const query = await db.query(sql, [
        partial ? `%${universityName}%` : universityName,
    ]);
    return query[0];
};

/**
 * Gets a university by its ID.
 * @param {number} universityId - The ID of the university that should be returned
 * @return {*} The university with the given ID, or null if no such university exists.
 */
const getUniversityById = async (universityId) => {
    let sql = `SELECT *
        FROM universities
        WHERE UniversityId = ?`;

    const query = await db.query(sql, [universityId]);

    if (query[0].length < 1) {
        return null;
    }

    return query[0][0];
};

module.exports = { searchUniversities, getUniversityById };
