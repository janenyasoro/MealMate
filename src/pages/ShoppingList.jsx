import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const ShoppingList = () => {
    const { user } = useAuth();
    const [shoppingList, setShoppingList] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealPlan, setMealPlan] = useState({});
    const [recipes, setRecipes] = useState([]);

    // All recipes with their ingredients
    const defaultRecipes = [
        {
            id: 1,
            name: 'Spaghetti Carbonara',
            type: 'dinner',
            prepTime: 20,
            image: '🍝',
            ingredients: [
                { name: 'spaghetti', quantity: 400, unit: 'g' },
                { name: 'pancetta', quantity: 150, unit: 'g' },
                { name: 'eggs', quantity: 4, unit: 'whole' },
                { name: 'Pecorino Romano cheese', quantity: 100, unit: 'g' },
                { name: 'Parmesan cheese', quantity: 100, unit: 'g' },
                { name: 'black pepper', quantity: 1, unit: 'tsp' },
                { name: 'salt', quantity: 1, unit: 'tsp' }
            ]
        },
        {
            id: 2,
            name: 'Chicken Salad',
            type: 'lunch',
            prepTime: 15,
            image: '🥗',
            ingredients: [
                { name: 'chicken breast', quantity: 2, unit: 'cups shredded' },
                { name: 'mayonnaise', quantity: 0.5, unit: 'cup' },
                { name: 'Greek yogurt', quantity: 0.25, unit: 'cup' },
                { name: 'celery', quantity: 1, unit: 'stalk diced' },
                { name: 'red onion', quantity: 0.25, unit: 'cup chopped' },
                { name: 'dried cranberries', quantity: 0.25, unit: 'cup' },
                { name: 'walnuts', quantity: 0.25, unit: 'cup chopped' },
                { name: 'lettuce', quantity: 1, unit: 'head' }
            ]
        },
        {
            id: 3,
            name: 'Oatmeal with Berries',
            type: 'breakfast',
            prepTime: 10,
            image: '🥣',
            ingredients: [
                { name: 'rolled oats', quantity: 1, unit: 'cup' },
                { name: 'milk', quantity: 2, unit: 'cups' },
                { name: 'honey', quantity: 1, unit: 'tbsp' },
                { name: 'mixed berries', quantity: 0.5, unit: 'cup' },
                { name: 'banana', quantity: 1, unit: 'whole' },
                { name: 'chopped nuts', quantity: 2, unit: 'tbsp' },
                { name: 'chia seeds', quantity: 1, unit: 'tbsp' }
            ]
        },
        {
            id: 4,
            name: 'Vegetable Stir Fry',
            type: 'dinner',
            prepTime: 25,
            image: '🥘',
            ingredients: [
                { name: 'broccoli', quantity: 2, unit: 'cups' },
                { name: 'red bell pepper', quantity: 1, unit: 'whole' },
                { name: 'yellow bell pepper', quantity: 1, unit: 'whole' },
                { name: 'carrots', quantity: 2, unit: 'whole' },
                { name: 'onion', quantity: 1, unit: 'whole' },
                { name: 'garlic', quantity: 3, unit: 'cloves' },
                { name: 'ginger', quantity: 1, unit: 'tbsp' },
                { name: 'soy sauce', quantity: 0.25, unit: 'cup' },
                { name: 'sesame oil', quantity: 2, unit: 'tbsp' },
                { name: 'cornstarch', quantity: 1, unit: 'tbsp' },
                { name: 'rice', quantity: 2, unit: 'cups cooked' }
            ]
        },
        {
            id: 5,
            name: 'Greek Yogurt Parfait',
            type: 'breakfast',
            prepTime: 5,
            image: '🥛',
            ingredients: [
                { name: 'Greek yogurt', quantity: 1, unit: 'cup' },
                { name: 'granola', quantity: 0.5, unit: 'cup' },
                { name: 'mixed berries', quantity: 0.5, unit: 'cup' },
                { name: 'honey', quantity: 1, unit: 'tbsp' },
                { name: 'almonds', quantity: 2, unit: 'tbsp chopped' }
            ]
        },
        {
            id: 6,
            name: 'Turkey Sandwich',
            type: 'lunch',
            prepTime: 10,
            image: '🥪',
            ingredients: [
                { name: 'whole grain bread', quantity: 2, unit: 'slices' },
                { name: 'turkey breast', quantity: 4, unit: 'slices' },
                { name: 'Swiss cheese', quantity: 2, unit: 'slices' },
                { name: 'lettuce', quantity: 2, unit: 'leaves' },
                { name: 'tomato', quantity: 2, unit: 'slices' },
                { name: 'mayonnaise', quantity: 1, unit: 'tbsp' },
                { name: 'mustard', quantity: 1, unit: 'tsp' }
            ]
        },
        {
            id: 7,
            name: 'Grilled Salmon',
            type: 'dinner',
            prepTime: 30,
            image: '🐟',
            ingredients: [
                { name: 'salmon fillets', quantity: 4, unit: 'fillets' },
                { name: 'olive oil', quantity: 2, unit: 'tbsp' },
                { name: 'garlic', quantity: 2, unit: 'cloves' },
                { name: 'lemon', quantity: 1, unit: 'whole' },
                { name: 'fresh dill', quantity: 1, unit: 'tbsp' },
                { name: 'paprika', quantity: 1, unit: 'tsp' },
                { name: 'asparagus', quantity: 1, unit: 'bunch' }
            ]
        },
        {
            id: 8,
            name: 'Smoothie Bowl',
            type: 'breakfast',
            prepTime: 10,
            image: '🥤',
            ingredients: [
                { name: 'banana', quantity: 1, unit: 'frozen' },
                { name: 'frozen berries', quantity: 1, unit: 'cup' },
                { name: 'Greek yogurt', quantity: 0.5, unit: 'cup' },
                { name: 'almond milk', quantity: 0.5, unit: 'cup' },
                { name: 'almond butter', quantity: 1, unit: 'tbsp' },
                { name: 'granola', quantity: 2, unit: 'tbsp' },
                { name: 'coconut flakes', quantity: 1, unit: 'tbsp' }
            ]
        },
        {
            id: 9,
            name: 'Chicken Alfredo',
            type: 'dinner',
            prepTime: 35,
            image: '🍗',
            ingredients: [
                { name: 'chicken breasts', quantity: 2, unit: 'whole' },
                { name: 'fettuccine pasta', quantity: 400, unit: 'g' },
                { name: 'heavy cream', quantity: 2, unit: 'cups' },
                { name: 'Parmesan cheese', quantity: 1, unit: 'cup' },
                { name: 'butter', quantity: 4, unit: 'tbsp' },
                { name: 'garlic', quantity: 3, unit: 'cloves' },
                { name: 'parsley', quantity: 2, unit: 'tbsp' }
            ]
        },
        {
            id: 10,
            name: 'Beef Tacos',
            type: 'dinner',
            prepTime: 25,
            image: '🌮',
            ingredients: [
                { name: 'ground beef', quantity: 500, unit: 'g' },
                { name: 'taco seasoning', quantity: 1, unit: 'packet' },
                { name: 'taco shells', quantity: 12, unit: 'shells' },
                { name: 'lettuce', quantity: 1, unit: 'cup shredded' },
                { name: 'tomatoes', quantity: 1, unit: 'cup diced' },
                { name: 'shredded cheese', quantity: 1, unit: 'cup' },
                { name: 'sour cream', quantity: 0.5, unit: 'cup' },
                { name: 'salsa', quantity: 0.5, unit: 'cup' }
            ]
        }
    ];

    // Get week start date
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
    const weekStartDate = formatDate(weekStart);

    // Load meal plan from Firebase and generate shopping list
    useEffect(() => {
        if (!user) return;

        const mealPlanRef = doc(db, 'mealPlans', `${user.uid}_${weekStartDate}`);

        const unsubscribe = onSnapshot(mealPlanRef, (doc) => {
            if (doc.exists()) {
                setMealPlan(doc.data());
                generateShoppingList(doc.data());
            } else {
                generateShoppingList({});
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, weekStartDate]);

    // Generate shopping list from meal plan
    const generateShoppingList = (plan) => {
        const ingredientsMap = new Map();
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const mealTypes = ['breakfast', 'lunch', 'dinner'];

        days.forEach(day => {
            mealTypes.forEach(mealType => {
                const recipeId = plan[day]?.[mealType]?.id;
                if (recipeId) {
                    const recipe = defaultRecipes.find(r => r.id === recipeId);
                    if (recipe && recipe.ingredients) {
                        recipe.ingredients.forEach(ingredient => {
                            const key = ingredient.name.toLowerCase();
                            if (ingredientsMap.has(key)) {
                                const existing = ingredientsMap.get(key);
                                existing.quantity += ingredient.quantity;
                                existing.recipes.push(recipe.name);
                            } else {
                                ingredientsMap.set(key, {
                                    name: ingredient.name,
                                    quantity: ingredient.quantity,
                                    unit: ingredient.unit,
                                    recipes: [recipe.name]
                                });
                            }
                        });
                    }
                }
            });
        });

        const list = Array.from(ingredientsMap.values());
        setShoppingList(list);

        // Load checked items from localStorage
        const savedChecked = localStorage.getItem(`shoppingList_${user?.uid}_${weekStartDate}`);
        if (savedChecked) {
            setCheckedItems(JSON.parse(savedChecked));
        } else {
            setCheckedItems({});
        }
    };

    // Toggle item checked status
    const toggleItem = (index) => {
        const newChecked = { ...checkedItems, [index]: !checkedItems[index] };
        setCheckedItems(newChecked);
        localStorage.setItem(`shoppingList_${user?.uid}_${weekStartDate}`, JSON.stringify(newChecked));
        toast.success(newChecked[index] ? 'Item checked off!' : 'Item unchecked');
    };

    // Clear all checked items
    const clearChecked = () => {
        setCheckedItems({});
        localStorage.removeItem(`shoppingList_${user?.uid}_${weekStartDate}`);
        toast.success('All items unchecked');
    };

    // Regenerate shopping list from current meal plan
    const regenerateList = () => {
        generateShoppingList(mealPlan);
        toast.success('Shopping list regenerated from meal plan');
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

    // Calculate progress
    const totalItems = shoppingList.length;
    const checkedCount = Object.values(checkedItems).filter(v => v === true).length;
    const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading shopping list...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 py-4">
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
                        <h1 className="text-2xl font-bold text-gray-800">🛒 Shopping List</h1>
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
                        Week of {weekStart.toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Progress Bar */}
                {totalItems > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Shopping Progress</span>
                            <span className="text-sm font-medium text-gray-700">
                                {checkedCount} of {totalItems} items checked
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        {progress === 100 && totalItems > 0 && (
                            <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                                🎉 All done! Great job planning your meals!
                            </div>
                        )}
                    </div>
                )}

                {/* Shopping List Content */}
                <div className="bg-white rounded-lg shadow">
                    {shoppingList.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No items yet</h3>
                            <p className="text-gray-500 mb-4">
                                Add meals to your weekly calendar to generate a shopping list
                            </p>
                            <Link
                                to="/calendar"
                                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Go to Weekly Calendar
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Items needed for this week
                                </h2>
                                <button
                                    onClick={clearChecked}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Clear checked
                                </button>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {shoppingList.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 hover:bg-gray-50 transition ${checkedItems[index] ? 'bg-gray-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <button
                                                onClick={() => toggleItem(index)}
                                                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${checkedItems[index]
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-gray-300 hover:border-green-500'
                                                    }`}
                                            >
                                                {checkedItems[index] && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap justify-between items-start gap-2">
                                                    <div>
                                                        <p className={`font-medium ${checkedItems[index] ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.quantity} {item.unit}
                                                        </p>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Used in: {item.recipes.join(', ')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {totalItems - checkedCount} items remaining
                                        </p>
                                        {checkedCount > 0 && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ {checkedCount} items checked off
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={regenerateList}
                                        className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                                    >
                                        Regenerate List
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Tips Section */}
                {shoppingList.length > 0 && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">💡 Shopping Tips</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Check items off as you shop</li>
                            <li>• Items are grouped by recipe usage</li>
                            <li>• Your progress is saved for this week</li>
                            <li>• Regenerate list if you change your meal plan</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingList;