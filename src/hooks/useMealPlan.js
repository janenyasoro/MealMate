import { useState, useEffect } from 'react';
import { subscribeToMealPlan, saveMealPlan } from '../services/firebase';
import toast from 'react-hot-toast';

export const useMealPlan = (userId, weekStart) => {
    const [mealPlan, setMealPlan] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !weekStart) return;

        const unsubscribe = subscribeToMealPlan(userId, weekStart, (data) => {
            if (data && data.meals) {
                setMealPlan(data.meals);
            } else {
                initializeEmptyMealPlan();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, weekStart]);

    const initializeEmptyMealPlan = () => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const mealSlots = ['Breakfast', 'Lunch', 'Dinner'];
        const emptyPlan = {};
        daysOfWeek.forEach(day => {
            emptyPlan[day] = {};
            mealSlots.forEach(slot => {
                emptyPlan[day][slot] = null;
            });
        });
        setMealPlan(emptyPlan);
        return emptyPlan;
    };

    const updateMealPlan = async (newMealPlan) => {
        setMealPlan(newMealPlan);
        try {
            await saveMealPlan(userId, weekStart, newMealPlan);
            toast.success('Meal plan updated!');
        } catch (error) {
            toast.error('Failed to save meal plan');
            console.error(error);
        }
    };

    return { mealPlan, loading, updateMealPlan, initializeEmptyMealPlan };
};