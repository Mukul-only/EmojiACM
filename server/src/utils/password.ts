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

// IIFE to generate a hash for "123" when the script is run directly with a specific argument.
// This is useful for development/seeding without affecting the library functions.
// To run: ts-node-dev --respawn src/utils/password.ts --generate-hash
(async () => {
  if (process.argv.includes("--generate-hash")) {
    console.log('Generating hash for password: "123"');
    const hashedPassword = await hashPassword("123");
    console.log("Hashed password:", hashedPassword);
    process.exit(0);
  }
})();
