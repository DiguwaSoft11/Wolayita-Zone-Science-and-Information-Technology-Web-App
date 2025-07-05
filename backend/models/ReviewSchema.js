import mongoose from "mongoose";
import Expert from "./ExpertSchema.js"; // Adjust the path as needed

const reviewSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Populate user details on find queries
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// Calculate average ratings for a expert
reviewSchema.statics.calcAverageRatings = async function (expertId) {
  const stats = await this.aggregate([
    {
      $match: { expert: expertId },
    },
    {
      $group: {
        _id: "$expert",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Expert.findByIdAndUpdate(expertId, {
      totalRating: stats[0].numOfRating,
      averageRating: stats[0].avgRating,
    });
  } else {
    // If there are no reviews, set ratings to 0
    await Expert.findByIdAndUpdate(expertId, {
      totalRating: 0,
      averageRating: 0,
    });
  }
};

// Update average ratings after a new review is saved
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.expert);
});

// Update average ratings after a review is removed
reviewSchema.post("remove", function () {
  this.constructor.calcAverageRatings(this.expert);
});

export default mongoose.model("Review", reviewSchema);
