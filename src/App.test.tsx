import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Smart DEX Wallet', () => {
  render(<App />);
  const linkElement = screen.getByText(/Smart DEX Wallet/i);
  expect(linkElement).toBeInTheDocument();
});
