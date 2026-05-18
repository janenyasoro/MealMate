export const getWeekStartDate = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const weekStart = new Date(d.setDate(diff));
    return weekStart.toISOString().split('T')[0];
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const groupIngredients = (ingredients) => {
    const grouped = {};
    ingredients.forEach(ing => {
        const key = ing.name.toLowerCase();
        if (grouped[key]) {
            grouped[key].quantity += ing.quantity;
        } else {
            grouped[key] = { ...ing };
        }
    });
    return Object.values(grouped);
};

export const calculateTotalCost = (items) => {
    return items.reduce((total, item) => total + (item.total || 0), 0).toFixed(2);
};

export const getDaysOfWeek = () => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

export const getMealSlots = () => {
    return ['Breakfast', 'Lunch', 'Dinner'];
};

export const demoRecipes = [
    {
        id: '1',
        title: 'Pasta Carbonara',
        prepTime: 30,
        servings: 4,
        difficulty: 'Medium',
        ingredients: [
            { name: 'Pasta', quantity: 500, unit: 'g', price: 2.5 },
            { name: 'Eggs', quantity: 4, unit: 'pcs', price: 1.2 },
            { name: 'Pancetta', quantity: 200, unit: 'g', price: 4.5 },
            { name: 'Parmesan Cheese', quantity: 100, unit: 'g', price: 3.0 },
            { name: 'Black Pepper', quantity: 5, unit: 'g', price: 0.5 }
        ],
        instructions: '1. Boil pasta\n2. Fry pancetta\n3. Mix eggs and cheese\n4. Combine everything',
        image: 'https://via.placeholder.com/300x200'
    },
    {
        id: '2',
        title: 'Chicken Stir Fry',
        prepTime: 25,
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
            { name: 'Chicken Breast', quantity: 500, unit: 'g', price: 6.0 },
            { name: 'Bell Peppers', quantity: 2, unit: 'pcs', price: 2.0 },
            { name: 'Broccoli', quantity: 300, unit: 'g', price: 1.8 },
            { name: 'Soy Sauce', quantity: 50, unit: 'ml', price: 0.8 },
            { name: 'Garlic', quantity: 3, unit: 'cloves', price: 0.3 }
        ],
        instructions: '1. Cut chicken into strips\n2. Stir fry chicken\n3. Add vegetables\n4. Add sauce',
        image: 'https://via.placeholder.com/300x200'
    },
    {
        id: '3',
        title: 'Vegetable Soup',
        prepTime: 45,
        servings: 6,
        difficulty: 'Easy',
        ingredients: [
            { name: 'Carrots', quantity: 3, unit: 'pcs', price: 0.9 },
            { name: 'Celery', quantity: 4, unit: 'stalks', price: 1.0 },
            { name: 'Onions', quantity: 2, unit: 'pcs', price: 0.8 },
            { name: 'Tomatoes', quantity: 4, unit: 'pcs', price: 2.0 },
            { name: 'Vegetable Broth', quantity: 1, unit: 'L', price: 2.5 }
        ],
        instructions: '1. Chop all vegetables\n2. Sauté onions and garlic\n3. Add remaining vegetables\n4. Simmer for 30 minutes',
        image: 'https://via.placeholder.com/300x200'
    },
    {
        id: '4',
        title: 'Grilled Salmon',
        prepTime: 20,
        servings: 2,
        difficulty: 'Medium',
        ingredients: [
            { name: 'Salmon Fillets', quantity: 2, unit: 'pcs', price: 12.0 },
            { name: 'Lemon', quantity: 1, unit: 'pcs', price: 0.5 },
            { name: 'Dill', quantity: 10, unit: 'g', price: 1.0 },
            { name: 'Olive Oil', quantity: 30, unit: 'ml', price: 0.6 },
            { name: 'Garlic', quantity: 2, unit: 'cloves', price: 0.2 }
        ],
        instructions: '1. Season salmon\n2. Heat grill\n3. Cook salmon 4-5 minutes each side\n4. Serve with lemon',
        image: 'https://via.placeholder.com/300x200'
    },
    {
        id: '5',
        title: 'Quinoa Salad',
        prepTime: 15,
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
            { name: 'Quinoa', quantity: 200, unit: 'g', price: 2.5 },
            { name: 'Cucumber', quantity: 1, unit: 'pcs', price: 0.7 },
            { name: 'Cherry Tomatoes', quantity: 200, unit: 'g', price: 2.0 },
            { name: 'Feta Cheese', quantity: 150, unit: 'g', price: 2.8 },
            { name: 'Olive Oil', quantity: 30, unit: 'ml', price: 0.6 }
        ],
        instructions: '1. Cook quinoa\n2. Chop vegetables\n3. Mix everything\n4. Add dressing',
        image: 'https://via.placeholder.com/300x200'
    }
];