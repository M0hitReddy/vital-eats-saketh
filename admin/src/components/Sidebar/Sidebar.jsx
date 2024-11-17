import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img className="addd" src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img className="listt" src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img className="orderr" src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/promocode" className="sidebar-option">
          <img className="promocodee" width={30} height={30} src={assets.promocode_icon} alt="" />
          <p>Promocodes</p>
        </NavLink>
        <NavLink to="/trending" className="sidebar-option">
          <img className="trendingg" width={30} height={30} src={assets.trending_icon} alt="" />
          <p>Trending</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
