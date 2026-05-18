import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white px-4">
                <h1 className="text-5xl font-bold mb-4">🍽️ MealMate</h1>
                <p className="text-xl mb-8">Your personal meal planning companion</p>
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;