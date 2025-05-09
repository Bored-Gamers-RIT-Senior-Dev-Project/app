const User = require("../models/userModel");
const Team = require("../models/teamModel");
const Admin = require("../models/adminDb");
const createHttpError = require("http-errors");

const getRoleList = async (uid) => {
    const user = await User.getUserByFirebaseId(uid);
    if (user.roleName != "Super Admin") {
        throw createHttpError(403);
    }

    const roles = await Admin.getRoleList();
    return roles;
};

const generateReports = async (uid) => {
    if (!(await User.userHasRole(uid, "Super Admin"))) {
        throw createHttpError(403);
    }

    const [reportOne, reportOneTotals, reportTwo, reportTwoTotals] =
        await Promise.all([
            Admin.getReportOne(),
            Admin.getReportOneTotals(),
            Admin.getReportTwo(),
            Admin.getReportTwoTotals(),
        ]);
    const rv = [
        { report: reportOne, totals: reportOneTotals },
        { report: reportTwo, totals: reportTwoTotals },
    ];
    return rv;
};

/**
 * Gets all university admin tickets for a team
 * @param {string} uid The requesting user's UID from their auth header.
 */
const getUniversityAdminTickets = async (uid) => {
    const user = await User.getUserByFirebaseId(uid);

    if (user.roleName != User.Roles.UNIVERSITY_ADMIN) {
        throw createHttpError(403);
    }

    return await Admin.getUniversityAdminTickets(user.universityId);
};

const respondToUniversityAdminTicket = async (uid, type, id, approved) => {
    const user = await User.getUserByFirebaseId(uid);
    switch (type) {
        case "newUser":
            return await respondToNewUser(user, id, approved);
        case "userEdit":
            return await respondToUserEdit(user, id, approved);
        case "newTeam":
            return await respondToNewTeam(user, id, approved);
        case "teamEdit":
            return await respondToTeamEdit(user, id, approved);
    }
    return false;
};
const respondToNewUser = async (user, userId, approved) => {
    const newUser = await User.getUserByUserId(userId);
    //If user isn't an admin, or is from a different university, 403.
    if (
        user.roleName != User.Roles.UNIVERSITY_ADMIN ||
        newUser.universityId != user.universityId
    ) {
        throw createHttpError(403);
    }

    if (approved) {
        return await User.approveUser(userId);
    }
    return await User.denyUser(userId);
};

const respondToUserEdit = async (user, editId, approved) => {
    const userEdit = await User.getUserEditById(editId);
    //If user isn't an admin, or is from a different university, 403.
    if (
        user.roleName != User.Roles.UNIVERSITY_ADMIN ||
        userEdit.UniversityID != user.universityId
    ) {
        throw createHttpError(403);
    }

    if (approved) {
        return await User.approveUserUpdate(editId, user.userId);
    }
    return await User.denyUserUpdate(editId);
};

const respondToNewTeam = async (user, teamId, approved) => {
    const newTeam = await Team.getTeamById(teamId, true);
    if (
        user.roleName != User.Roles.UNIVERSITY_ADMIN ||
        newTeam.universityId != user.universityId
    ) {
        throw createHttpError(403);
    }
    if (approved) {
        return await Team.approveTeam(teamId);
    }
    return await Team.denyTeam(teamId);
};
const respondToTeamEdit = async (user, editId, approved) => {
    const teamEdit = await Team.getTeamUpdate(editId);
    if (
        user.roleName != User.Roles.UNIVERSITY_ADMIN ||
        teamEdit.UniversityID != user.universityId
    ) {
        throw createHttpError(403);
    }

    if (approved) {
        return await Team.approveTeamUpdate(editId, user.userId);
    }
    return await Team.denyTeamUpdate(editId);
};

module.exports = {
    generateReports,
    getRoleList,
    getUniversityAdminTickets,
    respondToUniversityAdminTicket,
};
