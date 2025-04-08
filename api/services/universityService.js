const universityModel = require("../models/universityModel");
const userModel = require("../models/userModel");
const teamModel = require("../models/teamModel");
const createHttpError = require("http-errors");
const imageUploadService = require("./imageUploadService");
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

/**
 * Gets a list of all universities from the database
 * @returns A list of all universities, confirmed only.
 */
const getUniversities = async () => {
    const universities = await universityModel.searchUniversities("");
    return universities;
};

/**
 * Creates a new university
 * @param {*} uid Requester's user id to validate permissions
 * @param {*} universityName  The new university name
 * @param {*} location The location of the new university
 * @param {*} logoUrl The new university's logo URL
 * @param {*} bannerUrl The new university's banner URL
 * @param {*} description Description of the university
 * @param {*} websiteUrl Link to the university's website
 * @returns TBD
 */
const createUniversity = async (uid, universityName) => {
    //Check uid role and throw 403 if not admin. (Only administrators can create universities)
    const user = await userModel.getUserByFirebaseId(uid);
    if (user?.roleName !== "Super Admin") {
        throw createHttpError(403);
    }

    //Create university in database.
    const universityId = await universityModel.createUniversity(
        universityName,
        "",
        "",
        "",
        "",
        ""
    );

    return universityId;
};

/**
 * Delete a university from the database
 * @param {*} universityId The university to be deleted
 * @returns true
 */
const deleteUniversity = async (universityId) => {
    //TODO: If we allow this action, we'll need to figure out what business logic we need to reassign or delete teams, users, etc.
    //Delete university in universityModel

    return true;
};

/**
 * Checks user permissions to update a university in the database
 * @param {object} user The user's data
 * @param {number} universityId ID of the user being edited
 * @returns {boolean} True if the user has accurate permissions, False if not
 */
const userCanUpdateUniversity = (user, universityId) => {
    switch (user.roleName) {
        case userModel.Roles.ADMIN:
            return true;
        case userModel.Roles.UNIVERSITY_ADMIN:
            return user.universityId == universityId;
        default:
            return false;
    }
};

/**
 *
 * @param {string} uid Firebase UID of the user requesting the edit
 * @param {number} universityId ID of university to edit
 * @param {string|null} universityName New Name
 * @param {string|null} location New Location
 * @param {string|null} description New Description
 * @param {string|null} websiteUrl New WebsiteUrl
 * @param {Express.Multer.File|null} logoImage Uploaded Logo Image file
 * @param {Express.Multer.File|null} bannerImage Uploaded banner image file
 * @returns
 */
const updateUniversity = async (
    uid,
    universityId,
    universityName,
    location,
    description,
    websiteUrl,
    logoImage,
    bannerImage
) => {
    //Confirm that User is an admin or the University Rep.  Otherwise throw 403.
    const user = await userModel.getUserByFirebaseId(uid);
    if (!userCanUpdateUniversity(user, universityId)) {
        throw createHttpError(403);
    }

    //TODO: Validate and sanitize updateBody to prevent SQL injection or other attacks/errors.
    let updateBody = {};
    if (universityName) {
        updateBody.universityName = universityName;
    }
    if (location) {
        updateBody.location = location;
    }
    if (description) {
        updateBody.description = description;
    }
    if (websiteUrl) {
        updateBody.websiteUrl = websiteUrl;
    }
    const imageUploads = [];
    if (logoImage) {
        imageUploads.push(
            imageUploadService
                .uploadImage(logoImage.buffer)
                .then((url) => (updateBody.logoUrl = url))
        );
    }
    if (bannerImage) {
        imageUploads.push(
            imageUploadService
                .uploadImage(bannerImage.buffer)
                .then((url) => (updateBody.bannerUrl = url))
        );
    }
    await Promise.all(imageUploads);

    //Update university in universityModel.
    const university = await universityModel.updateUniversity(
        universityId,
        updateBody
    );

    return university;
};

module.exports = {
    createUniversity,
    updateUniversity,
    getUniversities,
    searchUniversities,
    getUniversityInfo,
};
