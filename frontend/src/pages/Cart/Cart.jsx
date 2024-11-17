import React, { useState, useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    appliedPromo,
    setAppliedPromo,
  } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState("");
  // const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    console.log(appliedPromo);
  }, [appliedPromo])
  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      const response = await fetch(`${url}/api/promo/${promoCode}/validate`);
      const data = await response.json();

      if (data.success) {
        setAppliedPromo(data.data);
        setPromoCode("");
        setPromoError("");

        toast.success("Promo code applied successfully");
      } else {
        setPromoError(data.error || "Invalid promo code");
        setAppliedPromo(null);
        toast.error(data.error || "Invalid promo code");
      }
    } catch (error) {
      setPromoError("Error validating promo code");
      setAppliedPromo(null);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = getTotalCartAmount();
    const discount = (subtotal * appliedPromo.discount) / 100;
    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  };

  const getFinalTotal = () => {
    const subtotal = getTotalCartAmount();
    if (subtotal === 0) return 0;

    const deliveryFee = 30;
    const discount = calculateDiscount();
    return subtotal + deliveryFee - discount;
  };

  return (
    <div className="cart">
      <div className="cart-items">
        {/* Your existing cart items code */}
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 30}</p>
            </div>
            {appliedPromo && (
              <>
                <hr />
                <div className="cart-total-details promo-discount">
                  <div className="discount-label">
                    <p>Discount ({appliedPromo.code})</p>
                    <button
                      onClick={removePromoCode}
                      className="remove-promo bg-black"
                    >
                      Remove
                    </button>
                  </div>
                  <p>-₹{calculateDiscount()}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getFinalTotal()}</b>
            </div>
          </div>
          <button className="checkout-btn" onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p className="promocodep">
              If you have a promo code, Enter it here
            </p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={appliedPromo !== null}
              />
              <button
                onClick={validatePromoCode}
                disabled={appliedPromo !== null}
              >
                Submit
              </button>
            </div>
            {promoError && <p className="promo-error">{promoError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
