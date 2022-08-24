import { vi } from 'vitest';

export const Logger = vi.fn().mockImplementation(() => ({
  warn: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
}));

export const sendFileContent = vi.fn();
