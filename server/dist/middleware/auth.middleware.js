"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../models/user.model");
const authenticateToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = (0, jwt_1.verifyJwt)(token);
    if (!decoded) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
    try {
        const user = await user_model_1.User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};
exports.authenticateToken = authenticateToken;
