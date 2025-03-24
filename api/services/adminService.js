const User = require("../models/userModel");
const Admin = require("../models/adminDb");
const { createHttpError, HttpError } = require("http-errors");

const getRoleList = async (uid) => {
    const user = await User.getUserByFirebaseId(uid);
    console.log(uid, user);
    if (user.roleName != "Super Admin") {
        throw createHttpError(403);
    }

    const roles = await Admin.getRoleList();
    return roles;
};

module.exports = { getRoleList };
