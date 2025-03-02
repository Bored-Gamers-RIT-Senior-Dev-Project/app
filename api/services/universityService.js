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

module.exports = { searchUniversities, getUniversityInfo };
