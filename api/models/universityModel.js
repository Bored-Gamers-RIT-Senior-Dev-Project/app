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

/**
 * Create a new university in the database
 * @param {string} universityName
 * @param {string} location
 * @param {string} logoUrl
 * @param {string} bannerUrl
 * @param {string} description
 * @param {string} websiteUrl
 * @returns tbd
 */
const createUniversity = async (
    universityName,
    location = "",
    logoUrl,
    bannerUrl,
    description,
    websiteUrl
) => {
    const [resultSetHeader] = await db.query(
        `
        INSERT INTO
            universities (UniversityName, Location, LogoURL, BannerURL, Description, WebsiteURL)
            VALUES (?, ?, ?, ?, ?, ?);
    `,
        [universityName, location, logoUrl, bannerUrl, description, websiteUrl]
    );

    return resultSetHeader.insertId;
};

const VALID_KEYS = {
    UNIVERSITYNAME: "UniversityName",
    LOCATION: "Location",
    LOGOURL: "LogoURL",
    BANNERURL: "BannerURL",
    DESCRIPTION: "Description",
    WEBSITEURL: "WebsiteURL",
};
/**
 * Update a university in the database
 * @param {number} universityId The ID of the university to be updated.
 * @param {*} body An object representing the keys and values to be updated.
 * @throws An error if the keys are rejected.
 */
const updateUniversity = async (universityId, body) => {
    const updates = [];
    let values = [];

    //Construct update query using VALID_KEYS
    Object.entries(body).forEach(([key, value]) => {
        const column = VALID_KEYS?.[key.toUpperCase()]; //Get column name from valid_keys
        if (column) {
            updates.push(`?? = ?`); //If column is in the valid_keys, push column and row wildcards.
            values = values.concat([column, value]); //Push the values to the end of the values array
        } else {
            console.error("Error fulfilling update request:", body);
            console.error("Invalid key:", key);
            throw createHttpError(400, "Invalid attempt to update university.");
        }
    });

    //If no updates, return false.
    if (updates.length == 0) {
        return false;
    }

    //Add the universityID to the end of the values (for the WHERE wildcard).
    values.push(universityId);

    //Build the SQL query using updates.
    const sql = `UPDATE universities SET ${updates.join(
        ", "
    )} WHERE UniversityID = ?;`;

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
        throw new Error("User not updated.");
    }

    return true;
};

module.exports = {
    searchUniversities,
    getUniversityById,
    createUniversity,
    updateUniversity,
};
