"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const admin = (req, res, next) => {
    const user = req.user;
    if (user && user.isAdmin) {
        next();
    }
    else {
        res.status(403).json({ message: "Forbidden: Admins only" });
    }
};
exports.admin = admin;
