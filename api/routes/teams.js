const express = require("express");
const router = express.Router();

/**
 * Get a list of all teams
 */
router.get("", async (req, res, next) => {
    const { showUnapproved = false } = req.query;
    const { uid = null } = req.user;

    try {
        //const teamList = await teamService.getTeams(uid, showUnapproved);
        return res.status(200).json([]);
    } catch (error) {
        return next(error);
    }
});

/**
 * Get a team's information by ID
 * @param {number} req.params.id The ID of the team to get.
 */
router.get("/:id", async (req, res, next) => {
    const { uid = null } = req.user;
    const { showUnapproved = false, showPendingChanges = false } = req.query;
    const { id } = req.params;

    try {
        //const team = await teamService.getTeam(req.params.id);
        return res.status(200).json({});
    } catch (error) {
        return next(error);
    }
});

/**
 * Create a new team.
 */
router.post("", async (req, res, next) => {
    const { teamName, profileImageUrl, universityId } = req.body;

    const { uid } = req.user;
    if (!uid) return res.status(401).send();

    try {
        //const team = await teamService.createTeam(uid, teamName, profileImageUrl, universityId);
        return res.status(201).json({});
    } catch (error) {
        return next(error);
    }
});

/**
 * Add a user to a team.
 * Requires []
 */
router.put("/:teamId/assign", async (req, res, next) => {
    const { uid } = req.user;
    const { teamId } = req.params;
    const { userId } = req.body;
    if (!uid) return res.status(401).send();

    try {
        //const team = await teamService.addUserToTeam(uid, teamId, userId);
        return res.status(200).json({});
    } catch (error) {
        return next(error);
    }
});

/**
 * Remove a user from their team.
 * Requires [Admin Role] or [University Rep role and matching team/player university ID] or [Team Captain role and matching teamID] or [Matching User ID]
 */
router.put("/:teamId/remove", async (req, res, next) => {
    const { uid } = req.user;
    const { teamId } = req.params;
    const { userId } = req.body;
    if (!uid) return res.status(401).send();

    try {
        //const team = await teamService.removeUserFromTeam(uid, teamId, userId);
        return res.status(200).json({});
    } catch (error) {
        return next(error);
    }
});

/**
 * Update a team's information (admin variant)
 * Requires [Admin Role] or [University Rep role and matching university ID]
 */
router.put("/:teamId", async (req, res, next) => {
    const { uid } = req.user;
    if (!uid) return res.status(401).send();

    const { teamId } = req.params;
    const { teamName, profileImageUrl, universityId } = req.body;

    try {
        //const team = await teamService.updateTeam(uid, teamId, teamName, profileImageUrl, universityId);
        return res.status(200).json({});
    } catch (error) {
        return next(error);
    }
});

/**
 * Update a team's information (user variant, changes must be reviewed)
 * Requires [Team Captain role and matching teamID]
 */
router.post("/:teamId/update", async (req, res, next) => {
    const { uid } = req.user;
    if (!uid) return res.status(401).send();

    const { teamId } = req.params;
    const { teamName, profileImageUrl, universityId } = req.body;

    try {
        //const status = await teamService.postUpdateRequest(uid, teamId, teamName, profileImageUrl, universityId);
        //return res.status(200).json({ status });
    } catch (error) {
        return next(error);
    }
});

/**
 * Approve a team.
 * Requires [Admin Role] or [University Rep role and matching university ID]
 * @param {number} req.params.id The ID of the team to approve.
 */
router.put("/approve", async (req, res, next) => {
    const { uid } = req.user;
    if (!uid) return res.status(401).send();

    try {
        //const team = await teamService.addUserToTeam(uid, req.body);
        return res.status(200).json({});
    } catch (error) {
        return next(error);
    }
});
