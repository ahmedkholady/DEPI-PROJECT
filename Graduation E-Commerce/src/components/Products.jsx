import { useState } from "react";
import { FiHeart, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Toast from "./Toast";

import product from "../assets/product.jpg";
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import product4 from "../assets/product4.jpg";

function Products() {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [toast, setToast] = useState(null);
    
    const handleToggleWishlist = (productId) => {
        const wasInWishlist = isInWishlist(productId);
        toggleWishlist(productId);
        setToast({
            message: wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
            type: 'info'
        });
    };
    
    const products = [
        {
            id: 1,
            title: "Citrus",
            price: 97.49,
            oldPrice: 129.99,
            rating: 4.5,
            discount: "-25%",
            img: product
        },
        {
            id: 2,
            title: "Aromatic",
            price: 56.99,
            oldPrice: 59.99,
            rating: 4.8,
            discount: "-5%",
            img: product1
        },
        {
            id: 3,
            title: "Chypre",
            price: 66.49,
            oldPrice: 59.99,
            rating: 4.1,
            discount: "-5%",
            img: product2
        },
        {
            id: 4,
            title: "Leathery",
            price: 56.99,
            oldPrice: 59.99,
            rating: 4.3,
            discount: "-5%",
            img: product3
        },
        {
            id: 5,
            title: "Floral",
            price: 88.49,
            oldPrice: 109.99,
            rating: 4.6,
            discount: "-20%",
            img: product4
        }
    ];

    const [index, setIndex] = useState(0);

    const handleAddToCart = (product) => {
        addToCart({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.img
        });
        setToast({
            message: `${product.title} added to cart!`,
            type: 'success'
        });
    };

    // move slider
    const goNext = () => {
        setIndex((prev) => (prev + 1) % products.length);
    };
    const goPrev = () => {
        setIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <section id="products" className="py-12 px-4 max-w-7xl mx-auto">

            {/* Title + arrows */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-900">
                    Featured Products
                </h2>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={goPrev}
                        className="p-2 rounded-full border border-gray-300 hover:bg-pink-600 hover:text-white transition"
                    >
                        <FiChevronLeft size={20} />
                    </button>

                    <button
                        onClick={goNext}
                        className="p-2 rounded-full border border-gray-300 hover:bg-pink-600 hover:text-white transition"
                    >
                        <FiChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Slider container */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {products.map((item) => (
                        <div
                            key={item.id}
                            className="min-w-full md:min-w-1/2 lg:min-w-1/4 px-3"
                        >
                            <div className="bg-white rounded-xl shadow-md p-3 mb-6">
                                <div className="relative overflow-hidden rounded-xl">

                                    {/* Image */}
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="rounded-xl w-full h-60 object-cover transform hover:scale-105 transition duration-500"
                                    />

                                    {/* Heart */}
                                    <button
                                        onClick={() => handleToggleWishlist(item.id)}
                                        className={`absolute top-2 left-2 bg-white p-1 rounded-full shadow transition ${
                                            isInWishlist(item.id) 
                                                ? 'text-pink-600 fill-pink-600' 
                                                : 'text-gray-700 hover:text-pink-600'
                                        }`}
                                    >
                                        <FiHeart size={20} fill={isInWishlist(item.id) ? 'currentColor' : 'none'} />
                                    </button>

                                    {/* Discount */}
                                    <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px=2 py-1 rounded-full">
                                        {item.discount}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center text-yellow-500 mt-3 text-sm">
                                    {"★".repeat(Math.floor(item.rating))}
                                    {"☆".repeat(5 - Math.floor(item.rating))}
                                    <span className="text-gray-600 ml-1">({item.rating})</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                                    {item.title}
                                </h3>

                                {/* Price */}
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-pink-700 font-bold text-lg">
                                        ${item.price}
                                    </span>
                                    <span className="text-gray-400 line-through text-sm">
                                        ${item.oldPrice}
                                    </span>
                                </div>

                                {/* Cart button */}
                                <div className="flex justify-end mt-3">
                                    <button 
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-pink-900 hover:bg-pink-700 text-white p-2 rounded-full transition"
                                    >
                                        <FiShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-2">
                {products.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-3 w-3 rounded-full ${
                            index === i ? "bg-pink-700" : "bg-gray-400"
                        }`}
                    />
                ))}
            </div>
        </section>
        </>
    );
}

export default Products;