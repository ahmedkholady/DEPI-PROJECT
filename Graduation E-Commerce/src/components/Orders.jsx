import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiFileText, FiMapPin } from 'react-icons/fi';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showBillModal, setShowBillModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('Please login to view orders');
            setLoading(false);
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            console.log('Orders response:', response.data);
            // Parse items JSON string to array for each order
            const ordersWithParsedItems = (response.data.orders || []).map(order => ({
                ...order,
                items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
            }));
            setOrders(ordersWithParsedItems);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            console.error('Error response:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to load orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const viewBill = (order) => {
        setSelectedOrder(order);
        setShowBillModal(true);
    };

    const closeBillModal = () => {
        setShowBillModal(false);
        setSelectedOrder(null);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FiClock className="text-yellow-500" size={20} />;
            case 'processing':
                return <FiPackage className="text-blue-500" size={20} />;
            case 'shipped':
                return <FiTruck className="text-purple-500" size={20} />;
            case 'delivered':
                return <FiCheckCircle className="text-green-500" size={20} />;
            default:
                return <FiPackage className="text-gray-500" size={20} />;
        }
    };

    const getStatusText = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
                        <Link
                            to="/login"
                            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 mt-4"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <FiPackage className="mx-auto text-gray-400 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Order #{order.order_id}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    {order.tracking_number && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Tracking: <span className="font-mono">{order.tracking_number}</span>
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(order.status)}
                                        <span className="font-semibold text-gray-900">
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    {order.bill && (
                                        <button
                                            onClick={() => viewBill(order)}
                                            className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700"
                                        >
                                            <FiFileText size={16} />
                                            <span>View Bill</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Arrival Information */}
                            {order.estimated_arrival && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
                                    <FiMapPin className="text-blue-600 mt-1" size={18} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-900">
                                            {order.actual_arrival 
                                                ? `Delivered on ${new Date(order.actual_arrival).toLocaleDateString()}`
                                                : `Estimated arrival: ${new Date(order.estimated_arrival).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}`
                                            }
                                        </p>
                                        {!order.actual_arrival && order.status !== 'delivered' && (
                                            <p className="text-xs text-blue-700 mt-1">
                                                Expected in {Math.ceil((new Date(order.estimated_arrival) - new Date()) / (1000 * 60 * 60 * 24))} days
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-4">
                                <div className="space-y-3 mb-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.product_name} x {item.quantity}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        ${order.total_amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bill Modal */}
                {showBillModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
                                        <p className="text-sm text-gray-600">Bill #{selectedOrder.bill?.bill_number}</p>
                                    </div>
                                    <button
                                        onClick={closeBillModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID</p>
                                            <p className="font-semibold">{selectedOrder.order_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Billing Date</p>
                                            <p className="font-semibold">
                                                {new Date(selectedOrder.bill?.billing_date || selectedOrder.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Payment Method</p>
                                            <p className="font-semibold">{selectedOrder.payment_method}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Payment Status</p>
                                            <p className="font-semibold text-green-600">
                                                {selectedOrder.bill?.payment_status || 'Paid'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <h3 className="font-semibold mb-3">Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span>{item.product_name} x {item.quantity}</span>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping</span>
                                        <span>${selectedOrder.shipping?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tax</span>
                                        <span>${selectedOrder.tax?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total</span>
                                        <span>${selectedOrder.total_amount?.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                                    >
                                        Print Bill
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
