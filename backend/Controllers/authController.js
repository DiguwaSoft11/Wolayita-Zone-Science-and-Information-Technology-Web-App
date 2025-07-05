import User from "../models/UserSchema.js";
import Expert from "../models/ExpertSchema.js";
import Admin from "../models/AdminSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  // Validate input fields
  if (!email || !password || !name || !role) {
    return res
      .status(400)
      .json({ message: "Email, password, name, and role are required" });
  }

  if (typeof password !== "string") {
    return res.status(400).json({ message: "Password must be a valid string" });
  }

  try {
    let user;

    if (role === "client") {
      user = await User.findOne({ email });
    } else if (role === "expert") {
      user = await Expert.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    if (!salt) {
      throw new Error("Failed to generate salt");
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    if (!hashedPassword) {
      throw new Error("Failed to hash password");
    }

    if (role === "client") {
      user = new User({
        name,
        email,
        password: hashedPassword,
        photo,
        gender,
        role,
      });
    } else if (role === "expert") {
      user = new Expert({
        name,
        email,
        password: hashedPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (err) {
    console.error("Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal server error, Try again" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    let user;

    const client = await User.findOne({ email });
    const expert = await Expert.findOne({ email });
    const admin = await Admin.findOne({ email });

    if (client) {
      user = client;
    } else if (expert) {
      user = expert;
    } else if (admin) {
      user = admin;
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    const { password: userPassword, role, ...rest } = user._doc;

    res.status(200).json({
      status: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};
