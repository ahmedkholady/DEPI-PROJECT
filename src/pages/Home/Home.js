import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import Carousel from '../../components/Carousel/Carousel';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        const enhancedProducts = data.map((product, index) => ({
          ...product,
          description: product.description || "Premium product with high quality and performance guarantee.",
          monthlySales: index % 2 === 0 ? 50 : null
        }));
        
        setFeaturedProducts(enhancedProducts);
        setBestSellers(enhancedProducts.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Store</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="cta-button primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="container">
          <Carousel />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Most popular products from our customers</p>
          </div>
          
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing products...</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {bestSellers.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isBestSeller={true}
                    monthlySales={index % 2 === 0 ? 50 : null}
                  />
                ))}
              </div>
              <div className="view-all">
                <Link to="/products" className="view-all-btn">
                  Explore All Products →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Delivery</h3>
              <p>Get your orders delivered in record time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payment</h3>
              <p>100% secure and encrypted payments</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy for all items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;