import React from 'react';
import { render, screen } from '@testing-library/react';
import GenresList from '../../components/GenresList';
import * as reactRouterDom from 'react-router-dom';

// Hold the current genre for testing
let mockCurrentGenre = '';

// Create a spy on the NavLink component to check how it's being used
const originalNavLink = reactRouterDom.NavLink;

// Mock react-router-dom before importing components
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useSearchParams: () => [
      {
        get: (param) => param === 'genre' ? mockCurrentGenre : '',
      }
    ],
    NavLink: (props) => {
      // Extract the genre from the 'to' prop
      const linkParams = new URLSearchParams(props.to.split('?')[1] || '');
      const linkGenre = linkParams.get('genre') || '';
      
      // Determine if this link should be active
      const isLinkActive = linkGenre === mockCurrentGenre;
      
      // Call the className function with our simulated isActive state
      const className = typeof props.className === 'function' 
        ? props.className({ isActive: isLinkActive }) 
        : props.className;
        
      return <a href={props.to} className={className}>{props.children}</a>;
    }
  };
});

describe('GenresList Component', () => {
  const mockGenres = [
    { id: '1', name: 'Action', slug: 'action' },
    { id: '2', name: 'Drama', slug: 'drama' },
    { id: '3', name: 'Comedy', slug: 'comedy' }
  ];  beforeEach(() => {
    mockCurrentGenre = '';
  });

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

  test('applies active class only to the selected genre', () => {
    // Set up the mock to return 'drama' as the current genre
    mockCurrentGenre = 'drama';
    
    render(<GenresList genres={mockGenres} />);
    
    // Get all genre links
    const actionLink = screen.getByText('Action');
    const dramaLink = screen.getByText('Drama');
    const comedyLink = screen.getByText('Comedy');
    
    // Verify that only the Drama link has the active class
    expect(dramaLink).toHaveClass('list-group-item active');
    expect(actionLink).toHaveClass('list-group-item');
    expect(actionLink).not.toHaveClass('active');
    expect(comedyLink).toHaveClass('list-group-item');
    expect(comedyLink).not.toHaveClass('active');
  });
  
  test('handles the case when no genre is selected', () => {
    // No genre selected (empty string)
    mockCurrentGenre = '';
    
    render(<GenresList genres={mockGenres} />);
    
    // Check that none of the links have the active class
    const actionLink = screen.getByText('Action');
    const dramaLink = screen.getByText('Drama');
    const comedyLink = screen.getByText('Comedy');
    
    expect(actionLink).not.toHaveClass('active');
    expect(dramaLink).not.toHaveClass('active');
    expect(comedyLink).not.toHaveClass('active');
  });
});
