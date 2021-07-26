import { render, screen } from '@testing-library/react';
import App from './App';

test('load security code dropdown', () => {
  render(<App />)
  const secText = screen.getByTestId(/wrapper/);
  expect(secText).toBeInTheDocument();
});
