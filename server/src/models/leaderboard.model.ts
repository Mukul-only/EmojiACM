import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a single leaderboard entry for a completed team game.
 */
export interface ILeaderboard extends Document {
  registrationId: Types.ObjectId; // A unique reference to the game session/team registration
  teamName: string; // The name of the team, e.g., "Emoji Masters"
  members: Types.ObjectId[]; // The ObjectId's of the players on the team
  score: number; // The final accumulated score for the team
  createdAt: Date;
  updatedAt: Date;
}
// .
const leaderboardSchema = new Schema<ILeaderboard>(
  {
    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true, // Ensures a team's single game session is only recorded once
    },
    teamName: {
      type: String,
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add an index on the score for fast sorting of the leaderboard.
leaderboardSchema.index({ score: -1 });

export const Leaderboard = model<ILeaderboard>(
  "Leaderboard",
  leaderboardSchema
);
