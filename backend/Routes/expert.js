import express from "express";
import {
  updateExpert,
  deleteExpert,
  getAllExpert,
  getSingleExpert,
  getExpertProfile,
} from "../Controllers/expertController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

// Nested route
router.use("/:expertId/reviews", reviewRouter);

router.get("/:id", getSingleExpert);
router.get("/", getAllExpert);
router.put("/:id", updateExpert);
router.delete("/:id", authenticate, restrict(["expert"]), deleteExpert);

router.get("/profile/me", authenticate, restrict(["expert"]), getExpertProfile);

export default router;
