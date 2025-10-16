import { Schema, model, Document } from "mongoose";
import { hashPassword } from "../utils/password";

export interface IUser extends Document {
  username: string;
  password?: string;
  name: string;
  email: string;
  rollNumber: string;
  teamName?: string;
  gamesPlayed?: number;
  totalScore?: number;
  achievements?: string[];
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    teamName: { type: String, trim: true },
    gamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    achievements: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export const User = model<IUser>("User", userSchema);
