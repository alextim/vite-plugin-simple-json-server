import { describe, it, vi, expect } from 'vitest';
import { render } from './test/test-utils';
import { act } from 'react-dom/test-utils';

import App from './App';

vi.mock('./services/remote-storage', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        abort: () => true,
        slice: vi.fn().mockResolvedValue({
          items: [{ id: 1, name: '123' }],
          totalCount: 1,
        }),
      };
    }),
  };
});

describe('Sample App vitest', () => {
  it('renders without crashing', async () => {
    let component: any;
    await act(async () => {
      component = render(<App />);
    });
    expect(await component.findByText(/Add new/i)).toBeInTheDocument();
    expect(await component.findByText(/Total Count:/i)).toBeInTheDocument();

    const el = await component.getByTestId('total-count');
    expect(el).toBeInTheDocument();
  });
});
