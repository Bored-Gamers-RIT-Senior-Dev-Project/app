const express = require("express");
const router = express.Router();

router.post("/test", async (req, res) => {
    await new Promise((resolve) => {
        setTimeout(resolve, req.body?.sleep || 3000);
    });
    console.log("Received the following from the client:", req.body);
    return res
        .status(200)
        .send(JSON.stringify({ ...req.body, served: true }, undefined, 4));
});

module.exports = router;
