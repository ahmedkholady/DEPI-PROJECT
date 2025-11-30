import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiFileText, FiDownload, FiEye, FiCalendar, FiCreditCard } from 'react-icons/fi';

function Bills() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showBillModal, setShowBillModal] = useState(false);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await api.get('/bills');
            setBills(response.data.bills || []);
        } catch (error) {
            console.error('Failed to fetch bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewBill = async (bill) => {
        try {
            const response = await api.get(`/bills/${bill.id}`);
            setSelectedBill(response.data.bill);
            setShowBillModal(true);
        } catch (error) {
            console.error('Failed to fetch bill details:', error);
        }
    };

    const closeBillModal = () => {
        setShowBillModal(false);
        setSelectedBill(null);
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'failed':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bills</h1>
                    <p className="text-gray-600">View and download all your invoices</p>
                </div>

                {bills.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <FiFileText className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bills yet</h3>
                        <p className="text-gray-600 mb-6">
                            Your bills will appear here once you place an order.
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bill Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bills.map((bill) => (
                                        <tr key={bill.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FiFileText className="text-gray-400 mr-2" />
                                                    <span className="font-mono text-sm font-medium text-gray-900">
                                                        {bill.bill_number}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FiCalendar className="mr-2" size={14} />
                                                    {new Date(bill.billing_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {bill.order?.order_id || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ${bill.total_amount?.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FiCreditCard className="mr-2" size={14} />
                                                    {bill.payment_method}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(bill.payment_status)}`}>
                                                    {bill.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => viewBill(bill)}
                                                    className="text-pink-600 hover:text-pink-700 inline-flex items-center"
                                                >
                                                    <FiEye className="mr-1" size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Bill Detail Modal */}
                {showBillModal && selectedBill && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
                                        <p className="text-sm text-gray-600">
                                            Bill Number: <span className="font-mono font-semibold">{selectedBill.bill_number}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeBillModal}
                                        className="text-gray-400 hover:text-gray-600 text-2xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill Details</h3>
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                <span className="text-gray-600">Order ID:</span>{' '}
                                                <span className="font-semibold">{selectedBill.order?.order_id}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-gray-600">Billing Date:</span>{' '}
                                                <span className="font-semibold">
                                                    {new Date(selectedBill.billing_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment Details</h3>
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                <span className="text-gray-600">Payment Method:</span>{' '}
                                                <span className="font-semibold">{selectedBill.payment_method}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-gray-600">Status:</span>{' '}
                                                <span className={`font-semibold ${selectedBill.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {selectedBill.payment_status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Order Items</h3>
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr>
                                                <th className="text-left py-2 text-sm font-medium text-gray-700">Item</th>
                                                <th className="text-center py-2 text-sm font-medium text-gray-700">Qty</th>
                                                <th className="text-right py-2 text-sm font-medium text-gray-700">Price</th>
                                                <th className="text-right py-2 text-sm font-medium text-gray-700">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedBill.order?.items?.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-3 text-sm">{item.product_name}</td>
                                                    <td className="py-3 text-sm text-center">{item.quantity}</td>
                                                    <td className="py-3 text-sm text-right">${item.price?.toFixed(2)}</td>
                                                    <td className="py-3 text-sm text-right font-medium">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals */}
                                <div className="flex justify-end mb-8">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${selectedBill.subtotal?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping Fee</span>
                                            <span className="font-medium">${selectedBill.shipping_fee?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium">${selectedBill.tax_amount?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                                            <span>Total Amount</span>
                                            <span>${selectedBill.total_amount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => window.print()}
                                        className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 flex items-center justify-center space-x-2"
                                    >
                                        <FiDownload size={18} />
                                        <span>Print / Download</span>
                                    </button>
                                    <button
                                        onClick={closeBillModal}
                                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
                                    >
                                        Close
                                    </button>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
                                    <p>Thank you for your business!</p>
                                    <p className="mt-1">For any questions, please contact support@ecommerce.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bills;
