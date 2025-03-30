const express = require("express");
const router = express.Router();
const { makeObjectCamelCase } = require("../utils");
const universityService = require("../services/universityService");

/**
 * GET a list of universities
 */
router.get("", async (req, res, next) => {
    const { name = "" } = req.query;
    try {
        const universities = await universityService.searchUniversities(name);
        return res.json(makeObjectCamelCase(universities));
    } catch (e) {
        next(e);
    }
});

/**
 * GET university info by ID
 */
router.get("/:universityId", async (req, res, next) => {
    try {
        const universityInfo = await universityService.getUniversityInfo(
            req.params.universityId
        );
        return res.json(makeObjectCamelCase(universityInfo));
    } catch (e) {
        next(e);
    }
});

/**
 * POST to create a university.
 * Requires admin role.
 */
router.post("", async (req, res, next) => {
    const { uid } = req.user;
    const { universityName } = req.body;
    if (!uid) {
        return res.status(401).send();
    }
    if (!universityName) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const university = await universityService.createUniversity(
            uid,
            universityName
        );
        return res.status(201).json({
            message: "University created successfully.",
            university, //Technically HTTP standards say this should only return the ID.  Do we want to return the whole object?
        });
    } catch (e) {
        next(e);
    }
});

/**
 * DELETE a university from the database.
 * Requires: Admin Role.
 * //TODO: Do we need this action for MVP and what business logic will be necessary?
 */
router.delete("/:universityId", async (req, res, next) => {
    const { uid } = req.user;
    const { universityId } = req.params;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        if (await universityService.deleteUniversity(universityId)) {
            return res
                .status(200)
                .json({ message: "University deleted successfully." });
        }
    } catch (e) {
        next(e);
    }
});

/**
 * PUT to update a university.
 * Requires: [Admin Role] or [University Rep Role & Matching University ID]
 */
router.put("/:universityId", async (req, res, next) => {
    const { uid } = req.user;
    const { universityId } = req.params;
    const {
        universityName,
        location,
        logoURL,
        bannerUrl,
        description,
        websiteUrl,
    } = req.body;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const result = await universityService.updateUniversity(
            uid,
            universityId,
            {
                universityName,
                location,
                logoURL,
                bannerUrl,
                description,
                websiteUrl,
            }
        );
        return res.status(200).json({
            message: "University updated successfully.",
            university: result,
        });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
