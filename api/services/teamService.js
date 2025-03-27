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

/**
 * Gets a list of all teams
 * @param {*} uid Requestor uid (Note; currently unused)
 * @param {*} universityId (Optional) University ID to filter the results
 * @param {*} showUnapproved (Default: False) whether or not to show unfiltered results
 * @returns
 */
const getTeams = async (uid, universityId = null, showUnapproved = false) => {
    //Get user permissions if showUnapproved is true.  Otherwise, we don't care about their role and this can be skipped.
    // if (showUnapproved) {
    //     const user = await userModel.getUserByFirebaseId(uid);
    //     switch (true) {
    //         case user.Role === "Super Admin":
    //         case user.Role === "University Rep" &&
    //             user.UniversityID === universityId:
    //             break;
    //         default:
    //             throw createError(403);
    //     }
    // }

    if (universityId) {
        return await teamModel.getTeamsByUniversityId(
            universityId,
            !showUnapproved
        );
    }
    return await teamModel.getTeams(!showUnapproved);
};

/**
 * Adds requestor to the team specified
 * @param {*} uid Requestor firebase uid
 * @param {*} teamId Id of the team to join
 * @returns true
 */
const joinTeam = async (uid, teamId) => {
    //If user isn't a spectator, fail the request
    if (!userModel.userHasRole(uid, "Spectator")) {
        throw createError(403, "User role cannot join a team.");
    }

    const team = await teamModel.getTeamById(teamId, true);
    if (!team) {
        throw createError(404); //Team is not found, throw 404 not found error.
    }
    if (team.members >= 7) {
        throw createError(400, "Team is at max capacity."); //Team has 7 or more members.  (This is blocked on the front-end, but might happen if data is outdated)
    }
    await addUserToTeam(uid, teamId, team.universityId);
    await userModel.grantRole(uid, "Student/Player", "FirebaseUID");

    return true;
};

/**
 * Creates a new team and makes requestor the captain.
 * @param {string} uid Firebase User ID from permissions
 * @param {number} universityId University ID for the new team to connect to
 * @param {string} teamName New Team Name
 * @returns New team's teamId on success.
 */
const createTeam = async (uid, universityId, teamName) => {
    const user = await userModel.getUserByFirebaseId(uid);
    console.log(user);
    if (user.roleName !== "Spectator") {
        throw createError(403, "User role cannot join a team.");
    }

    const teamId = await teamModel.createTeam(
        universityId,
        teamName,
        user.userId
    );
    await addUserToTeam(uid, teamId, universityId);
    await userModel.grantRole(uid, "Team Captain", "FirebaseUID");
    return teamId;
};

/**
 * Updates a user's database entry to indicate team membership / university relation.
 * @param {*} uid The user's ID.
 * @param {*} teamId The team Id of the team to join.
 * @param {*} universityId The university id of the team.
 */
const addUserToTeam = async (uid, teamId, universityId) => {
    await userModel.updateUser(
        uid,
        {
            teamId,
            universityId,
        },
        "FirebaseUID"
    );
};

module.exports = { createTeam, searchTeams, getTeams, joinTeam };
