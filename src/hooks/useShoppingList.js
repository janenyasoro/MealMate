import { useState, useEffect } from 'react';
import { subscribeToShoppingList, saveShoppingList, updateShoppingListItem } from '../services/firebase';
import toast from 'react-hot-toast';

export const useShoppingList = (userId, weekStart, mealPlan) => {
    const [shoppingList, setShoppingList] = useState({ items: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !weekStart) return;

        const unsubscribe = subscribeToShoppingList(userId, weekStart, (data) => {
            if (data) {
                setShoppingList(data);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, weekStart]);

    const generateShoppingList = (mealPlanData) => {
        if (!mealPlanData) return [];

        const ingredientsMap = new Map();

        // Iterate through all meals
        Object.values(mealPlanData).forEach(day => {
            Object.values(day).forEach(meal => {
                if (meal && meal.ingredients) {
                    meal.ingredients.forEach(ingredient => {
                        const key = ingredient.name.toLowerCase();
                        if (ingredientsMap.has(key)) {
                            const existing = ingredientsMap.get(key);
                            existing.quantity += ingredient.quantity;
                            existing.total += ingredient.quantity * (ingredient.price || 0);
                        } else {
                            ingredientsMap.set(key, {
                                id: Date.now() + Math.random(),
                                name: ingredient.name,
                                quantity: ingredient.quantity,
                                unit: ingredient.unit,
                                checked: false,
                                price: ingredient.price || 0,
                                total: ingredient.quantity * (ingredient.price || 0)
                            });
                        }
                    });
                }
            });
        });

        return Array.from(ingredientsMap.values());
    };

    const updateShoppingList = async () => {
        const newItems = generateShoppingList(mealPlan);
        await saveShoppingList(userId, weekStart, newItems);
        toast.success('Shopping list updated!');
    };

    const toggleItem = async (itemId) => {
        await updateShoppingListItem(userId, weekStart, itemId, !shoppingList.items.find(i => i.id === itemId)?.checked);
    };

    return { shoppingList, loading, updateShoppingList, toggleItem, generateShoppingList };
};