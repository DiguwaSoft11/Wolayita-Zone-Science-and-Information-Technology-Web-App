import express from "express";
import contactorgs from "../models/contactSchema.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "../assets/feedback" });

// Route to get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await contactorgs.find();
    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// Route to get a specific appointment by ID
router.get("/:id", async (req, res) => {
  try {
    const appointment = await contactorgs.findById(req.params.id);
    if (appointment) {
      res.json({ appointment });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
});

// Serve file downloads
router.get("/file/:filename", (req, res) => {
  const file = path.join(__dirname, "../assets/feedback", req.params.filename);
  res.download(file, (err) => {
    if (err) res.status(500).send("Error downloading file");
  });
});

// Update appointment status and upload feedback
router.put("/:id", upload.single("feedback"), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const feedback = req.file ? req.file.filename : null;

  try {
    const update = { status };
    if (status === "Done" && feedback) update.feedback = feedback;

    const appointment = await contactorgs.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (appointment) {
      res.json({ appointment });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment" });
  }
});

export default router;
