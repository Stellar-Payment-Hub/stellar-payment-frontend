import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti for headless test environment
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));
