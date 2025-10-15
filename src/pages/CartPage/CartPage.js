import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCart } from '../../store/cartSlice';
import CartItem from '../../components/Cart/CartItem';
import './CartPage.css';

const CartPage = () => {
  const { items, total, totalItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart</p>
            <Link to="/products" className="cta-button">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({totalItems} items):</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;