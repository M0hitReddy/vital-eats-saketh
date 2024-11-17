import express from "express";
import {
  addFood,
  getFoodById,
  getTrendingItems,
  // getReviews,
  listFood,
  removeFood,
  // submitReview,
} from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/trending", getTrendingItems);
foodRouter.get("/:itemId", getFoodById);
// foodRouter.post("/review", authMiddleware, submitReview);
// foodRouter.get("/reviews/:itemId", getReviews);

export default foodRouter;
