const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: "Access Denied: No Token Provided" });
    }

    jwt.verify(token, "your_secret_key", (err, user) => {
        // FIXME  "your_secret_key" should probably be something else...
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }

        req.user = user; // Attach user information to request
        next();
    });
};
