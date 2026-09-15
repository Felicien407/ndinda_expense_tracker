import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const getSecret = () => process.env.JWT_SECRET || "development-secret";

const createToken = (userId) =>
  jwt.sign({ userId: userId.toString() }, getSecret(), { expiresIn: "7d" });

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const databaseUnavailable = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: "Database is not connected" });
    return true;
  }
  return false;
};

export const register = async (req, res) => {
  if (databaseUnavailable(res)) return;

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Account created", user: userResponse(user) });
};

export const login = async (req, res) => {
  if (databaseUnavailable(res)) return;

  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase().trim() });
  const passwordMatches = user && (await bcrypt.compare(password || "", user.password));

  if (!user || !passwordMatches) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  res.json({ token: createToken(user._id), user: userResponse(user) });
};

export const getCurrentUser = async (req, res) => {
  if (databaseUnavailable(res)) return;
  const user = await User.findById(req.user.id).select("name email");
  if (!user) return res.status(401).json({ message: "User not found" });
  res.json({ user: userResponse(user) });
};
