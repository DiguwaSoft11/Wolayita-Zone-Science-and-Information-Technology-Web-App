import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import expertRoute from "./Routes/expert.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";
import uploadRoute from "./Routes/upload.js";
import contactRoute from "./Routes/contactRoute.js";
import Org_appointmentsRoute from "./Routes/Org_appointments.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Set up HTTP and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://wzsit-backend.up.railway.app",
      "https://wolaita-sit.up.railway.app",
      //"https://wsit.up.railway.app",
      //"https://wst-webapp-production.up.railway.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// WebRTC Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected with ID:", socket.id);
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    console.log(`User with ID ${socket.id} disconnected`);
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    console.log(`Calling user: ${data.userToCall}`);
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    console.log(`Answering call for user: ${data.to}`);
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// Dynamic CORS configuration for API routes
app.use((req, res, next) => {
  const allowedOrigins = [
      "https://wzsit-backend.up.railway.app",
      "https://wolaita-sit.up.railway.app",
    //"https://wsit.up.railway.app",
    //"https://wst-webapp-production.up.railway.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Global CORS handling for non-Socket.io requests
app.options("*", cors()); // Preflight handling

// Routes
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/experts", expertRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/Org_appointments", Org_appointmentsRoute);

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database is connected");
  } catch (err) {
    console.log("MongoDB database connection failed", err);
  }
};

// Start server
server.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
