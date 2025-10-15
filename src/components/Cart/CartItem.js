import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import './CartItem.css';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        <img src={item.image} alt={item.title} />
      </div>
      
      <div className="item-details">
        <h4 className="item-title">{item.title}</h4>
        <p className="item-category">{item.category}</p>
        <div className="item-price">${item.price}</div>
      </div>
      
      <div className="quantity-controls">
        <button 
          className="quantity-btn" 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="quantity">{item.quantity}</span>
        <button 
          className="quantity-btn" 
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          +
        </button>
      </div>
      
      <div className="item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      
      <button className="remove-btn" onClick={handleRemove}>
        🗑️
      </button>
    </div>
  );
};

export default CartItem;