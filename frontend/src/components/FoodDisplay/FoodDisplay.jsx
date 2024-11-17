import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  console.log(food_list);

  return (
    <div className="food-display" id="food-display">
      <h2 className="h2we">What's On Your Mind ?</h2>
      <h1 className="h2promo">
        <b>Flat 175 OFF Use Promo Code 999</b>
      </h1>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                calories={item.calories}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
