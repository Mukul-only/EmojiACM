import mongoose from "mongoose";
import { Registration } from "../models/registration.model";
import config from "../config";

async function createTestRegistrations() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

    const testTeams = [
      {
        groupName: "Test Team Alpha",
        members: ["222001", "222002"], // Test Users 1 and 2
      },
      {
        groupName: "Test Team Beta",
        members: ["222003", "222004"], // Test Users 3 and 4
      },
    ];

    for (const teamData of testTeams) {
      // Check if team already exists
      const existingTeam = await Registration.findOne({
        groupName: teamData.groupName,
      });
      if (existingTeam) {
        console.log(`Team ${teamData.groupName} already exists`);
        continue;
      }

      // Create new team registration
      const registration = await Registration.create(teamData);
      console.log(
        `Created team registration: ${registration.groupName} with members ${registration.members.join(", ")}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createTestRegistrations();
