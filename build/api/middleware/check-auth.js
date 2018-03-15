var jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
    try {
        var token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
    }
    catch (error) {
        return res.status(401).json({
            message: "authentication failed again"
        });
    }
    next();
};
