"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
const mongoose_1 = require("mongoose");
const registrationSchema = new mongoose_1.Schema({
    groupName: { type: String, required: true, trim: true },
    members: { type: [String], required: true },
}, { timestamps: true });
exports.Registration = (0, mongoose_1.model)("Registration", registrationSchema);
