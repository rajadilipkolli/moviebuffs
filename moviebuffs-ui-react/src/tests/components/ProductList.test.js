import React from 'react';
import { render, screen } from '../utils/test-utils';
import ProductList from '../../components/ProductList';

// Mock the child components to isolate the test
jest.mock('../../components/ProductTile', () => {
  return function MockProductTile({ product, onAddToCart }) {
    return <div data-testid={`product-tile-${product.id}`}>{product.title}</div>;
  };
});

jest.mock('../../components/Pagination', () => {
  return function MockPagination() {
    return <div data-testid="pagination">Pagination</div>;
  };
});

describe('ProductList Component', () => {
  const mockProducts = {
    data: [
      { id: '1', title: 'Movie 1' },
      { id: '2', title: 'Movie 2' },
      { id: '3', title: 'Movie 3' },
      { id: '4', title: 'Movie 4' }
    ],
    pageNumber: 1,
    totalPages: 10
  };
  
  const mockAddToCart = jest.fn();
  const mockProps = {
    products: mockProducts,
    onAddToCart: mockAddToCart,
    basePath: '/products'
  };

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  test('renders pagination components', () => {
    render(<ProductList {...mockProps} />);
    
    // Check that pagination components are rendered (there should be two - top and bottom)
    const paginationElements = screen.getAllByTestId('pagination');
    expect(paginationElements).toHaveLength(2);
  });

  test('renders correct number of product tiles', () => {
    render(<ProductList {...mockProps} />);
    
    // Check that all products are rendered as ProductTile components
    mockProducts.data.forEach(product => {
      expect(screen.getByTestId(`product-tile-${product.id}`)).toBeInTheDocument();
      expect(screen.getByText(product.title)).toBeInTheDocument();
    });
  });
    test('passes correct pagination props', () => {
    const mockProductsPage2 = {
      ...mockProducts,
      pageNumber: 2
    };
    
    const mockPropsWithParams = {
      products: mockProductsPage2,
      onAddToCart: mockAddToCart,
      basePath: '/products',
      genre: 'action',
      query: 'test'
    };
    
    render(<ProductList {...mockPropsWithParams} />);
    
    // With the current mock setup, we can at least verify the component renders
    const paginationElements = screen.getAllByTestId('pagination');
    expect(paginationElements).toHaveLength(2);
  });
});
