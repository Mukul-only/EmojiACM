"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seed_controller_1 = require("../controllers/seed.controller");
const router = (0, express_1.Router)();
router.post("/users", seed_controller_1.seedUsers);
router.post("/teams", seed_controller_1.seedTeams);
exports.default = router;
