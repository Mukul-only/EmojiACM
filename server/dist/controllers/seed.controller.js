"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTeams = exports.seedUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../models/user.model");
const registration_model_1 = require("../models/registration.model");
const seedUsers = async (req, res) => {
    try {
        await user_model_1.User.deleteMany({});
        console.log("Users deleted");
        // req.body should be an array
        const users = Array.isArray(req.body) ? req.body : [req.body];
        const usersToSeed = users.map((user) => {
            // Convert _id if it's in extended JSON format
            let _id = user._id;
            if (_id && typeof _id === "object" && _id.$oid) {
                _id = new mongoose_1.default.Types.ObjectId(_id.$oid);
            }
            // Convert createdAt / updatedAt if they’re in $date format
            let createdAt = user.createdAt;
            if (createdAt && createdAt.$date) {
                createdAt = new Date(createdAt.$date);
            }
            let updatedAt = user.updatedAt;
            if (updatedAt && updatedAt.$date) {
                updatedAt = new Date(updatedAt.$date);
            }
            return {
                _id, // keep same ID if provided
                username: user.rollNumber,
                name: user.username,
                email: user.email,
                rollNumber: user.rollNumber,
                password: user.password,
                isAdmin: user.isAdmin ?? false,
                createdAt,
                updatedAt,
                __v: user.__v ?? 0,
            };
        });
        await user_model_1.User.insertMany(usersToSeed);
        console.log("Users seeded");
        res.status(200).json({ message: "Users seeded successfully" });
    }
    catch (error) {
        console.error("Error seeding users:", error);
        res.status(500).json({ message: "Error seeding users" });
    }
};
exports.seedUsers = seedUsers;
const seedTeams = async (req, res) => {
    try {
        // 1️⃣ Clear existing registrations
        await registration_model_1.Registration.deleteMany({});
        console.log("Previous registrations deleted");
        // 2️⃣ Parse request body
        const teams = Array.isArray(req.body) ? req.body : [req.body];
        // 3️⃣ Filter teams by eventId
        const TARGET_EVENT_ID = "66817b2f3a4b5c6d7e8f9a03";
        const filteredTeams = teams.filter((team) => {
            const eventId = team.eventId?.$oid || team.eventId;
            return eventId === TARGET_EVENT_ID;
        });
        // 4️⃣ Build map from user _id -> rollNumber
        const allUsers = await user_model_1.User.find({}, "_id rollNumber").lean();
        const userIdToRollNumber = {};
        allUsers.forEach((u) => {
            userIdToRollNumber[u._id.toString()] = u.rollNumber;
        });
        // 5️⃣ Transform filtered teams
        const teamsToSeed = filteredTeams.map((team) => {
            // Convert _id if needed
            let _id = team._id;
            if (_id && typeof _id === "object" && _id.$oid) {
                _id = new mongoose_1.default.Types.ObjectId(_id.$oid);
            }
            // Convert dates if needed
            // Convert dates if needed
            const createdAt = team.createdAt?.$date
                ? new Date(team.createdAt.$date)
                : team.createdAt;
            const updatedAt = team.updatedAt?.$date
                ? new Date(team.updatedAt.$date)
                : team.updatedAt;
            // Map members ObjectIds to roll numbers
            const memberRollNumbers = (team.members || []).map((m) => {
                const id = m?.$oid || m; // get ObjectId string
                const rollNumber = userIdToRollNumber[id.toString()];
                if (!rollNumber) {
                    console.warn(`Warning: userId ${id} not found in Users table`);
                }
                return rollNumber || id.toString(); // fallback to id if rollNumber missing
            });
            return {
                _id,
                groupName: team.groupName,
                members: memberRollNumbers, // ✅ now storing roll numbers
                createdAt,
                updatedAt,
                __v: typeof team.__v === "number" ? team.__v : 0, // make sure __v is number
            };
        });
        // 6️⃣ Insert into Registration
        await registration_model_1.Registration.insertMany(teamsToSeed);
        console.log("Teams seeded", teamsToSeed);
        res.status(200).json({
            message: "Teams seeded successfully",
            count: teamsToSeed.length,
        });
    }
    catch (error) {
        console.error("Error seeding teams:", error);
        res.status(500).json({ message: "Error seeding teams" });
    }
};
exports.seedTeams = seedTeams;
