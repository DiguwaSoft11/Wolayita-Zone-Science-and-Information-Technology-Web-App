// Routes/contactRoute.js

import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import ContactOrg from "../models/contactSchema.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Import fileURLToPath
import { dirname } from "path"; // Import dirname
import { sendEmail } from "../emailService.js";

const router = express.Router();
dotenv.config();

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Define __dirname using fileURLToPath and dirname

// Set up multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../assets"); // Define the directory for uploads
    fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Function to validate input data
const validateContactInput = (data) => {
  const errors = {};
  if (!data.companyName || data.companyName.trim() === "") {
    errors.companyName = "Company name is required.";
  }
  if (!data.headName || data.headName.trim() === "") {
    errors.headName = "Head name is required.";
  }
  if (!data.phone || !/^\d{10}$/.test(data.phone)) {
    errors.phone = "A valid 10-digit phone number is required.";
  }
  if (!data.subject || data.subject.trim() === "") {
    errors.subject = "Subject is required.";
  }
  if (!data.message || data.message.trim() === "") {
    errors.message = "Message is required.";
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "A valid email address is required.";
  }
  return Object.keys(errors).length ? errors : null;
};

// POST route for creating a new organizational contact request
router.post(
  "/",
  upload.fields([{ name: "sealImage" }, { name: "additionalFile" }]),
  async (req, res) => {
    try {
      const { companyName, headName, phone, subject, message, email } =
        req.body;

      // Validate input data
      const validationErrors = validateContactInput({
        companyName,
        headName,
        phone,
        subject,
        message,
        email,
      });
      if (validationErrors) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: validationErrors });
      }

      // Check for existing company name
      const existingContact = await ContactOrg.findOne({
        companyName: new RegExp(`^${companyName}$`, "i"),
      });
      if (existingContact) {
        return res.status(400).json({
          message: "A contact request for this company already exists.",
        });
      }

      // Create URLs for local file storage
      let sealImageUrl = null;
      let additionalFileUrl = null;

      if (req.files["sealImage"]) {
        const sealImage = req.files["sealImage"][0];
        sealImageUrl = `assets/${sealImage.filename}`; // Save path for seal image
      }

      if (req.files["additionalFile"]) {
        const additionalFile = req.files["additionalFile"][0];
        additionalFileUrl = `assets/${additionalFile.filename}`; // Save path for additional file
      }

      // Create new ContactOrg document
      const newContact = new ContactOrg({
        companyName,
        headName,
        phone,
        subject,
        message,
        email,
        sealImage: sealImageUrl,
        additionalFile: additionalFileUrl,
        status: "pending", // default status
      });

      // Save the contact request to the database
      const savedContact = await newContact.save();

      const emailSubject = "Appointment Submitted Successfully";
      const emailText = `
        Your organizational appointment to the Wolaita Zone Science and Technology Department has been successfully submitted.
        You will receive an email for any status changes, and our experts will contact you soon.
      `;
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <a href="https://wsit.up.railway.app" target="_blank">
            <img src="https://wsit.up.railway.app/assets/logo-BcvjRe1M.png" alt="WZSIT Logo" style="display: block; margin: 0 auto; max-width: 150px;" />
          </a>
          <h2 style="text-align: center; color: #007BFF;">Appointment Submitted Successfully</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            Your organizational appointment to the Wolaita Zone Science and Technology Department has been successfully submitted.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            We have attached a feedback form. Please print it, fill it out, and resend the form image with your company seal.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Thank you,<br>
            The WZSIT Team
          </p>
          <p style="font-size: 14px;">
            Visit our website: <a href="https://wsit.up.railway.app" style="color: #007BFF; text-decoration: none;">Wolaita Zone Science and Technology Department</a>
          </p>
        </div>
      `;

      await sendEmail(email, emailSubject, emailText, emailHTML, [
        {
          filename: "form.pdf",
          path: path.join(__dirname, "../assets/feedback/form.pdf"),
        },
      ]);
      console.log("Confirmation email sent to:", email);

      res.status(201).json({
        message:
          "Contact request submitted successfully. Check your email for confirmation.",
        contact: savedContact,
      });
    } catch (error) {
      console.error("Error saving contact request:", error);
      res.status(500).json({
        message: "Failed to submit contact request",
        error: error.message,
      });
    }
  }
);

export default router;
