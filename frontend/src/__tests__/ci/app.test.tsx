import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

describe('Wanderlust frontend CI tests', () => {
  it('renders the main application layout', () => {
    render(<App />);

    const appLayout = document.querySelector('.min-h-screen');

    expect(appLayout).toBeInTheDocument();
  });
});
