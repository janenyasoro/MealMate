import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../services/firebase', () => ({
    signInWithGoogle: vi.fn(),
    signInWithGithub: vi.fn(),
    logout: vi.fn(),
    onAuthStateChange: vi.fn(),
    saveMealPlan: vi.fn(),
    getMealPlan: vi.fn(),
    getUserRecipes: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
};
global.localStorage = localStorageMock;