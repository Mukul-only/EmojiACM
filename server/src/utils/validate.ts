import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    rollNumber: z.string().min(1, "Roll number is required"),
    teamName: z.string().optional(),
  }),
});

// --- CHANGE IS HERE ---
export const loginSchema = z.object({
  body: z.object({
    // Renamed 'username' to 'identifier' to reflect its flexible nature.
    identifier: z.string().min(1, "Identifier is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Emoji validation removed as we now use react-icons instead of emojis
