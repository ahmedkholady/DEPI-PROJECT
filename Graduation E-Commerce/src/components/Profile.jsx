import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiSave, FiEdit2 } from 'react-icons/fi';
import api, { authAPI } from '../services/api';
import Toast from './Toast';

function Profile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [toast, setToast] = useState(null);
    const [user, setUser] = useState({
        name: '',
        email: '',
    });
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await authAPI.getUser();
            console.log('User data from API:', response.data);
            const userData = response.data.user || response.data;
            setUser(userData);
            setEditForm({
                name: userData.name || '',
                email: userData.email || '',
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('email');
                navigate('/login');
            } else {
                setToast({
                    message: 'Failed to load profile data',
                    type: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (editForm.new_password && editForm.new_password.length < 8) {
            setToast({
                message: 'New password must be at least 8 characters',
                type: 'error'
            });
            return;
        }

        if (editForm.new_password !== editForm.new_password_confirmation) {
            setToast({
                message: 'New passwords do not match',
                type: 'error'
            });
            return;
        }

        if (editForm.new_password && !editForm.current_password) {
            setToast({
                message: 'Current password is required to change password',
                type: 'error'
            });
            return;
        }

        setSaving(true);

        try {
            const updateData = {
                name: editForm.name,
                email: editForm.email,
            };

            // Only include password fields if user wants to change password
            if (editForm.new_password) {
                updateData.current_password = editForm.current_password;
                updateData.password = editForm.new_password;
                updateData.password_confirmation = editForm.new_password_confirmation;
            }

            const response = await api.put('/user/profile', updateData);
            
            setUser(response.data.user);
            localStorage.setItem('email', response.data.user.email);
            
            setEditForm({
                name: response.data.user.name,
                email: response.data.user.email,
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
            
            setEditing(false);
            setToast({
                message: 'Profile updated successfully!',
                type: 'success'
            });
            
            // Trigger auth change event with a slight delay to ensure state updates
            setTimeout(() => {
                window.dispatchEvent(new Event('auth-change'));
            }, 100);
        } catch (error) {
            console.error('Update error:', error);
            if (error.response?.data?.message) {
                setToast({
                    message: error.response.data.message,
                    type: 'error'
                });
            } else if (error.response?.status === 422) {
                setToast({
                    message: 'Invalid input. Please check your data.',
                    type: 'error'
                });
            } else if (error.response?.status === 401) {
                setToast({
                    message: 'Current password is incorrect',
                    type: 'error'
                });
            } else {
                setToast({
                    message: 'Failed to update profile',
                    type: 'error'
                });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        });
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-8 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-4 rounded-full">
                                        <FiUser size={32} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">{user.name || 'User Profile'}</h1>
                                        <p className="text-pink-100">{user.email}</p>
                                    </div>
                                </div>
                                {!editing && (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                                    >
                                        <FiEdit2 size={18} />
                                        <span>Edit Profile</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {!editing ? (
                                // View Mode
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <FiUser className="text-gray-400" size={20} />
                                            <span className="text-gray-900">{user.name || 'Not set'}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <FiMail className="text-gray-400" size={20} />
                                            <span className="text-gray-900">{user.email}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <FiLock className="text-gray-400" size={20} />
                                            <span className="text-gray-900">••••••••</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-sm text-gray-600">
                                            Member since {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // Edit Mode
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiUser className="text-gray-400" size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleInputChange}
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMail className="text-gray-400" size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleInputChange}
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t pt-6 mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password (Optional)</h3>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiLock className="text-gray-400" size={20} />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        id="current_password"
                                                        name="current_password"
                                                        value={editForm.current_password}
                                                        onChange={handleInputChange}
                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                        placeholder="Enter current password"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiLock className="text-gray-400" size={20} />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        id="new_password"
                                                        name="new_password"
                                                        value={editForm.new_password}
                                                        onChange={handleInputChange}
                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                        placeholder="Enter new password (min 8 characters)"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiLock className="text-gray-400" size={20} />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        id="new_password_confirmation"
                                                        name="new_password_confirmation"
                                                        value={editForm.new_password_confirmation}
                                                        onChange={handleInputChange}
                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 flex items-center justify-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            <FiSave size={20} />
                                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
