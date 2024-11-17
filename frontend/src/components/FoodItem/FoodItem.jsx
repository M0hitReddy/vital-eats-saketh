import React, { useContext, useEffect } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { Star, StarHalf, StarHalfIcon } from "lucide-react";

function FoodItem({ id, name, price, description, image, calories }) {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`${url}/api/review/${id}`);
        const data = response.data.data;
        // if (data && data.reviews) {
        console.log(data);
        const totalRating = data.reduce(
          (acc, review) => acc + review.rating,
          0,
        );
        console.log("rating:::", totalRating);
        const averageRating = totalRating / data.length;
        console.log("rating:::", averageRating);
        setAvgRating(averageRating);
        // }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    fetchReviews();
  }, [id, url]);
  console.log(image);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={image === "" ? assets.no_image : url + "/images/" + image}
          alt=""
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p className="cartitemsp">{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="namewe">{name}</p>
          {/* <img className='ratingstars' src={assets.rating_starts} alt="" /> */}

          <div className="flex">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 0.5;
              return (
                <span className="stars" key={index}>
                  {avgRating >= index + 1 ? (
                    <Star size={20} className="full-star" color="#FFD700" fill="#FFD700" />
                  ) : avgRating >= ratingValue ? (
                    <StarHalf size={20} className="half-star" color="#FFD700" fill="#FFD700" />
                  ) : (
                    <Star size={20} className="empty-star" color="#FFD700" fill="white" />
                  )}
                </span>
              );
            })}
          </div>

          {/* <Star size={20} color="#FFD700" fill='#FFD700' className="" /> */}
        </div>
        <p className="namewe">{description}</p>
        <p className="namewe">{calories} cal</p>
        <div className="flex items-center justify-between">
          <p className="food-item-price">₹{price}</p>
          <a href={"/review/" + id} className="underline text-gray-500">
            ratings
          </a>
        </div>
      </div>
    </div>
  );
}

export default FoodItem;
