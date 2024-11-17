import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";

// submit a review
const submitReview = async (req, res) => {
  //   const token = req.headers.authorization.split(" ")[1];
  //   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //   const userId = decodedToken.userId;

  //   req.body.userId = userId;
  const review = new reviewModel({
    foodItemId: req.body.foodItemId,
    rating: req.body.rating,
    review: req.body.review,
    userId: req.body.userId,
    timestamp: req.body.timestamp,
    username: req.body.username,
  });
  console.log(review);

  try {
    await review.save();
    res.json({ success: true, message: "Review Submitted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// get reviews for a food item
const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ foodItemId: req.params.itemId });
    const sortedReviews = reviews.sort((a, b) => b.timestamp - a.timestamp);
    res.json({ success: true, data: sortedReviews });
    // res.json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    console.log(req.params);
    const { reviewId } = req.params;
    const { userId } = req.body;
    console.log("reviewId", reviewId, "userId", userId);

    // Validate reviewId
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Validate userId
    console.log(":::::", review.userId.toString(), userId);
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review",
      });
    }

    await reviewModel.findByIdAndDelete(reviewId);
    res.json({ success: true, message: "Review Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};
export { submitReview, getReviews, deleteReview };
