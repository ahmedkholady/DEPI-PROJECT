import { useState } from 'react';
import { authAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accept, setAccept] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setAccept(true);
        setEmailError('');
        
        // Client-side validation
        if (password.length < 8) {
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.login({
                email: email,
                password: password,
            });

            if (response.status === 200) {
                // Trigger auth change event for cart update
                window.dispatchEvent(new Event('auth-change'));
                // Navigate to home and reload to update header
                navigate('/');
                window.location.reload();
            }
        } catch(error) {
            if (error.response) {
                setEmailError(error.response.status);
            } else {
                console.error('Login error:', error);
                alert('Network error. Please check if the backend is running.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            create a new account
                        </Link>
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                id="email" 
                                type="email" 
                                placeholder="Enter your email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                            {emailError === 422 && accept && 
                                <p className="text-red-500 text-sm mt-1">Email already exists</p>
                            }
                            {accept && emailError === 401 && 
                                <p className="text-red-500 text-sm mt-1">Invalid email or password</p>
                            }
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input 
                                id="password" 
                                type="password" 
                                placeholder="Enter your password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                            {password.length < 8 && accept && 
                                <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters</p>
                            }
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
