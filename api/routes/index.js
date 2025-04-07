const express = require("express");
const router = express.Router();
const { makeObjectCamelCase } = require("../utils");
const teamService = require("../services/teamService");
const universityService = require("../services/universityService");
const adminService = require("../services/adminService");

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
    value = value ?? "";

    try {
        const universitySearch = universityService.searchUniversities(value);
        const teamSearch = teamService.searchTeams(value);

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

router.get("/roles", async (req, res, next) => {
    try {
        const uid = req.user?.uid;
        if (!uid) return res.status(401).send();

        const roles = await adminService.getRoleList(uid);
        return res.json(roles);
    } catch (e) {
        next(e);
    }
});

router.get("/reports", async (req, res, next) => {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).send();
    try {
        const report = await adminService.generateReports(uid);
        return res.json(report);
    } catch (e) {
        next(e);
    }
});

router.get("/representative", async (req, res, next) => {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).send();
    try {
        const tickets = await adminService.getUniversityAdminTickets(uid);
        return res.json(tickets);
    } catch (e) {
        next(e);
    }
});

router.put("/representative/approve", async (req, res, next) => {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).send();
    try {
        console.log(req.body);
        return res.json(true);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
