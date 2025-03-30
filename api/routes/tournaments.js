const express = require("express");
const router = express.Router();
const tournamentService = require("../services/tournamentService");
const { makeObjectCamelCase } = require("../utils");


router.get("/", async (req, res, next) => {
  try {
    const tournaments = await tournamentService.getTournaments();
    console.log("Fetched Tournaments from DB:", tournaments); 
    res.status(200).json(makeObjectCamelCase(tournaments));
  } catch (err) {
    console.error("Backend Error:", err); 
    next(err);
  }
});

router.get("/with-matches", async (req, res, next) => {
  try {
    const data = await tournamentService.getTournamentsWithMatches();
    res.status(200).json(makeObjectCamelCase(data));
  } catch (err) {
    next(err);
  }
});


module.exports = router;
