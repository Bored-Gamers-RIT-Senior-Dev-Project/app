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

module.exports = router;
