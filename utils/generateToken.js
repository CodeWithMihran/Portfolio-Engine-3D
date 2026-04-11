import jwt from "jsonwebtoken";

/**
 * @param {string} id - The Admin's MongoDB _id
 * @param {string} type - 'access' for short-term, 'refresh' for long-term
 */
const generateToken = (id, type = "access") => {
  // Use a longer expiry for the "refresh" style token to keep you logged in
  const expiresIn = type === "access" ? "7d" : "30d";

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

export default generateToken;