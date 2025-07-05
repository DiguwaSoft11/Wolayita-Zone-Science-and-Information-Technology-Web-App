import Expert from "../models/ExpertSchema.js";
import Booking from "../models/BookingSchema.js";

export const updateExpert = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedExpert = await Expert.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedExpert,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteExpert = async (req, res) => {
  const id = req.params.id;

  try {
    await Expert.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleExpert = async (req, res) => {
  const id = req.params.id;

  try {
    const expert = await Expert.findById(id)
      .populate("reviews")
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Expert Found",
      data: expert,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user Found" });
  }
};

export const getAllExpert = async (req, res) => {
  try {
    const { query } = req.query;
    let experts;

    if (query) {
      experts = await Expert.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      experts = await Expert.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res.status(200).json({
      success: true,
      message: "Expert Found",
      data: experts,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

export const getExpertProfile = async (req, res) => {
  const expertId = req.userId;

  try {
    const expert = await Expert.findById(expertId);

    if (!expert) {
      return res
        .status(404)
        .json({ success: false, message: "Expert not found" });
    }

    const { password, ...rest } = expert._doc;
    const appointments = await Booking.find({ expert: expertId });

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};
