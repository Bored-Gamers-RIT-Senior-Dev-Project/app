const universityModel = require("../models/universityModel");
const teamModel = require("../models/teamModel");
const createHttpError = require("http-errors");
/**
 * Searches universities based on the search term.
 *
 * @param {string} universityName - The search term for the university name.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (universityName) => {
    const searchResult = await universityModel.searchUniversities(
        universityName
    );
    return searchResult;
};

/**
 * Gets a university by its ID.  Throws a 404 error if no such university exists.
 * @param {Number} universityId The ID of the university that should be returned
 * @returns {Promise<Object>} The university with the given ID, or null if no such university exists.
 * @throws {import("http-errors").HttpError} If no university with the given ID exists.
 */
const getUniversityInfo = async (universityId) => {
    const universityQuery = universityModel.getUniversityById(universityId);
    const teamQuery = teamModel.getTeamsByUniversityId(universityId);

    const [universityInfo, teams] = await Promise.all([
        universityQuery,
        teamQuery,
    ]);

    if (!universityInfo) throw createHttpError(404);

    return { ...universityInfo, teams };
};

const createUniversity = async (
    uid,
    universityName,
    location,
    logoURL,
    bannerUrl,
    description,
    websiteUrl
) => {
    //TODO: Check uid role and throw 403 if not admin. (Only administrators can create universities)
    //TODO: Create university in database and return its ID.
    return {};
};

module.exports = { searchUniversities, getUniversityInfo };
