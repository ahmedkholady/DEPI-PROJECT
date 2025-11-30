import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <FiCheckCircle className="text-green-500" size={20} />,
        error: <FiXCircle className="text-red-500" size={20} />,
        info: <FiInfo className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div className={`fixed top-20 right-4 z-[100] ${bgColors[type]} border rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px] max-w-md animate-slide-in`}>
            {icons[type]}
            <p className="flex-1 text-gray-800">{message}</p>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
                <FiX size={18} />
            </button>
        </div>
    );
};

export default Toast;
