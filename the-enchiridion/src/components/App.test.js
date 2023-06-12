import { render, screen } from '@testing-library/react';
import Enchiridion from './Enchiridion';

test('renders learn react link', () => {
  render(<Enchiridion />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
