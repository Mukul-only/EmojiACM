import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config";
import { Types } from "mongoose";

const { secret, expiresIn } = config.jwt;

/**
 * Creates and signs a new JSON Web Token.
 */
export const signJwt = (payload: {
  userId: Types.ObjectId | string;
}): string => {
  // We use a type assertion here. We know our `expiresIn` string is valid at runtime,
  // but TypeScript's strict "StringValue" type doesn't match our generic "string" type.
  // This tells TypeScript to trust us.
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

/**
 * Verifies a JSON Web Token.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export const verifyJwt = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded;
  } catch (e) {
    // This will catch errors like expired tokens, invalid signatures, etc.
    return null;
  }
};
