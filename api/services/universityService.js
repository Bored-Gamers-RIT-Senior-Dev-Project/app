const db = require("../config/db");
const universityModel = require("../models/universityModel");
/**
 * Searches universities based on the search term.
 *
 * @param {string} universityName - The search term for the university name.
 * @param {boolean} partial - If the search should include partial matches
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (universityName) => {
    const searchResult = await universityModel.searchUniversities(
        universityModel,
        true
    );
    return searchResult;
};

module.exports = { searchUniversities };
