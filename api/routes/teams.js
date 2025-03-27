const express = require("express");
const teamService = require("../services/teamService");
const router = express.Router();

/**
 * Get a list of all teams
 * @param {boolean} req.query.showUnapproved Whether to show unapproved teams. Defaults to false.
 */
router.get("", async (req, res, next) => {
    const { showUnapproved = false, university = null } = req.query;
    const uid = req.user?.uid;

    try {
        const teamList = await teamService.getTeams(
            uid,
            university,
            showUnapproved
        );
        return res.status(200).json(teamList);
    } catch (error) {
        return next(error);
    }
});

/**
 * Get a team's information by ID
 * @param {number} req.params.id The ID of the team to get.
 */
router.get("/:teamId", async (req, res, next) => {
    const { uid = null } = req.user;
    const { showUnapproved = false, showPendingChanges = false } = req.query;
    const { teamId } = req.params;

    try {
        //const {team, pending} = await teamService.getTeam(uid, teamId, showUnapproved, showPendingChanges);
        return res.status(200).json({});
    } catch (error) {
        return next(error);
    }
});

/**
 * Create a new team.
 */
router.post("", async (req, res, next) => {
    const { teamName, universityId } = req.body;

    const uid = req?.user?.uid;
    if (!uid) return res.status(401).send();

    try {
        const team = await teamService.createTeam(uid, universityId, teamName);
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
    const uid = req?.user?.uid;
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
 * Join a team
 * Requires [Spectator role]
 */
router.put("/:teamId/join", async (req, res, next) => {
    const uid = req?.user?.uid;
    const { teamId } = req.params;
    if (!uid) return res.status(401).send();

    try {
        const team = await teamService.joinTeam(uid, teamId);
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
    const uid = req?.user?.uid;
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
    const uid = req?.user?.uid;
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
    const uid = req?.user?.uid;
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
 * If the team is not approved, approve it.  If the team has pending changes, apply and approve.
 * Requires [Admin Role] or [University Rep role and matching university ID]
 * @param {number} req.params.id The ID of the team to approve.
 */
router.put("/approve", async (req, res, next) => {
    const uid = req?.user?.uid;
    if (!uid) return res.status(401).send();

    try {
        //const team = await teamService.addUserToTeam(uid, req.body);
        return res.status(200).json({});
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
