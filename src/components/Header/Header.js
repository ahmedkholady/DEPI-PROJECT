import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Header.css';

const Header = () => {
  const cartItemsCount = useSelector(state => state.cart.totalItems);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          🛍️ E-Store
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link cart-link">
            🛒 Cart 
            {cartItemsCount > 0 && <span className="cart-count">{cartItemsCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;