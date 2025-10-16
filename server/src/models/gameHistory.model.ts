import { Schema, model, Document, Types } from "mongoose";

export interface IGameHistory extends Document {
  gameId: string;
  players: {
    id: Types.ObjectId;
    username: string;
    role: "clue-giver" | "guesser";
  }[];
  finalScore: number;
  roundsPlayed: number;
  totalRounds: number;
  completedAt: Date;
  duration: number; // in seconds
}

const gameHistorySchema = new Schema<IGameHistory>(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
    },
    players: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["clue-giver", "guesser"],
          required: true,
        },
      },
    ],
    finalScore: {
      type: Number,
      required: true,
      default: 0,
    },
    roundsPlayed: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRounds: {
      type: Number,
      required: true,
      default: 25,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient queries
gameHistorySchema.index({ "players.id": 1 });
gameHistorySchema.index({ completedAt: -1 });

export const GameHistory = model<IGameHistory>(
  "GameHistory",
  gameHistorySchema
);
