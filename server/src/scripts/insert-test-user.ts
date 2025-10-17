import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import config from "../config";

async function insertTestUser() {
  try {
    console.log("Connecting to MongoDB");
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

    // Plain text password that you'll use to login
    const plainPassword = "Test@123";

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log("\n===========================================");
    console.log("LOGIN CREDENTIALS FOR ALL TEST USERS:");
    console.log("Password:", plainPassword);
    console.log("===========================================\n");

    const testUsers = [
      {
        _id: "68f238b41b1f8b2a89dd36ef",
        username: "test_user_1",
        name: "Test User 1",
        dept: "Computer Science",
        branch: "MCA",
        mobno: "9696373283",
        rollNumber: "222001",
        email: "testuser1@test.com",
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      },
      {
        _id: "68f238b41b1f8b2a89dd36ee",
        username: "test_user_2",
        name: "Test User 2",
        dept: "Computer Science",
        branch: "MCA",
        mobno: "9696373284",
        rollNumber: "222002",
        email: "testuser2@test.com",
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      },
      {
        _id: "68f238b41b1f8b2a89dd36ed",
        username: "test_user_3",
        name: "Test User 3",
        dept: "Computer Science",
        branch: "MCA",
        mobno: "9696373285",
        rollNumber: "222003",
        email: "testuser3@test.com",
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      },
      {
        _id: "68f238b41b1f8b2a89dd36ec",
        username: "test_user_4",
        name: "Test User 4",
        dept: "Computer Science",
        branch: "MCA",
        mobno: "9696373286",
        rollNumber: "222004",
        email: "testuser4@test.com",
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      },
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findById(userData._id);
      if (existingUser) {
        console.log(`User ${userData.username} already exists`);
        continue;
      }

      // Create new user
      const user = new User(userData);
      await user.save();
      console.log(
        `Created test user: ${user.username} with roll number ${user.rollNumber}`
      );
    }

    console.log("\n===========================================");
    console.log("All test users created successfully");
    console.log("Use password:", plainPassword, "to login");
    console.log("===========================================\n");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

insertTestUser();
