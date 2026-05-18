import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    query,
    where
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const WeeklyCalendar = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealPlan, setMealPlan] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingMeal, setEditingMeal] = useState(null);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMealType, setSelectedMealType] = useState(null);

    // Sample recipes (you can replace with your own data)
    const recipes = [
        { id: 1, name: 'Spaghetti Carbonara', type: 'dinner', prepTime: 20, image: '🍝' },
        { id: 2, name: 'Chicken Salad', type: 'lunch', prepTime: 15, image: '🥗' },
        { id: 3, name: 'Oatmeal with Berries', type: 'breakfast', prepTime: 10, image: '🥣' },
        { id: 4, name: 'Vegetable Stir Fry', type: 'dinner', prepTime: 25, image: '🥘' },
        { id: 5, name: 'Greek Yogurt Parfait', type: 'breakfast', prepTime: 5, image: '🥛' },
        { id: 6, name: 'Turkey Sandwich', type: 'lunch', prepTime: 10, image: '🥪' },
        { id: 7, name: 'Grilled Salmon', type: 'dinner', prepTime: 30, image: '🐟' },
        { id: 8, name: 'Smoothie Bowl', type: 'breakfast', prepTime: 10, image: '🥤' },
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    // Get week start date (Monday)
    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const weekStart = getWeekStart(selectedDate);
    const weekDates = days.map((_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
    });

    // Load meal plan from Firebase
    useEffect(() => {
        if (!user) return;

        const weekStartDate = formatDate(weekStart);
        const mealPlanRef = doc(db, 'mealPlans', `${user.uid}_${weekStartDate}`);

        const unsubscribe = onSnapshot(mealPlanRef, (doc) => {
            if (doc.exists()) {
                setMealPlan(doc.data());
            } else {
                // Initialize empty meal plan
                const emptyPlan = {};
                days.forEach(day => {
                    emptyPlan[day] = {
                        breakfast: null,
                        lunch: null,
                        dinner: null
                    };
                });
                setMealPlan(emptyPlan);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, weekStart]);

    // Save meal plan to Firebase
    const saveMealPlan = async (updatedPlan) => {
        if (!user) return;

        const weekStartDate = formatDate(weekStart);
        const mealPlanRef = doc(db, 'mealPlans', `${user.uid}_${weekStartDate}`);

        try {
            await setDoc(mealPlanRef, updatedPlan, { merge: true });
            toast.success('Meal plan saved!');
        } catch (error) {
            console.error('Error saving meal plan:', error);
            toast.error('Failed to save meal plan');
        }
    };

    // Add meal to plan
    const addMeal = (day, mealType, recipe) => {
        const updatedPlan = {
            ...mealPlan,
            [day]: {
                ...mealPlan[day],
                [mealType]: recipe
            }
        };
        setMealPlan(updatedPlan);
        saveMealPlan(updatedPlan);
        setShowRecipeModal(false);
        setSelectedDay(null);
        setSelectedMealType(null);
        toast.success(`${recipe.name} added to ${day} ${mealType}`);
    };

    // Remove meal from plan
    const removeMeal = (day, mealType) => {
        const updatedPlan = {
            ...mealPlan,
            [day]: {
                ...mealPlan[day],
                [mealType]: null
            }
        };
        setMealPlan(updatedPlan);
        saveMealPlan(updatedPlan);
        toast.success('Meal removed');
    };

    // Open recipe selection modal
    const openRecipeModal = (day, mealType) => {
        setSelectedDay(day);
        setSelectedMealType(mealType);
        setShowRecipeModal(true);
    };

    // Navigate weeks
    const previousWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 7);
        setSelectedDate(newDate);
    };

    const currentWeek = () => {
        setSelectedDate(new Date());
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading meal plan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
                            ← Back to Dashboard
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={currentWeek}
                                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Today
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <h1 className="text-2xl font-bold text-gray-800">Weekly Meal Calendar</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={previousWeek}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                ← Previous Week
                            </button>
                            <button
                                onClick={nextWeek}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Next Week →
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-500 mt-2">
                        Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="bg-indigo-600 text-white">
                                <th className="p-3 text-left">Day</th>
                                <th className="p-3 text-left">Breakfast</th>
                                <th className="p-3 text-left">Lunch</th>
                                <th className="p-3 text-left">Dinner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day, index) => (
                                <tr key={day} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold align-top">
                                        <div>{day}</div>
                                        <div className="text-xs text-gray-500">
                                            {weekDates[index].toLocaleDateString()}
                                        </div>
                                    </td>
                                    {mealTypes.map((mealType) => (
                                        <td key={mealType} className="p-3 align-top">
                                            {mealPlan[day]?.[mealType] ? (
                                                <div className="bg-gray-100 rounded-lg p-2 relative group">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{mealPlan[day][mealType].image}</span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm">
                                                                {mealPlan[day][mealType].name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {mealPlan[day][mealType].prepTime} min
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeMeal(day, mealType)}
                                                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => openRecipeModal(day, mealType)}
                                                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-2 text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition"
                                                >
                                                    + Add {mealType}
                                                </button>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recipe Selection Modal */}
            {showRecipeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Select a recipe for {selectedDay} {selectedMealType}
                            </h2>
                            <button
                                onClick={() => setShowRecipeModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recipes
                                    .filter(r => r.type === selectedMealType)
                                    .map((recipe) => (
                                        <button
                                            key={recipe.id}
                                            onClick={() => addMeal(selectedDay, selectedMealType, recipe)}
                                            className="border rounded-lg p-4 text-left hover:border-indigo-500 hover:shadow-lg transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{recipe.image}</span>
                                                <div>
                                                    <div className="font-semibold">{recipe.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        Prep time: {recipe.prepTime} minutes
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Weekly Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600">
                                {Object.values(mealPlan).reduce((total, day) => {
                                    return total + Object.values(day).filter(meal => meal !== null).length;
                                }, 0)}
                            </div>
                            <div className="text-gray-600">Total Meals Planned</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {new Set(
                                    Object.values(mealPlan).flatMap(day =>
                                        Object.values(day).filter(meal => meal !== null)
                                    )
                                ).size}
                            </div>
                            <div className="text-gray-600">Unique Recipes</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {Math.round(
                                    Object.values(mealPlan).reduce((total, day) => {
                                        return total + Object.values(day).reduce((dayTotal, meal) => {
                                            return dayTotal + (meal?.prepTime || 0);
                                        }, 0);
                                    }, 0) / 60
                                )}
                            </div>
                            <div className="text-gray-600">Total Prep Hours</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyCalendar;