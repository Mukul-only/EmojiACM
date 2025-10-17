import { Schema, model, Document, Types } from "mongoose";

export interface IRegistration extends Document {
  groupName: string;
  members: string[]; // Array of roll numbers
}

const registrationSchema = new Schema<IRegistration>(
  {
    groupName: { type: String, required: true },
    members: [{ type: String, required: true }], // Store roll numbers directly
  },
  // Second argument: The schema options
  {
    timestamps: true,
    // --- THIS IS THE ADDED LINE ---
    collection: "registrations", // Explicitly tell Mongoose to use this collection name
  }
);

export const Registration = model<IRegistration>(
  "Registration",
  registrationSchema
);
