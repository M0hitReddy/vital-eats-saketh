import React, { useContext, useState } from "react";
import { Flag, Star, ThumbsUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./FoodReview.css";


const FoodReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const { itemId } = useParams();
  const [foodItem, setFoodItem] = useState({});
  const { url, token, user } = useContext(StoreContext);
  const [reviews, setReviews] = useState([]);
  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${url}/api/review/${itemId}`);
        console.log(response);
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [itemId]);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await fetch(`${url}/api/food/${itemId}`);
        const data = await response.json();
        console.log(data);
        setFoodItem(data.data);
      } catch (error) {
        console.error("Error fetching food item:", error);
      }
    };

    fetchFoodItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      foodItemId: itemId,
      userId: rating,
      rating: rating,
      review,
      timestamp: new Date(),
    };

    console.log("Submitting review:", reviewData);
    // Add your API call here
    try {
      await axios.post(`${url}/api/review/add`, reviewData, {
        headers: {
          token,
        },
      });
      setRating(0);
      setReview("");
      console.log(user);
      setReviews([{...reviewData, username: user.username}, ...reviews]);
      toast.success("Review submitted successfully");
      console.log("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 review-form">
      <div className="bg- rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={
                  foodItem.image === ""
                    ? assets.no_image
                    : url + "/images/" + foodItem.image
                }
                alt={foodItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{foodItem.name}</h2>
              {foodItem.description && (
                <p className="">{foodItem.description}</p>
              )}
              <div className="flex gap-4 mt-1 text-sm">
                {foodItem.price > 0 && <span>₹{foodItem.price}</span>}
                {foodItem.calories > 0 && <span>{foodItem.calories} cal</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Review Form Section */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hover || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this dish..."
                className="w-full min-h-[120px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg text-white font-medium
                ${
                  !rating || !review
                    ? "cant cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                }`}
              disabled={!rating || !review}
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <hr className="" />

      <div className="reviews overflow-hidden mt-10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Customer Reviews</h3>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.round(calculateAverageRating())
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{calculateAverageRating()}</span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-6">
                <ReviewCard review={review} />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const {
    username,
    rating,
    review: reviewText,
    timestamp,
    helpful = 0,
  } = review;
  const { url, token } = useContext(StoreContext);
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${url}/api/review/${reviewId}`, {
        headers: {
          token,
        },
      });
      // console.log(response.data);
      // if (response.data.success) {
      toast.success(response.data.message);
      // } else {
      //   toast.error(response.data.message);
      // }
      //   setReviews(reviews.filter((review) => review.id !== reviewId));
      // console.log("Review deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error deleting review:", error.response.data.message);
    }
  };
  return (
    <div className="py-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 user-image rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {username ? username[0] : "-"}
              </span>
            </div>
            <span className="font-medium">{username}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="review-message mt-2">{reviewText}</p>
      <div className="flex items-center gap-6 mt-3 text-sm ">
        <span>{new Date(timestamp).toLocaleDateString()}</span>
        <button className="flex items-center gap-1 hover:underline">
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful ({helpful})</span>
        </button>
        <button className="flex items-center gap-1 hover:underline">
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </button>
        <button
          className="flex items-center gap-1 hover:underline"
          onClick={() => handleDeleteReview(review._id)}
        >
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default FoodReviewPage;
