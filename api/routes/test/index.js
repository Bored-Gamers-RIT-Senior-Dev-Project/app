const express = require("express");
const router = express.Router();

router.post("/test", (req, res) => {
  console.log(req.body);
  return res.status(200).send(JSON.stringify(req.body, undefined, 4));
});

module.exports = router;
