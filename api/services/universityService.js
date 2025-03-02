const universityModel = require("../models/universityModel");
/**
 * Searches universities based on the search term.
 *
 * @param {string} universityName - The search term for the university name.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (universityName) => {
    const searchResult = await universityModel.searchUniversities(
        universityModel,
        true
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
