import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            await signInWithGoogle();
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(error.message || 'Google sign in failed');
            toast.error(error.message || 'Google sign in failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
                toast.success('Account created successfully!');
            } else {
                await signInWithEmail(email, password);
                toast.success('Logged in successfully!');
            }
            navigate('/dashboard');
        } catch (error) {
            let userMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                userMessage = 'Email already registered. Please sign in instead.';
            } else if (error.code === 'auth/wrong-password') {
                userMessage = 'Incorrect password.';
            } else if (error.code === 'auth/user-not-found') {
                userMessage = 'No account found with this email. Please sign up first.';
            } else if (error.code === 'auth/weak-password') {
                userMessage = 'Password should be at least 6 characters.';
            }
            setErrorMessage(userMessage);
            toast.error(userMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setErrorMessage('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">🍽️ MealMate</h1>
                    <p className="text-gray-600 mt-2">
                        {isSignUp ? 'Create your account' : 'Sign in to continue'}
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        disabled={isLoading}
                        minLength={6}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>

                <p className="text-center text-gray-600 mt-4">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={toggleMode}
                        className="ml-2 text-indigo-600 hover:underline"
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;