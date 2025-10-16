import { Schema, model, Document, Types } from "mongoose";

export interface IRegistration extends Document {
  type: "group";
  groupName: string;
  members: Types.ObjectId[];
  eventId: Types.ObjectId;
  registrationDate: Date;
}

const registrationSchema = new Schema<IRegistration>(
  // First argument: The schema definition
  {
    type: { type: String, enum: ["group"], required: true },
    groupName: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    eventId: { type: Schema.Types.ObjectId, required: true },
    registrationDate: { type: Date, default: Date.now },
  },
  // Second argument: The schema options
  {
    timestamps: true,
    // --- THIS IS THE ADDED LINE ---
    collection: "registers", // Explicitly tell Mongoose to use this collection name
  }
);

export const Registration = model<IRegistration>(
  "Registration",
  registrationSchema
);
