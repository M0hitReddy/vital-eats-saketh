import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/time";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  console.log(data[0]);
  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    setData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2 className="myordersp">My Orders </h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ",";
                  }
                })}
              </p>
              <p>{formatDateTime(order.date)}</p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p className={`status-badgee ${order.status.toLowerCase().replace(" ","")}`}>
                 <b>{order.status}</b>
              </p>
              <Link to={`/track-order/${order._id}`}>
                <button>Track Order</button>
              </Link>
              {/* <button onClick={fetchOrders}>Track Order</button> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
