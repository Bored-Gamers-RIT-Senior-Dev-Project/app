const teamModel = require("../models/teamModel");
const userModel = require("../models/userModel");
const createError = require("http-errors");

/**
 * Searches for teams based on the search term.
 *
 * @param {string} teamName - The team name to search for.
 * @param {string} universityName - the University Name to search for.  Default to null.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchTeams = async (teamName, universityName = null) => {
    const results = await teamModel.searchTeams(teamName, universityName);
    return results;
};

const getTeams = async (uid, universityId = null, showUnapproved = false) => {
    if (universityId) {
        return await teamModel.getTeamsByUniversityId(
            universityId,
            !showUnapproved
        );
    }
    return await teamModel.getTeams(!showUnapproved);
};

module.exports = { searchTeams, getTeams };
