import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

function Cart() {
    try {
        const cartContext = useCart();
        const { cartItems = [], removeFromCart, updateQuantity, getCartTotal, clearCart } = cartContext || {};

        console.log('Cart component loaded. Items:', cartItems);

        if (!cartItems || cartItems.length === 0) {
            return (
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">Add some products to get started!</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({cartItems.length})</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
                                >
                                    <img
                                        src={item.image || 'https://via.placeholder.com/100'}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/100'}}
                                    />
                                    
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-gray-600">${parseFloat(item.price || 0).toFixed(2)}</p>
                                        
                                        <div className="flex items-center space-x-4 mt-4">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => {
                                                        if (updateQuantity) {
                                                            updateQuantity(item.id, Math.max(1, item.quantity - 1));
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-gray-100"
                                                >
                                                    <FiMinus size={16} />
                                                </button>
                                                <span className="px-4 py-2 border-x border-gray-300">
                                                    {item.quantity || 1}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        if (updateQuantity) {
                                                            updateQuantity(item.id, item.quantity + 1);
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-gray-100"
                                                >
                                                    <FiPlus size={16} />
                                                </button>
                                            </div>
                                            
                                            <button
                                                onClick={() => {
                                                    if (removeFromCart) {
                                                        removeFromCart(item.id);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                                            >
                                                <FiTrash2 size={18} />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">
                                            ${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {cartItems.length > 0 && (
                                <button
                                    onClick={() => {
                                        if (clearCart) {
                                            clearCart();
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                                >
                                    <FiTrash2 size={16} />
                                    <span>Clear Cart</span>
                                </button>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${(getCartTotal ? getCartTotal() : 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>$10.00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>${((getCartTotal ? getCartTotal() : 0) * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-xl font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>${((getCartTotal ? getCartTotal() : 0) + 10 + (getCartTotal ? getCartTotal() : 0) * 0.1).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="block w-full py-3 bg-pink-600 text-white text-center rounded-lg hover:bg-pink-700 font-semibold"
                                >
                                    Proceed to Checkout
                                </Link>
                                
                                <Link
                                    to="/"
                                    className="block w-full py-3 mt-3 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Cart component error:', error);
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Cart</h2>
                        <p className="text-gray-600 mb-4">{error?.message || 'Unknown error'}</p>
                        <pre className="bg-gray-100 p-4 rounded text-left text-sm overflow-auto mb-8">
                            {error?.stack || error?.toString()}
                        </pre>
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;
