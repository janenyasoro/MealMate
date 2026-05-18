import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { getWeekStartDate, calculateTotalCost, groupIngredients } from '../utils/helpers';

describe('LandingPage', () => {
    it('renders hero section correctly', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByText('MealMate')).toBeDefined();
        expect(screen.getByText(/Smart Weekly Meal Planner/)).toBeDefined();
    });

    it('displays features section', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Why Choose MealMate?')).toBeDefined();
        expect(screen.getByText('Weekly Calendar')).toBeDefined();
        expect(screen.getByText('Auto Shopping List')).toBeDefined();
    });

    it('has get started button when not authenticated', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Get Started Free →')).toBeDefined();
    });
});

describe('LoginPage', () => {
    it('renders login options', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Sign in to start/)).toBeDefined();
        expect(screen.getByText(/Continue with Google/)).toBeDefined();
        expect(screen.getByText(/Continue with GitHub/)).toBeDefined();
    });
});

describe('Helper Functions', () => {
    it('calculates week start date correctly', () => {
        const weekStart = getWeekStartDate(new Date('2024-01-15')); // Monday
        expect(weekStart).toBeDefined();
    });

    it('calculates total cost correctly', () => {
        const items = [
            { total: 10.5 },
            { total: 5.25 },
            { total: 3.75 }
        ];
        const total = calculateTotalCost(items);
        expect(total).toBe('19.50');
    });

    it('groups ingredients correctly', () => {
        const ingredients = [
            { name: 'Flour', quantity: 500 },
            { name: 'Sugar', quantity: 200 },
            { name: 'Flour', quantity: 250 }
        ];
        const grouped = groupIngredients(ingredients);
        expect(grouped.length).toBe(2);
        expect(grouped.find(i => i.name === 'Flour').quantity).toBe(750);
    });
});