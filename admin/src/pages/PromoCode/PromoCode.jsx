import { toast } from "react-toastify";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./PromoCode.css";
import "../../components/Navbar/Navbar.css";
const PromoCode = ({ url }) => {
  const [promocodes, setPromocodes] = useState([
    // { id: 1, code: "SUMMER2024", discount: 20, status: "active" },
    // { id: 2, code: "WELCOME50", discount: 50, status: "inactive" },
  ]);

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    status: "active",
  });

  useEffect(() => {
    async function fetchPromocodes() {
      try {
        const res = await axios.get(`${url}/api/promo/get`);
        // console.log(res.data.data);
        setPromocodes(res.data.data);
      } catch (error) {
        console.error("Error fetching promocodes:", error);
      }
    }
    fetchPromocodes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPromocode = formData;
    async function addPromocode() {
      try {
        const res = await axios.post(`${url}/api/promo/add`, newPromocode);
        console.log(res.data);
        toast.success("Promocode added successfully");
        setPromocodes([{...res.data.data, code: newPromocode.code.toUpperCase()}, ...promocodes]);
        setFormData({ code: "", discount: "", status: "active" });
      } catch (error) {
        console.error("Error adding promocode:", error);
        toast.error(error.response.data.error );
      }
    }
    addPromocode();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url}/api/promo/${id}`);
      setPromocodes(promocodes.filter((promo) => promo._id !== id));
      toast.success("Promocode deleted successfully");
    } catch (error) {
      toast.error("Error deleting promocode");
      console.error("Error deleting promocode:", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${url}/api/promo/${id}/toggle`);
      setPromocodes(
        promocodes.map((promo) =>
          promo._id === id
            ? {
                ...promo,
                status: promo.status === "active" ? "inactive" : "active",
              }
            : promo
        )
      );
      toast.success("Promocode status changed successfully");
    } catch (error) {
      toast.error("Error changing status");
      console.error("Error toggling promocode status:", error);
    }
  };

  return (
    <div className={`promocode-container`}>
      {/* <button onClick={handleThemeToggle}>
        {isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
      </button> */}
      <div className="promocode-form-section">
        <h2>Add New Promocode</h2>
        <form onSubmit={handleSubmit} className="promocode-form">
          <div className="form-group">
            <label htmlFor="code">Promocode</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter promocode"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Add Promocode
          </button>
        </form>
      </div>

      <div className="promocode-list-section">
        <h2>Promocode List</h2>
        {/* <hr/> */}
        <div className="promocode-list ">
          {promocodes.map((promo) => (
            <div key={promo.id} className="promocode-item">
              <div className="promocode-details">
                <h3>{promo.code}</h3>
                <p>Discount: {promo.discount}%</p>
                <p className={`status-badge ${promo.status}`}>{promo.status}</p>
              </div>
              <div className="promocode-actions">
                <button
                  onClick={() => handleToggleStatus(promo._id)}
                  className="toggle-btn"
                >
                  {promo.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(promo._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoCode;
