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
    //TODO create teamModel and move SQL interactions there
    const results = await teamModel.searchTeams(teamName, universityName);
    return results;
};

const getTeams = async (uid, universityId = null, showUnapproved = false) => {
    //Get user permissions if showUnapproved is true.  Otherwise, we don't care about their role and this can be skipped.
    if (showUnapproved) {
        const user = await userModel.readUser(uid);
        switch (true) {
            case user.Role === "Super Admin":
            case user.Role === "University Rep" &&
                user.UniversityID === universityId:
                break;
            default:
                throw createError(403);
        }
    }

    if (universityId) {
        return await teamModel.getTeamsByUniversityId(
            universityId,
            !showUnapproved
        );
    }
    return await teamModel.getTeams(!showUnapproved);
};

module.exports = { searchTeams, getTeams };
