import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model";
import { Registration } from "../src/models/registration.model";
import { hashPassword } from "../src/utils/password";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const seed = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not found in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // 1. Create Dummy Users
    const password = await hashPassword("password123");

    const users = [
      {
        username: "antigravity_1",
        password: password,
        name: "Antigravity User 1",
        email: "anti1@example.com",
        rollNumber: "999999001",
        isAdmin: false,
        teamName: "Antigravity Team",
      },
      {
        username: "antigravity_2",
        password: password,
        name: "Antigravity User 2",
        email: "anti2@example.com",
        rollNumber: "999999002",
        isAdmin: false,
        teamName: "Antigravity Team",
      },
    ];

    // Cleanup existing if they exist
    await User.deleteMany({
      rollNumber: { $in: users.map((u) => u.rollNumber) },
    });
    console.log("Cleaned up old dummy users");

    const createdUsers = await User.insertMany(users);
    console.log("Created Users:");
    createdUsers.forEach((u) =>
      console.log(` - ${u.username} (${u.rollNumber})`),
    );

    // 2. Create Team
    const teamName = "Antigravity Team";
    const team = {
      groupName: teamName,
      members: users.map((u) => u.rollNumber),
    };

    // Cleanup existing team
    await Registration.deleteMany({ groupName: teamName });
    console.log("Cleaned up old dummy team");

    const createdTeam = await Registration.create(team);
    console.log(
      `Created Team: ${createdTeam.groupName} with members ${createdTeam.members.join(", ")}`,
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seed();
