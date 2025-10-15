import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    alert('Product added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="error-message">
            <h2>Product Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/products')} className="back-btn">
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        
        <div className="product-detail-content">
          <div className="product-image-section">
            {!imageError ? (
              <img 
                src={product.image} 
                alt={product.title}
                className="product-detail-image"
                onError={handleImageError}
              />
            ) : (
              <div className="image-placeholder-large">
                📷 Product Image<br />Not Available
              </div>
            )}
          </div>
          
          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-category">{product.category}</div>
            
            <div className="product-rating">
              ⭐ {product.rating?.rate} ({product.rating?.count} reviews)
            </div>
            
            <div className="product-price">${product.price}</div>
            
            <p className="product-description">{product.description}</p>
            
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            
            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart ({quantity})
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;