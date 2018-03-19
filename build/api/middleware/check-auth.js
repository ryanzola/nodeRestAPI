"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
let checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
    }
    catch (error) {
        return res.status(401).json({
            message: "authentication failed again"
        });
    }
    next();
};
exports.default = checkAuth;
