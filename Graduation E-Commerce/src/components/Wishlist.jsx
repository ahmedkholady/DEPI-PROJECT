import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

function Wishlist() {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.id);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <FiHeart className="mx-auto text-gray-400 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8">Save items you love for later!</p>
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <button
                        onClick={clearWishlist}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center"
                    >
                        <FiTrash2 className="mr-1" size={16} />
                        Clear All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                            <div className="relative aspect-square">
                                <img
                                    src={item.image || '/placeholder.jpg'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                                >
                                    <FiTrash2 className="text-red-500" size={18} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xl font-bold text-pink-600">
                                        ${item.price?.toFixed(2)}
                                    </span>
                                    {item.oldPrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ${item.oldPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    className="w-full flex items-center justify-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                                >
                                    <FiShoppingCart size={18} />
                                    <span>Move to Cart</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Wishlist;
