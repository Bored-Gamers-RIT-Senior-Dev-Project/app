const express = require("express");
const router = express.Router();
const { makeObjectCamelCase } = require("../utils");
const teamService = require("../services/teamService");
const universityService = require("../services/universityService");

router.post("/test", async (req, res) => {
    await new Promise((resolve) => {
        setTimeout(resolve, req.body?.sleep || 3000);
    });
    console.log("Received the following from the client:", req.body);
    return res
        .status(200)
        .send(JSON.stringify({ ...req.body, served: true }, undefined, 4));
});

router.post("/search", async (req, res, next) => {
    let { value } = req.body;
    value = value ? value : "";

    try {
        const universitySearch = universityService.searchUniversities(value);
        const teamSearch = teamService.searchTeams(value, value);

        const [universities, teams] = await Promise.all([
            universitySearch,
            teamSearch,
        ]);

        const result = [];
        result.push(...universities);
        result.push(...teams);

        return res.json({
            count: result.length,
            result: makeObjectCamelCase(result),
        });
    } catch (e) {
        console.error("Search Error: ", e.message);
        next(e);
    }
});

module.exports = router;
