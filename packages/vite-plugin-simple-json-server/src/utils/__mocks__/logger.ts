import { vi } from 'vitest';

const mockLogger = vi.fn().mockImplementation(() => ({
  warn: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
}));

export default mockLogger;
