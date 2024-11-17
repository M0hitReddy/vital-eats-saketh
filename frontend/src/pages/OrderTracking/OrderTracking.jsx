import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import './OrderTracking.css';
import { formatDateTime,addMinutes } from "../../utils/time";



const OrderTracking = () => {
  const { orderId } = useParams();
  const { url, token } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/order/${orderId}`, {
        headers: { token },
      });
      setOrder(response.data.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrderDetails();
    // const intervalId = setInterval(fetchOrderDetails, 10000);
    // return () => clearInterval(intervalId);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="order-card">
        <h2 className="order-title">Order Tracking</h2>
        <hr/>
        <div className="order-content">
          <div className="order-details">
            <div className="detail-item">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{order._id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Order Time:</span>
              <span className="detail-value">
                {formatDateTime(order.date)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estimated Delivery:</span>
              <span className="detail-value">
                {formatDateTime(addMinutes(new Date(order.date), 30)).split('at')[1]}
              </span>
            </div>
            <div className="detail-item">
                <span className="detail-label">Order Items:</span>
                
                <ul className="detail-value">
                    {order.items.map((item, index) => (
                        <li key={index}>
                            {item.name} - {item.quantity} x ${item.price}
                        </li>
                    ))}
                </ul>
            </div>
            <hr/>
            <div className="detail-item">
              <span className="detail-label" style={{fontSize:"20px"}}><strong>Total Amount:</strong></span>
              <span className="detail-value" style={{fontSize:"20px"}}>

              ₹{order.amount}
              </span>
            </div>
            {/* <div className="detail-item">
              <span className="detail-label">Tracking Number:</span>
              <span className="detail-value">{order.trackingNumber}</span>
            </div> */}
          </div>
          <div className="map-container">
            {typeof window !== 'undefined' && (
              <MapContainer
                center={[17.366, 78.476]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[17.366, 78.476]}>
                  <Popup>Order Location</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;