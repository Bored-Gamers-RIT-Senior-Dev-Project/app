const express = require("express");
const router = express.Router();
const { makeObjectCamelCase } = require("../utils");
const universityService = require("../services/universityService");

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

router.post("", async (req, res, next) => {
    const { uid } = req.user;
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
    if (!universityName || !websiteUrl) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const university = await universityService.createUniversity(
            uid,
            universityName,
            location,
            logoURL,
            bannerUrl,
            description,
            websiteUrl
        );
    } catch (e) {
        next(e);
    }
});

module.exports = router;
