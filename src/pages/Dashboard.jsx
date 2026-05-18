import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">🍽️ MealMate Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {user?.photoURL && (
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <span className="text-gray-600">{user?.displayName || user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Welcome, {user?.displayName || user?.email}!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Plan your meals, discover recipes, and manage your shopping list.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/calendar" className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:bg-indigo-100 transition">
                            <h3 className="font-semibold text-lg text-indigo-700 mb-2">📅 Weekly Calendar</h3>
                            <p className="text-gray-600">Plan your meals for the week</p>
                        </Link>
                        <Link to="/recipes" className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition">
                            <h3 className="font-semibold text-lg text-green-700 mb-2">📖 Recipes</h3>
                            <p className="text-gray-600">Browse and manage recipes</p>
                        </Link>
                        <Link to="/shopping-list" className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition">
                            <h3 className="font-semibold text-lg text-orange-700 mb-2">🛒 Shopping List</h3>
                            <p className="text-gray-600">View your shopping list</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;