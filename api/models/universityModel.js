const db = require("../config/db");

const getUniversity = async (id) => {
    const query = await db.query(
        `SELECT *
        FROM UNIVERSITIES
        WHERE UniversityId = ?`,
        [id]
    );

    if (query[0].length == 0) {
        return null;
    }

    return query[0][0];
};

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
        FROM Universities
        WHERE 
            UniversityName LIKE ?`;

    const query = await db.query(sql, [
        partial ? `%${universityName}%` : universityName,
    ]);
    return query[0];
};

const getUniversityById = async (universityId) => {
    let sql = `SELECT *
        FROM Universities
        WHERE UniversityId = ?`;

    const query = await db.query(sql, [universityId]);

    if (query[0].length < 1) {
        return null;
    }

    return query[0][0];
};

module.exports = { searchUniversities, getUniversityById };
