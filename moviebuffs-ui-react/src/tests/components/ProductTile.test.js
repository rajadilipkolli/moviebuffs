import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import ProductTile from '../../components/ProductTile';

describe('ProductTile Component', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Movie',
    trimmedTitle: 'Test Movie',
    trimmedOverview: 'This is a test movie description.',
    poster_path: '/path/to/image.jpg',
  };
  
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  test('renders product information correctly', () => {
    render(<ProductTile product={mockProduct} onAddToCart={mockAddToCart} />);
    
    // Check that the product title and overview are rendered
    expect(screen.getByText(mockProduct.trimmedTitle)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.trimmedOverview)).toBeInTheDocument();
    
    // Check that the image is rendered with correct attributes
    const image = screen.getByAltText('Movie');
    expect(image).toHaveAttribute('src', mockProduct.poster_path);
  });

  test('clicking add to cart button calls the handler', () => {
    render(<ProductTile product={mockProduct} onAddToCart={mockAddToCart} />);
    
    // Find and click the Add to Cart button
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    // Check that the onAddToCart handler was called with the correct product
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test('renders NavLink with correct URL', () => {
    render(<ProductTile product={mockProduct} onAddToCart={mockAddToCart} />);
    
    // Check that the NavLink has the correct to prop
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });
});
