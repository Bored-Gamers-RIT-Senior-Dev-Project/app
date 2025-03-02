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
    let { searchTerm } = req.body;
    searchTerm = searchTerm ? searchTerm : "";

    try {
        const universitySearch = universityService.searchUniversities(
            searchTerm,
            searchTerm
        );
        const teamSearch = teamService.searchTeams(searchTerm);

        const [universities, teams] = await Promise.all([
            universitySearch,
            teamSearch,
        ]);

        return res.json({
            universities: makeObjectCamelCase(universities),
            teams: makeObjectCamelCase(teams),
        });
    } catch (e) {
        console.error("Search Error: ", e.message);
        next(e);
    }
});

module.exports = router;
