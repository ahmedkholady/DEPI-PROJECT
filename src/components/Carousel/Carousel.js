import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

const Carousel = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=10');
        const data = await response.json();
        // خلط المنتجات بشكل عشوائي
        const shuffledProducts = [...data].sort(() => Math.random() - 0.5);
        setProducts(shuffledProducts.slice(0, 5)); // نأخذ 5 منتجات عشوائية
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // يتغير كل 4 ثواني

      return () => clearInterval(interval);
    }
  }, [products.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="carousel">
        <div className="carousel-loading">
          <div className="loading-spinner"></div>
          <p>Loading featured products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="carousel">
      <div className="carousel-header">
        <h2>🔥 Featured Products</h2>
        <p>Discover our amazing collection</p>
      </div>
      
      <div className="carousel-container">
        <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious}>
          ‹
        </button>
        
        <div className="carousel-track">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <div className="carousel-content">
                <div className="carousel-image">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="carousel-info">
                  <h3 className="carousel-title">{product.title}</h3>
                  <p className="carousel-description">
                    {product.description.length > 120 
                      ? product.description.substring(0, 120) + '...' 
                      : product.description
                    }
                  </p>
                  <div className="carousel-rating">
                    ⭐ {product.rating?.rate} ({product.rating?.count} reviews)
                  </div>
                  <div className="carousel-price">${product.price}</div>
                  <Link to={`/product/${product.id}`} className="carousel-cta">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
          ›
        </button>
      </div>

      <div className="carousel-indicators">
        {products.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;