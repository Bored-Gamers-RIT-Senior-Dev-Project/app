const express = require("express");
const router = express.Router();
const tournamentService = require("../services/tournamentService");
const { makeObjectCamelCase } = require("../utils");

// All tournaments
router.get("/", async (req, res, next) => {
  try {
    const tournaments = await tournamentService.getTournaments();
    res.status(200).json(makeObjectCamelCase(tournaments));
  } catch (err) {
    next(err);
  }
});

// All tournaments with matches
router.get("/with-matches", async (req, res, next) => {
  try {
    const data = await tournamentService.getTournamentsWithMatches();
    res.status(200).json(makeObjectCamelCase(data));
  } catch (err) {
    next(err);
  }
});

// ✅ New: Get matches for one tournament
router.get("/:id/matches", async (req, res, next) => {
  try {
    const data = await tournamentService.getTournamentWithMatchesById(req.params.id);
    if (!data) return res.status(404).json({ message: "Tournament not found" });
    res.status(200).json(makeObjectCamelCase(data));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
