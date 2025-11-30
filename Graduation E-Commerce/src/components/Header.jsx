import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiShoppingCart, FiUser, FiHeart, FiLogOut } from "react-icons/fi";
import { authAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenueOpen, setIsMobileMenueOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { getWishlistCount } = useWishlist();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        
        // Check if user is logged in and fetch user data
        const token = localStorage.getItem('auth_token');
        setIsLoggedIn(!!token);
        
        if (token) {
            fetchUserData();
        }
        
        // Listen for auth changes
        const handleAuthChange = () => {
            const token = localStorage.getItem('auth_token');
            setIsLoggedIn(!!token);
            if (token) {
                fetchUserData();
            } else {
                setUserName('');
            }
        };
        window.addEventListener('auth-change', handleAuthChange);
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (showUserDropdown && !event.target.closest('.relative')) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('auth-change', handleAuthChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserDropdown]);

    const fetchUserData = async () => {
        try {
            const response = await authAPI.getUser();
            console.log('Fetched user data:', response.data);
            const userData = response.data.user || response.data;
            const fullName = userData.name || userData.email?.split('@')[0] || '';
            console.log('Setting userName to:', fullName);
            setUserName(fullName);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            // Fallback to email from localStorage
            const email = localStorage.getItem('email');
            setUserName(email ? email.split('@')[0] : '');
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            setIsLoggedIn(false);
            setUserName('');
            setShowUserDropdown(false);
            // Trigger auth change event for cart update
            window.dispatchEvent(new Event('auth-change'));
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Still logout on frontend even if backend fails
            localStorage.removeItem('auth_token');
            localStorage.removeItem('email');
            setIsLoggedIn(false);
            setUserName('');
            setShowUserDropdown(false);
            // Trigger auth change event for cart update
            window.dispatchEvent(new Event('auth-change'));
            navigate('/');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to home first if not on home page
            if (window.location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const productsSection = document.getElementById('products');
                    if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                // Scroll to products section
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            // In a real app, you would filter products by searchQuery
            console.log('Searching for:', searchQuery);
        }
    };

    const handleNavClick = (link) => {
        // If not on home page, navigate to home first
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const section = document.querySelector(link);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    const navItems = [
        { id: 1, name: "Home", link: "#home" },
        { id: 2, name: "Products", link: "#products" },
        { id: 3, name: "Categories", link: "#categories" },
        { id: 4, name: "Offers", link: "#offers" },
        { id: 5, name: "About", link: "#about" },
        { id: 6, name: "Contact", link: "#contact" },
    ];

    return (
        <header className="sticky top-0 z-50 transition-all duration-300">

            {/* Top Header */}
            <div className={`${isScrolled ? "bg-gray-100/95 shadow-md py-2 backdrop-blur" : "bg-gray-100 py-4"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        {/* Logo + Menu Icon */}
                        <div className="flex justify-between items-center w-full md:w-auto">
                            <Link to="/" className="text-xl font-bold text-pink-600">ShopEase</Link>

                            <button
                                className="md:hidden text-gray-700 hover:text-indigo-600"
                                onClick={() => setIsMobileMenueOpen(!isMobileMenueOpen)}
                            >
                                <FiMenu size={24} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="w-full md:flex-1 max-w-sm relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
                                aria-label="Search"
                            >
                                <FiSearch size={18} />
                            </button>
                        </form>

                        {/* Icons (User - Wishlist - Cart) */}
                        <div className="flex items-center space-x-4 w-full md:w-auto justify-end">

                            {/* Heart + badge */}
                            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-pink-600" aria-label="Wishlist">
                                <FiHeart size={20} />
                                {getWishlistCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getWishlistCount()}
                                    </span>
                                )}
                            </Link>

                            {/* Cart + badge */}
                            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-pink-600" aria-label="Cart">
                                <FiShoppingCart size={20} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {isLoggedIn ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-pink-600 rounded-lg hover:bg-gray-100"
                                    >
                                        <FiUser size={18} />
                                        <span className="hidden md:inline">{userName}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {showUserDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiUser className="mr-2" size={16} />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiShoppingCart className="mr-2" size={16} />
                                                Orders
                                            </Link>
                                            <Link
                                                to="/bills"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                </svg>
                                                Bills
                                            </Link>
                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                <FiLogOut className="mr-2" size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link 
                                        to="/login" 
                                        className="px-3 py-1 text-sm text-gray-700 hover:text-pink-600"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="px-3 py-1 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-pink-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <nav className="hidden md:flex justify-center py-3">
                        <ul className="flex space-x-8 text-white font-medium">
                            {navItems.map((item) => (
                                <li key={item.id} className="list-none">
                                    <a 
                                        href={item.link} 
                                        onClick={(e) => {
                                            if (window.location.pathname !== '/') {
                                                e.preventDefault();
                                                handleNavClick(item.link);
                                            }
                                        }}
                                        className="hover:text-pink-300 transition-colors"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Menu */}
                    {isMobileMenueOpen && (
                        <div className="md:hidden mt-2 bg-white rounded-lg shadow-md p-4 space-y-3 text-amber-900 text-center">
                            {navItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    onClick={(e) => {
                                        if (window.location.pathname !== '/') {
                                            e.preventDefault();
                                            handleNavClick(item.link);
                                        }
                                        setIsMobileMenueOpen(false);
                                    }}
                                    className="block hover:text-amber-600 text-sm font-medium"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    )}

                </div>
            </div>

        </header>
    );
}

export default Header;