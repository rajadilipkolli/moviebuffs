import React from 'react';
import { render, screen } from '../utils/test-utils';
import GenresList from '../../components/GenresList';

describe('GenresList Component', () => {
  const mockGenres = [
    { id: '1', name: 'Action', slug: 'action' },
    { id: '2', name: 'Drama', slug: 'drama' },
    { id: '3', name: 'Comedy', slug: 'comedy' }
  ];

  test('renders list of genres as links', () => {
    render(<GenresList genres={mockGenres} />);
    
    mockGenres.forEach(genre => {
      const link = screen.getByText(genre.name);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/genres?genre=${genre.slug}`);
    });
  });

  test('renders empty list when no genres are provided', () => {
    render(<GenresList genres={[]} />);
    const listItems = screen.queryAllByRole('link');
    expect(listItems.length).toBe(0);
  });
});
