const db = require("../config/db");

/**
 * Searches universities based on the search term.
 *
 * @param {string} universityName - The search term for the university name.
 * @param {boolean} partial - If the search should include partial matches
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (universityName, partial = true) => {
    console.log("Request on /search reached university model layer");
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
    console.log("Returning result on /search from university model layer");
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
 * @param {*} body An object representing the keys and values to be updated.
 * @throws An error if the keys are rejected.
 */
const updateUniversity = async (universityId, body) => {
    const updates = [];
    for (const key of Object.keys(body)) {
        const column = VALID_KEYS?.[key.toUpperCase()];
        if (column) {
            updates.push(`${column} = ?`);
        } else {
            console.error("Error fulfilling update request:", body);
            console.error("Invalid key:", key);
            throw createHttpError(400, "Invalid attempt to update university.");
        }
    }
    const keys = Object.keys(body)
        .map((key) => `${key} = ?`)
        .join(", ");

    const [rows] = await db.query(
        `UPDATE users SET ${keys} WHERE UniversityID = ?`,
        [...Object.values(body), universityId]
    );

    if (rows.affectedRows === 0) {
        throw new Error("User not updated.");
    }

    return await getUserByFirebaseId(firebaseUid);
};

module.exports = {
    searchUniversities,
    getUniversityById,
    createUniversity,
    updateUniversity,
};
