import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";
import { Registration } from "../models/registration.model";
import { comparePassword } from "../utils/password";
import { signJwt } from "../utils/jwt";
import { z } from "zod";
import { signupSchema, loginSchema } from "../utils/validate";

const createAndSendToken = (res: Response, userId: string): string => {
  const token = signJwt({ userId });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, rollNumber, teamName } =
      signupSchema.parse(req).body;

    // Check for existing user by username, email, or roll number
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { rollNumber }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.rollNumber === rollNumber) {
        return res
          .status(400)
          .json({ message: "Roll number already registered" });
      }
    }

    const user = await User.create({
      username,
      password,
      name,
      email,
      rollNumber,
      teamName,
    });

    const userObject = user.toObject();
    delete userObject.password;
    const token = createAndSendToken(res, user.id);
    res.status(201).json({ user: userObject, token });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json(error.issues);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// --- THIS ENTIRE FUNCTION IS UPDATED ---
export const login = async (req: Request, res: Response) => {
  try {
    // 1. Use the new 'identifier' from our updated schema
    const { identifier, password } = loginSchema.parse(req).body;

    console.log(`[LOGIN ATTEMPT] Identifier: "${identifier}"`);

    // 2. Use the $or operator to find a user by username, email, OR rollNumber
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { rollNumber: identifier },
      ],
    }).select("+password"); // Important: still need to select the password

    if (!user) {
      console.log(
        `[LOGIN FAILED] No user found for identifier: "${identifier}"`
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(
      `[LOGIN] User "${user.username}" found. Comparing passwords...`
    );

    const passwordsMatch = await comparePassword(password, user.password!);

    if (!passwordsMatch) {
      console.log(
        `[LOGIN FAILED] Password comparison failed for user "${user.username}"`
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(
      `[LOGIN SUCCESS] Credentials valid for user "${user.username}"`
    );

    const userObject = user.toObject();
    delete userObject.password;
    const token = createAndSendToken(res, user.id);
    res.status(200).json({ user: userObject, token });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json(error.issues);
    console.error("[LOGIN FAILED] Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    // Find the registration where this user is a member
    const registration = await Registration.findOne({
      type: "group",
      members: { $all: [user._id] },
    });

    if (registration) {
      // Find the other team member (excluding current user)
      const teamMembers = await User.find({
        _id: {
          $in: registration.members,
          $ne: user._id, // Exclude current user
        },
      }).select("-password");

      return res.status(200).json({ user, teamMembers });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ message: "Server error fetching profile data" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
