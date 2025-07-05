import jwt from "jsonwebtoken";
import Expert from "../models/ExpertSchema.js";
import User from "../models/UserSchema.js";
import Admin from "../models/AdminSchema.js";

export const authenticate = async (req, res, next) => {
  // get token from headers
  const authToken = req.headers.authorization;

  // check token existence
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;

    next(); // move to the next middleware or route handler
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;

  const client = await User.findById(userId);
  const expert = await Expert.findById(userId);
  const admin = await Admin.findById(userId);

  if (client) {
    user = client;
  }

  if (expert) {
    user = expert;
  }

  if (admin) {
    user = admin;
  }

  if (!roles.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You're not authorized" });
  }

  next(); // move to the next middleware or route handler
};
