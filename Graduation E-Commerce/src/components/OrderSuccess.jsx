import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId || 'N/A';
    const billNumber = location.state?.billNumber;
    const estimatedArrival = location.state?.estimatedArrival;
    const trackingNumber = location.state?.trackingNumber;

    useEffect(() => {
        // Clear any temporary data
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <FiCheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Order Placed Successfully!
                    </h1>
                    
                    <p className="text-gray-600 mb-2">
                        Thank you for your purchase. Your order has been received and is being processed.
                    </p>
                    
                    <div className="space-y-4 my-6">
                        <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Order ID</p>
                            <p className="text-xl font-bold text-gray-900">{orderId}</p>
                        </div>
                        
                        {billNumber && (
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-blue-600 mb-1">Bill Number</p>
                                <p className="text-lg font-mono font-bold text-blue-900">{billNumber}</p>
                            </div>
                        )}
                        
                        {estimatedArrival && (
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-600 mb-1">Estimated Arrival</p>
                                <p className="text-lg font-semibold text-green-900">
                                    {new Date(estimatedArrival).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                        
                        {trackingNumber && (
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-purple-600 mb-1">Tracking Number</p>
                                <p className="text-sm font-mono font-semibold text-purple-900">{trackingNumber}</p>
                            </div>
                        )}
                    </div>
                    
                    <p className="text-gray-600 mb-8">
                        You will receive an email confirmation shortly with your order details and tracking information.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/orders"
                            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-semibold"
                        >
                            View Order Details
                        </Link>
                        {billNumber && (
                            <Link
                                to="/bills"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                View Bill
                            </Link>
                        )}
                        <Link
                            to="/"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
