"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
const mongoose_1 = require("mongoose");
const registrationSchema = new mongoose_1.Schema(
// First argument: The schema definition
{
    type: { type: String, enum: ["group"], required: true },
    groupName: { type: String, required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
    eventId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    registrationDate: { type: Date, default: Date.now },
}, 
// Second argument: The schema options
{
    timestamps: true,
    // --- THIS IS THE ADDED LINE ---
    collection: "registers", // Explicitly tell Mongoose to use this collection name
});
exports.Registration = (0, mongoose_1.model)("Registration", registrationSchema);
