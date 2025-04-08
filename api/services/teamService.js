const teamModel = require("../models/teamModel");
const userModel = require("../models/userModel");
const createError = require("http-errors");
const imageUploadService = require("./imageUploadService");
const { makeObjectCamelCase } = require("../utils");

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
 * Checks if user has the correct permissions to view pending changes
 * @param {object} user User Information from the DB
 * @param {object} team Team Information from the DB
 * @returns {boolean} true if the user can, false if they can't.
 */
const userCanViewPendingChanges = (user, team) => {
    switch (user.roleName) {
        case userModel.Roles.ADMIN:
            return true;
        case userModel.Roles.CAPTAIN:
        case userModel.Roles.STUDENT:
            return user.teamId == team.id;
        case userModel.Roles.UNIVERSITY_ADMIN:
            return user.universityId == team.universityId;
        default:
            return false;
    }
};

/**
 * Gets team information based on a team's ID
 * @param {string} uid Firebase UID provided by auth
 * @param {number} teamId Team ID to search for
 * @param {boolean} showPendingChanges if the data should include pending changes.
 * @returns {Promise<object>} Team information
 */
const getTeam = async (uid, teamId, showPendingChanges = true) => {
    const [user, team, members] = await Promise.all([
        userModel.getUserByFirebaseId(uid),
        teamModel.getTeam(teamId),
        teamModel.getMembers(teamId, showPendingChanges),
    ]);
    team.members = members;
    if (user && showPendingChanges && userCanViewPendingChanges(user, team)) {
        let pendingChanges = await teamModel.getPendingChanges(teamId);
        if (pendingChanges) {
            team.pendingChanges = pendingChanges;
        }
    }

    return makeObjectCamelCase(team);
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
    await userModel.grantRole(
        uid,
        "Student/Player",
        userModel.UserIds.FIREBASE
    );

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
    if (user.roleName !== "Spectator") {
        throw createError(403, "User role cannot join a team.");
    }

    const teamId = await teamModel.createTeam(
        universityId,
        teamName,
        user.userId
    );
    await addUserToTeam(uid, teamId, universityId);
    await userModel.grantRole(uid, "Team Captain", userModel.UserIds.FIREBASE);
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
        userModel.UserIds.FIREBASE
    );
};

/**
 * Posts an update request to the DB if the user editing is captain of the team.
 * @param {string} uid UID of the user posting the update
 * @param {string|null} teamName The updated team name, null if the team name has not been updated
 * @param {string|null} description The updated team description, null if the description has not been updated
 * @param {Express.Multer.File|null} profileImage A newly uploaded profile image file, null if no image was uploaded.
 * @returns {Promise<boolean>} True if successful, false if something went wrong
 */
const postUpdateRequest = async (
    uid,
    teamId,
    teamName,
    description,
    profileImage
) => {
    const user = await userModel.getUserByFirebaseId(uid);
    if (user.roleName != userModel.Roles.CAPTAIN || user.teamId != teamId) {
        throw createError(403);
    }
    let profileImageUrl = null;
    if (profileImage) {
        profileImageUrl = await imageUploadService.uploadImage(
            profileImage.buffer
        );
    }

    return await teamModel.teamUpdateRequest(
        teamId,
        teamName,
        description,
        profileImageUrl
    );
};

const userCanPromote = async (user, prospectiveCaptain) => {
    switch (user.roleName) {
        case userModel.Roles.ADMIN:
            return true;
        case userModel.Roles.CAPTAIN:
            return user.teamId == prospectiveCaptain.teamId;
        case userModel.Roles.UNIVERSITY_ADMIN:
            return user.universityId == prospectiveCaptain.universityId;
        default:
            return false;
    }
};

const promoteUserToCaptain = async (uid, userId) => {
    const user = await userModel.getUserByFirebaseId(uid);
    const prospectiveCaptain = await userModel.getUserByUserId(userId);
    //If no user, 404
    if (!prospectiveCaptain) {
        throw createError(404, "User not found.");
    }
    //If user doesn't have the right permissions, throw 403
    if (!(await userCanPromote(user, prospectiveCaptain))) {
        throw createError(403);
    }
    //If prospective captain is not a member of a team, (or isn't a student role), 400.
    if (
        !prospectiveCaptain.teamId ||
        prospectiveCaptain.roleName !== userModel.Roles.STUDENT
    ) {
        throw createError(400);
    }
    console.log("Promoting user to captain: ", userId);
    return await teamModel.promoteCaptain(userId, prospectiveCaptain.teamId);
};

const userCanRemove = async (user, userToRemove) => {
    if (user.userId == userToRemove.userId) {
        return true;
    }
    switch (user.roleName) {
        case userModel.Roles.ADMIN:
            return true;
        case userModel.Roles.CAPTAIN:
            return user.teamId == userToRemove.teamId;
        case userModel.Roles.UNIVERSITY_ADMIN:
            return user.universityId == userToRemove.universityId;
        default:
            return false;
    }
};
const removeUserFromTeam = async (uid, userId) => {
    const user = await userModel.getUserByFirebaseId(uid);
    const removedUser = await userModel.getUserByUserId(userId);
    if (!removedUser) {
        throw createError(404);
    }
    if (!(await userCanRemove(user, removedUser))) {
        throw createError(403);
    }

    if (removedUser.roleName == userModel.Roles.CAPTAIN) {
        throw createError(400, "Cannot remove team captain from team.");
    }
    if (removedUser.roleName !== userModel.Roles.STUDENT) {
        throw createError(400, "User is not a student member of the team.");
    }

    return await teamModel.removeTeamMember(userId);
};

module.exports = {
    createTeam,
    getTeam,
    searchTeams,
    getTeams,
    joinTeam,
    postUpdateRequest,
    promoteUserToCaptain,
    removeUserFromTeam,
};
