import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import './ProductCard.css';

const ProductCard = ({ product, isBestSeller = false, monthlySales = null }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    const [whole, fraction] = price.toString().split('.');
    return {
      whole: whole,
      fraction: fraction ? fraction.padEnd(2, '0') : '00'
    };
  };

  const price = formatPrice(product.price);

  // معالجة الصور التالفة
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className="product-card">
      {isBestSeller && <div className="best-seller-badge">Best Seller</div>}
      
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.title}
            className="product-image"
            onError={handleImageError}
          />
          <div className="image-placeholder" style={{display: 'none'}}>
            📷 Image not available
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          
          {product.description && (
            <p className="product-description">
              {product.description.length > 120 
                ? product.description.substring(0, 120) + '...' 
                : product.description
              }
            </p>
          )}
          
          <div className="product-rating">
            <span className="rating-stars">⭐ {product.rating?.rate || 4.5}</span>
            <span className="rating-count">
              {product.rating?.count ? `${(product.rating.count / 1000).toFixed(1)}K` : '1.2K'}
            </span>
          </div>

          {monthlySales && (
            <div className="monthly-sales">
              <span className="trending-badge">🔥</span>
              Bought {monthlySales}+ times in the past month
            </div>
          )}

          <div className="product-price">
            ${price.whole}<span className="price-fraction">{price.fraction}</span>
          </div>

          {/* تم إزالة promo-badge و shipping-info */}
        </div>
      </Link>
      
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;