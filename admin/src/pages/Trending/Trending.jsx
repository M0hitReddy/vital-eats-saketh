import axios from "axios";
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import "./Trending.css";

const Trending = ({ url }) => {
  // const trendingItems = [
  //     {
  //       id: 1,
  //       name: "Mediterranean Salmon Bowl",
  //       price: "24.99",
  //       rating: 4.8,
  //       image: assets.food_1,
  //       timeEstimate: "25-35"
  //     },
  //     {
  //       id: 2,
  //       name: "Wagyu Beef Burger",
  //       price: "28.99",
  //       rating: 4.9,
  //       image: "/api/placeholder/400/300",
  //       timeEstimate: "20-30"
  //     },
  //     {
  //       id: 3,
  //       name: "Truffle Mushroom Risotto",
  //       price: "22.99",
  //       rating: 4.7,
  //       image: "/api/placeholder/400/300",
  //       timeEstimate: "30-40"
  //     }
  //   ];

  const [trendingItems, setTrendingItems] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    async function fetchTrendingItems() {
      try {
        const res = await axios.get(`${url}/api/food/trending`);
        console.log(res.data);
        const items = res.data;
        await Promise.all(
          items.map(async (item) => {
            const response = await axios.get(`${url}/api/review/${item._id}`);
            const data = response.data.data;
            const totalRating = data.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / data.length;
            item.rating = averageRating ? averageRating.toFixed(1) : "--";
          })
        );
        // res.data.forEach((item) => fetchReviews(res.data,item._id));
        setTrendingItems(items);
        
      } catch (error) {
        console.error("Error fetching trending items:", error);
      }
    }
    fetchTrendingItems();
  }, []);



  useEffect(() => {
    console.log(trendingItems);
    // trendingItems.forEach((item) => fetchReviews(item._id));
  }
  , [trendingItems]);

  return (
    <>
      <div className="trending-page">
        <header className="header">
          <h1>Trending Dishes</h1>
          {/* <div className="header-controls">
            <select className="filter-select">
              <option value={"all"}>All Categories</option>
              <option>Main Course</option>
              <option>Appetizers</option>
              <option>Desserts</option>
            </select>
            <button className="view-toggle">
              <span className="material-icons">grid_view</span>
            </button>
          </div> */}
        </header>

        <div className="trending-grid">
          {trendingItems.map((item) => (
            <div key={item.id} className="food-card">
              <div className="food-card-image">
                <img
                  src={
                    item.image ? `${url}/images/` + item.image : assets.no_image
                  }
                  alt={item.name}
                />
                <span className="rating">{item.rating} ⭐</span>
              </div>
              <div className="food-card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {/* <div className="flex-grow"></div> */}
                <div className="food-card-details">
                  <span className="price">₹{item.price}</span>
                  <span className="time">
                    {Math.floor(Math.random() * 31) + 30} min
                  </span>
                </div>
                {/* <button className="order-button">Add to Order</button> */}
              </div>
            </div>
          ))}
        </div>

        {/* <hr/> */}

        <section className="analytics-section">
          <h2>Today's Statistics</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <span className="analytics-number">248</span>
              <span className="analytics-label">Orders Today</span>
            </div>
            <div className="analytics-card">
              <span className="analytics-number">98%</span>
              <span className="analytics-label">Satisfaction Rate</span>
            </div>
            <div className="analytics-card">
              <span className="analytics-number">32</span>
              <span className="analytics-label">Active Orders</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Trending;
