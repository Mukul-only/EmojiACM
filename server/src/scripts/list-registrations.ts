import mongoose from "mongoose";
import { Registration } from "../models/registration.model";

const MONGO_URI =
  "mongodb+srv://mukulkushwahaa:ZsK%3ETAjMQ2x6%3ADB%24@cluster0.ylfhapq.mongodb.net/emoji?retryWrites=true&w=majority&appName=Cluster0";

async function listAllRegistrations() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all registrations
    const registrations = await Registration.find({});

    console.log("\n=== All Team Registrations ===\n");
    if (registrations.length === 0) {
      console.log("No team registrations found in the database.");
    } else {
      registrations.forEach((reg, index) => {
        console.log(`Team ${index + 1}:`);
        console.log("Group Name:", reg.groupName);
        console.log("Members (Roll Numbers):", reg.members);
        console.log("Registration ID:", reg._id);
        console.log("------------------------");
      });
      console.log(`\nTotal Teams: ${registrations.length}`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

listAllRegistrations();
