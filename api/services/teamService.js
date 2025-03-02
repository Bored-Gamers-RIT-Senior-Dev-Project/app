const teamModel = require("../models/teamModel");

/**
 * Searches for teams based on the search term.
 *
 * @param {string} teamName - The team name to search for.
 * @param {string} universityName - the University Name to search for.  Default to null.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchTeams = async (teamName, universityName = null) => {
    //TODO create teamModel and move SQL interactions there
    const results = await teamModel.searchTeams(teamName, universityName);
    return results;
};

module.exports = { searchTeams };
