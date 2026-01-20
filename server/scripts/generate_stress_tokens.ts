import mongoose from "mongoose";
import { User } from "../src/models/user.model";
import { Registration } from "../src/models/registration.model";
import { signJwt } from "../src/utils/jwt";
import config from "../src/config";
import fs from "fs";
import path from "path";

const NUM_USERS = 100; // 50 Teams
const OUTPUT_FILE = path.join(__dirname, "../users.csv");

async function generate() {
  await mongoose.connect(config.mongoUri);
  console.log("Connected to DB");

  // Cleanup old stress test data
  await User.deleteMany({ username: { $regex: /^stress_user_/ } });
  await Registration.deleteMany({ groupName: { $regex: /^StressTeam_/ } });
  console.log("Cleaned old data");

  const csvStream = fs.createWriteStream(OUTPUT_FILE);
  csvStream.write("username,token,roomId\n");

  const users = [];
  
  // Create Users
  for (let i = 0; i < NUM_USERS; i++) {
    users.push({
      username: `stress_user_${i}`,
      name: `Stress Bot ${i}`,
      email: `stress_${i}@test.com`,
      rollNumber: `STRESS_${i}`,
      password: "password123", // Doesn't matter, we generate token directly
    });
  }
  
  const createdUsers = await User.insertMany(users) as any[]; // Cast to any array to avoid TS issues with _id
  console.log(`Created ${createdUsers.length} users`);

  // Create Teams
  for (let i = 0; i < NUM_USERS; i += 2) {
    const user1 = createdUsers[i];
    const user2 = createdUsers[i + 1];
    
    if (!user1 || !user2) break;

    const team = await Registration.create({
      groupName: `StressTeam_${i/2}`,
      members: [user1.rollNumber, user2.rollNumber]
    });

    const token1 = signJwt({ userId: user1._id.toString() });
    const token2 = signJwt({ userId: user2._id.toString() });

    csvStream.write(`${user1.username},${token1},${team._id}\n`);
    csvStream.write(`${user2.username},${token2},${team._id}\n`);
  }

  csvStream.end();
  console.log(`Tokens written to ${OUTPUT_FILE}`);
  
  await mongoose.disconnect();
}

generate().catch(console.error);
