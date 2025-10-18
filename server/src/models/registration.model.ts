import { Schema, model, Document } from "mongoose";

export interface IRegistration extends Document {
  groupName: string;
  members: string[];
}

const registrationSchema = new Schema<IRegistration>(
  {
    groupName: { type: String, required: true, trim: true },
    members: { type: [String], required: true },
  },
  { timestamps: true }
);

export const Registration = model<IRegistration>(
  "Registration",
  registrationSchema
);