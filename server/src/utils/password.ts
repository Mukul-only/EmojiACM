import bcrypt from "bcryptjs";

/**
 * Hashes a plaintext password using bcrypt.
 * This is an asynchronous operation.
 *
 * @param password - The plaintext password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export const hashPassword = (password: string): Promise<string> => {
  // The second argument is the "salt round" or cost factor.
  // A higher number is more secure but takes longer to compute.
  // 12 is a good, modern default.
  return bcrypt.hash(password, 10);
};

/**
 * Compares a plaintext password against a previously generated hash.
 * This is an asynchronous operation.
 *
 * @param plaintextPassword - The password provided by the user during login.
 * @param hashedPassword - The hash stored in the database.
 * @returns A promise that resolves to `true` if the passwords match, otherwise `false`.
 */
export const comparePassword = (
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plaintextPassword, hashedPassword);
};
