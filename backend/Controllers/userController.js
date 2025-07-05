import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Expert from "../models/ExpertSchema.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User Found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user Found" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Users Found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    res
      .status(200)
      .json({
        success: true,
        message: "Profile info is getting",
        data: { ...rest },
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    // step-1: retrieve appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId });

    // step-2: extract expert ids from appointment bookings const expertIds = bookings.map(el el.expert.id)
    const expertIds = bookings.map((el) => el.expert.id);

    // step 3 retrieve experts using expert ids
    const experts = await Expert.find({ _id: { $in: expertIds } }).select(
      "-password"
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Appointments are getting",
        data: experts,
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};
