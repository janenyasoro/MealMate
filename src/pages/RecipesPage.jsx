import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const RecipesPage = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [newRecipe, setNewRecipe] = useState({
        name: '',
        type: 'dinner',
        prepTime: '',
        image: '',
        ingredients: '',
        instructions: ''
    });

    // All recipes with their details
    const defaultRecipes = [
        {
            id: 1,
            name: 'Spaghetti Carbonara',
            type: 'dinner',
            prepTime: 20,
            image: '🍝',
            ingredients: [
                '400g spaghetti',
                '150g pancetta or guanciale',
                '4 large eggs',
                '100g Pecorino Romano cheese',
                '100g Parmesan cheese',
                'Fresh black pepper',
                'Salt'
            ],
            instructions: [
                'Bring a large pot of salted water to boil',
                'Cook spaghetti according to package instructions',
                'While pasta cooks, dice pancetta and fry until crispy',
                'In a bowl, whisk eggs with grated cheeses and black pepper',
                'Drain pasta, reserving 1 cup of pasta water',
                'Combine hot pasta with pancetta, then quickly stir in egg mixture',
                'Add pasta water as needed to create creamy sauce',
                'Serve immediately with extra cheese and pepper'
            ],
            nutrition: {
                calories: 680,
                protein: '28g',
                carbs: '75g',
                fat: '30g'
            }
        },
        {
            id: 2,
            name: 'Chicken Salad',
            type: 'lunch',
            prepTime: 15,
            image: '🥗',
            ingredients: [
                '2 cups cooked chicken, shredded',
                '1/2 cup mayonnaise',
                '1/4 cup Greek yogurt',
                '1 celery stalk, diced',
                '1/4 cup red onion, finely chopped',
                '1/4 cup dried cranberries',
                '1/4 cup walnuts, chopped',
                'Salt and pepper to taste',
                'Lettuce leaves for serving'
            ],
            instructions: [
                'In a large bowl, combine mayonnaise and Greek yogurt',
                'Add shredded chicken, celery, red onion, cranberries, and walnuts',
                'Mix until well combined',
                'Season with salt and pepper',
                'Serve on a bed of lettuce or as a sandwich',
                'Refrigerate for 30 minutes for best flavor'
            ],
            nutrition: {
                calories: 420,
                protein: '32g',
                carbs: '12g',
                fat: '28g'
            }
        },
        {
            id: 3,
            name: 'Oatmeal with Berries',
            type: 'breakfast',
            prepTime: 10,
            image: '🥣',
            ingredients: [
                '1 cup rolled oats',
                '2 cups milk or water',
                '1 tbsp honey or maple syrup',
                '1/2 cup mixed berries (fresh or frozen)',
                '1 banana, sliced',
                '2 tbsp chopped nuts',
                '1 tbsp chia seeds (optional)',
                'Cinnamon to taste'
            ],
            instructions: [
                'Bring milk or water to a boil in a saucepan',
                'Add oats and reduce heat to low',
                'Cook for 5-7 minutes, stirring occasionally',
                'Remove from heat and let stand for 2 minutes',
                'Top with berries, banana slices, nuts, and chia seeds',
                'Drizzle with honey and sprinkle with cinnamon',
                'Serve warm'
            ],
            nutrition: {
                calories: 380,
                protein: '12g',
                carbs: '55g',
                fat: '14g'
            }
        },
        {
            id: 4,
            name: 'Vegetable Stir Fry',
            type: 'dinner',
            prepTime: 25,
            image: '🥘',
            ingredients: [
                '2 cups broccoli florets',
                '1 red bell pepper, sliced',
                '1 yellow bell pepper, sliced',
                '2 carrots, julienned',
                '1 onion, sliced',
                '3 cloves garlic, minced',
                '1 tbsp ginger, grated',
                '1/4 cup soy sauce',
                '2 tbsp sesame oil',
                '1 tbsp cornstarch',
                'Cooked rice for serving'
            ],
            instructions: [
                'Mix soy sauce, sesame oil, and cornstarch in a small bowl',
                'Heat a wok or large pan over high heat',
                'Add vegetables and stir-fry for 2-3 minutes',
                'Add garlic and ginger, cook for 1 minute',
                'Pour sauce over vegetables and stir until thickened',
                'Serve hot over rice'
            ],
            nutrition: {
                calories: 320,
                protein: '8g',
                carbs: '45g',
                fat: '14g'
            }
        },
        {
            id: 5,
            name: 'Greek Yogurt Parfait',
            type: 'breakfast',
            prepTime: 5,
            image: '🥛',
            ingredients: [
                '1 cup Greek yogurt',
                '1/2 cup granola',
                '1/2 cup mixed berries',
                '1 tbsp honey',
                '2 tbsp chopped almonds',
                'Fresh mint for garnish'
            ],
            instructions: [
                'In a glass or bowl, layer half the yogurt',
                'Add a layer of granola and berries',
                'Repeat with remaining yogurt, granola, and berries',
                'Drizzle with honey',
                'Top with chopped almonds and fresh mint',
                'Serve immediately'
            ],
            nutrition: {
                calories: 350,
                protein: '20g',
                carbs: '40g',
                fat: '14g'
            }
        },
        {
            id: 6,
            name: 'Turkey Sandwich',
            type: 'lunch',
            prepTime: 10,
            image: '🥪',
            ingredients: [
                '2 slices whole grain bread',
                '4 slices turkey breast',
                '2 slices Swiss cheese',
                'Lettuce leaves',
                'Tomato slices',
                '1 tbsp mayonnaise',
                '1 tsp mustard',
                'Avocado slices (optional)'
            ],
            instructions: [
                'Toast bread slices until golden brown',
                'Spread mayonnaise and mustard on one side of each slice',
                'Layer turkey, cheese, lettuce, tomato, and avocado',
                'Close sandwich with the other slice of bread',
                'Cut in half and serve'
            ],
            nutrition: {
                calories: 450,
                protein: '32g',
                carbs: '35g',
                fat: '18g'
            }
        },
        {
            id: 7,
            name: 'Grilled Salmon',
            type: 'dinner',
            prepTime: 30,
            image: '🐟',
            ingredients: [
                '4 salmon fillets (6 oz each)',
                '2 tbsp olive oil',
                '2 cloves garlic, minced',
                '1 lemon, juiced and zested',
                '1 tbsp fresh dill, chopped',
                '1 tsp paprika',
                'Salt and pepper to taste',
                'Asparagus or green beans for serving'
            ],
            instructions: [
                'Mix olive oil, garlic, lemon juice, dill, paprika, salt, and pepper',
                'Marinate salmon for 15-20 minutes',
                'Preheat grill or pan to medium-high heat',
                'Cook salmon skin-side down for 4-5 minutes',
                'Flip and cook for another 3-4 minutes',
                'Serve with lemon wedges and roasted vegetables'
            ],
            nutrition: {
                calories: 450,
                protein: '40g',
                carbs: '5g',
                fat: '30g'
            }
        },
        {
            id: 8,
            name: 'Smoothie Bowl',
            type: 'breakfast',
            prepTime: 10,
            image: '🥤',
            ingredients: [
                '1 frozen banana',
                '1 cup frozen berries',
                '1/2 cup Greek yogurt',
                '1/2 cup almond milk',
                '1 tbsp almond butter',
                'Toppings: granola, coconut flakes, chia seeds, fresh berries'
            ],
            instructions: [
                'Blend banana, berries, yogurt, almond milk, and almond butter until smooth',
                'Pour into a bowl',
                'Top with granola, coconut flakes, chia seeds, and fresh berries',
                'Serve immediately with a spoon'
            ],
            nutrition: {
                calories: 420,
                protein: '15g',
                carbs: '60g',
                fat: '16g'
            }
        },
        {
            id: 9,
            name: 'Chicken Alfredo',
            type: 'dinner',
            prepTime: 35,
            image: '🍗',
            ingredients: [
                '2 chicken breasts, sliced',
                '400g fettuccine pasta',
                '2 cups heavy cream',
                '1 cup Parmesan cheese',
                '4 tbsp butter',
                '3 cloves garlic, minced',
                'Salt and pepper to taste',
                'Fresh parsley for garnish'
            ],
            instructions: [
                'Cook pasta according to package instructions',
                'Season chicken with salt and pepper, cook until golden',
                'In same pan, melt butter and sauté garlic',
                'Add heavy cream and simmer for 5 minutes',
                'Stir in Parmesan cheese until smooth',
                'Combine pasta, chicken, and sauce',
                'Garnish with parsley and serve'
            ],
            nutrition: {
                calories: 850,
                protein: '45g',
                carbs: '65g',
                fat: '48g'
            }
        },
        {
            id: 10,
            name: 'Beef Tacos',
            type: 'dinner',
            prepTime: 25,
            image: '🌮',
            ingredients: [
                '500g ground beef',
                '1 packet taco seasoning',
                '12 taco shells',
                '1 cup shredded lettuce',
                '1 cup diced tomatoes',
                '1 cup shredded cheese',
                '1/2 cup sour cream',
                '1/2 cup salsa'
            ],
            instructions: [
                'Brown ground beef in a skillet',
                'Add taco seasoning and water, simmer for 5 minutes',
                'Warm taco shells in the oven',
                'Fill shells with beef mixture',
                'Top with lettuce, tomatoes, cheese, sour cream, and salsa'
            ],
            nutrition: {
                calories: 520,
                protein: '28g',
                carbs: '35g',
                fat: '32g'
            }
        }
    ];

    // Load recipes
    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        setLoading(true);
        try {
            // For now, use default recipes since Firebase might not have them
            // If you want to load from Firebase, uncomment the code below

            // const recipesRef = collection(db, 'recipes');
            // const snapshot = await getDocs(recipesRef);
            // if (!snapshot.empty) {
            //   const recipesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            //   setRecipes(recipesData);
            // } else {
            //   // Add default recipes to Firebase
            //   for (const recipe of defaultRecipes) {
            //     await addDoc(recipesRef, recipe);
            //   }
            //   setRecipes(defaultRecipes);
            // }

            // Use default recipes directly (no Firebase needed)
            setRecipes(defaultRecipes);
        } catch (error) {
            console.error('Error loading recipes:', error);
            toast.error('Failed to load recipes');
            setRecipes(defaultRecipes);
        } finally {
            setLoading(false);
        }
    };

    const addRecipe = async () => {
        if (!newRecipe.name || !newRecipe.prepTime) {
            toast.error('Please fill in recipe name and prep time');
            return;
        }

        const recipeToAdd = {
            id: recipes.length + 1,
            name: newRecipe.name,
            type: newRecipe.type,
            prepTime: parseInt(newRecipe.prepTime),
            image: newRecipe.image || getImageForType(newRecipe.type),
            ingredients: newRecipe.ingredients.split('\n').filter(i => i.trim()),
            instructions: newRecipe.instructions.split('\n').filter(i => i.trim()),
            nutrition: {
                calories: 0,
                protein: '0g',
                carbs: '0g',
                fat: '0g'
            }
        };

        setRecipes([...recipes, recipeToAdd]);
        setShowAddModal(false);
        setNewRecipe({
            name: '',
            type: 'dinner',
            prepTime: '',
            image: '',
            ingredients: '',
            instructions: ''
        });
        toast.success('Recipe added successfully!');
    };

    const deleteRecipe = async (recipeId) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            setRecipes(recipes.filter(r => r.id !== recipeId));
            toast.success('Recipe deleted');
        }
    };

    const getImageForType = (type) => {
        switch (type) {
            case 'breakfast': return '🥣';
            case 'lunch': return '🥗';
            case 'dinner': return '🍝';
            default: return '🍽️';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'breakfast': return 'bg-yellow-100 text-yellow-800';
            case 'lunch': return 'bg-green-100 text-green-800';
            case 'dinner': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredRecipes = recipes;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading recipes...</p>
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
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            + Add Recipe
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">My Recipes</h1>
                    <p className="text-gray-500 mt-1">{filteredRecipes.length} recipes available</p>
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe) => (
                        <div key={recipe.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="text-5xl mb-3">{recipe.image}</div>
                                    <button
                                        onClick={() => deleteRecipe(recipe.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(recipe.type)}`}>
                                        {recipe.type}
                                    </span>
                                    <span className="text-sm text-gray-500">⏱️ {recipe.prepTime} min</span>
                                </div>
                                <button
                                    onClick={() => setSelectedRecipe(recipe)}
                                    className="w-full mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recipe Details Modal */}
            {selectedRecipe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{selectedRecipe.image}</span>
                                <h2 className="text-2xl font-bold">{selectedRecipe.name}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedRecipe.type)}`}>
                                        {selectedRecipe.type}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                                        ⏱️ {selectedRecipe.prepTime} minutes
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">🛒 Ingredients</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {selectedRecipe.ingredients?.map((ingredient, idx) => (
                                        <li key={idx} className="text-gray-700">{ingredient}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">👨‍🍳 Instructions</h3>
                                <ol className="list-decimal list-inside space-y-2">
                                    {selectedRecipe.instructions?.map((step, idx) => (
                                        <li key={idx} className="text-gray-700">{step}</li>
                                    ))}
                                </ol>
                            </div>

                            {selectedRecipe.nutrition && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2">📊 Nutrition Facts</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><span className="font-medium">Calories:</span> {selectedRecipe.nutrition.calories}</div>
                                        <div><span className="font-medium">Protein:</span> {selectedRecipe.nutrition.protein}</div>
                                        <div><span className="font-medium">Carbs:</span> {selectedRecipe.nutrition.carbs}</div>
                                        <div><span className="font-medium">Fat:</span> {selectedRecipe.nutrition.fat}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Recipe Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Add New Recipe</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Recipe Name *</label>
                                    <input
                                        type="text"
                                        value={newRecipe.name}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g., Spaghetti Carbonara"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Meal Type *</label>
                                    <select
                                        value={newRecipe.type}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, type: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="breakfast">Breakfast</option>
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Prep Time (minutes) *</label>
                                    <input
                                        type="number"
                                        value={newRecipe.prepTime}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, prepTime: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g., 30"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Ingredients (one per line)</label>
                                    <textarea
                                        rows="4"
                                        value={newRecipe.ingredients}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="400g spaghetti&#10;150g pancetta&#10;4 large eggs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Instructions (one per line)</label>
                                    <textarea
                                        rows="4"
                                        value={newRecipe.instructions}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="1. Bring water to boil&#10;2. Cook pasta&#10;3. Prepare sauce"
                                    />
                                </div>

                                <button
                                    onClick={addRecipe}
                                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
                                >
                                    Add Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipesPage;