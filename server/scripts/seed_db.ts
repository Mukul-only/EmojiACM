import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model";
import { Registration } from "../src/models/registration.model";
import { hashPassword } from "../src/utils/password";
import fs from "fs";
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

    // 1. Clear Database
    console.log("Clearing existing users and registrations...");
    await User.deleteMany({});
    await Registration.deleteMany({});
    console.log("Database cleared.");

    // 2. Read Users from JSON
    const usersFilePath = path.join(__dirname, "../users.json");
    if (!fs.existsSync(usersFilePath)) {
      console.error("users.json not found at:", usersFilePath);
      process.exit(1);
    }

    const rawData = fs.readFileSync(usersFilePath, "utf-8");
    const userInputs = JSON.parse(rawData);

    if (!Array.isArray(userInputs)) {
      console.error("users.json must contain an array of user objects");
      process.exit(1);
    }

    console.log(`Found ${userInputs.length} users in users.json`);

    // 3. Prepare Data
    const password = await hashPassword("Version26");
    const usersToInsert = [];
    const teamsToInsert = [];

    // Process users in pairs
    for (let i = 0; i < userInputs.length; i += 2) {
      const user1Input = userInputs[i];
      const user2Input = userInputs[i + 1];

      // Generate Team Name (e.g., Team_001 for first pair)
      const teamIndex = Math.floor(i / 2) + 1;
      const teamName = `Team_${String(teamIndex).padStart(3, "0")}`;

      // User 1
      if (user1Input) {
        usersToInsert.push({
          username: user1Input.username,
          password: password,
          name: `User ${user1Input.username}`,
          email: `${user1Input.username.toLowerCase()}@example.com`,
          rollNumber: user1Input.username,
          teamName: teamName,
          isAdmin: false,
        });
      }

      // User 2 (if exists)
      if (user2Input) {
        usersToInsert.push({
          username: user2Input.username,
          password: password,
          name: `User ${user2Input.username}`,
          email: `${user2Input.username.toLowerCase()}@example.com`,
          rollNumber: user2Input.username,
          teamName: teamName,
          isAdmin: false,
        });

        // Create Team Registration (only if we have a pair)
        teamsToInsert.push({
          groupName: teamName,
          members: [user1Input.username, user2Input.username],
        });
      } else if (user1Input) {
        // Handle last user if odd count - add to solo team or handle as needed
        // For now, adding to a team with just themselves to ensure they can play/join
        console.warn(
          `Warning: User ${user1Input.username} has no partner. Creating solo team.`,
        );
        teamsToInsert.push({
          groupName: teamName,
          members: [user1Input.username],
        });
      }
    }

    // 4. Insert Data
    if (usersToInsert.length > 0) {
      const createdUsers = await User.insertMany(usersToInsert);
      console.log(`Successfully created ${createdUsers.length} users.`);
      createdUsers.forEach((u) =>
        console.log(` - ${u.username} (${u.teamName})`),
      );
    }

    if (teamsToInsert.length > 0) {
      const createdTeams = await Registration.insertMany(teamsToInsert);
      console.log(`Successfully created ${createdTeams.length} teams.`);
      createdTeams.forEach((t) =>
        console.log(` - ${t.groupName}: ${t.members.join(", ")}`),
      );
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seed();
