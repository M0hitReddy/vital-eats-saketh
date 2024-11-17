import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  deleteReview,
  getReviews,
  submitReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authMiddleware, submitReview);
reviewRouter.get("/:itemId", getReviews);
reviewRouter.delete("/:reviewId", authMiddleware, deleteReview);

export default reviewRouter;
