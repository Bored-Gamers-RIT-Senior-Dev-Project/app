const User = require("../models/userModel");
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

    const [reportOne, reportOneTotals] = await Promise.all([
        Admin.getReportOne(),
        Admin.getReportOneTotals(),
    ]);
    const rv = [{ report: reportOne, totals: reportOneTotals }];
    return rv;
};

/**
 * TODO: Docs
 * @param {*} uid
 */
const getUniversityAdminTickets = async (uid) => {
    const user = await User.getUserByFirebaseId(uid);
    console.log("User is ", user);
    //TODO: Permissions and validation

    await Admin.getUniversityAdminTickets(user.universityId);
};

module.exports = { generateReports, getRoleList, getUniversityAdminTickets };
