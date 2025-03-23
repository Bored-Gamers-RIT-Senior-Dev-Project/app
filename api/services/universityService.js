const universityModel = require("../models/universityModel");
const userModel = require("../models/userModel");
const teamModel = require("../models/teamModel");
const createHttpError = require("http-errors");
/**
 * Searches universities based on the search term.
 *
 * @param {string} universityName - The search term for the university name.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
const searchUniversities = async (universityName) => {
    const searchResult = await universityModel.searchUniversities(
        universityName
    );
    return searchResult;
};

/**
 * Gets a university by its ID.  Throws a 404 error if no such university exists.
 * @param {Number} universityId The ID of the university that should be returned
 * @returns {Promise<Object>} The university with the given ID, or null if no such university exists.
 * @throws {import("http-errors").HttpError} If no university with the given ID exists.
 */
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

const getUniversities = async () => {
    const universities = await universityModel.searchUniversities("");
    return universities;
};

const createUniversity = async (
    uid,
    universityName,
    location,
    logoURL,
    bannerUrl,
    description,
    websiteUrl
) => {
    //Check uid role and throw 403 if not admin. (Only administrators can create universities)
    const user = await userModel.getUserByFirebaseId(uid);
    if (user?.role !== "Super Admin") {
        throw createHttpError(403);
    }

    //Create university in database.
    await universityModel.createUniversity(
        universityName,
        location,
        logoURL,
        bannerUrl,
        description,
        websiteUrl
    );

    //TODO: Figure out what to return here.

    return {};
};

const deleteUniversity = async (universityId) => {
    //TODO: If we allow this action, we'll need to figure out what business logic we need to reassign or delete teams, users, etc.
    //Delete university in universityModel

    return true;
};

const updateUniversity = async (uid, universityId, updateBody) => {
    //TODO: Confirm that User is an admin or the University Rep.  Otherwise throw 403.
    const user = await userModel.getUserByFirebaseId(uid);
    if (
        user.role !== "Super Admin" &&
        (user.role !== "University Admin" || user.universityId !== universityId)
    ) {
        throw createHttpError(403);
    }

    //TODO: Validate and sanitize updateBody to prevent SQL injection or other attacks/errors.

    //Update university in universityModel.
    const university = await universityModel.updateUniversity(
        universityId,
        updateBody
    );

    //TODO: Return updated university.
    return university;
};

module.exports = {
    createUniversity,
    updateUniversity,
    getUniversities,
    searchUniversities,
    getUniversityInfo,
};
