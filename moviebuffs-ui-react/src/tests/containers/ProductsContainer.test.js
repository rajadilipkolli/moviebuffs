import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ProductsContainer from '../../containers/ProductsContainer';
import * as actions from '../../store/actions/index';

// Mock the actions
jest.mock('../../store/actions/index', () => ({
  fetchProducts: jest.fn(),
  fetchAllGenres: jest.fn(),
  addProductToCart: jest.fn()
}));

// Mock URLSearchParams for different test scenarios
const mockURLSearchParams = {
  default: new URLSearchParams({ page: "2" }),
  withQuery: new URLSearchParams({ page: "1", query: "test" })
};

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [
    mockURLSearchParams.default,
    jest.fn()
  ]
}));

describe('ProductsContainer Component', () => {
  const mockProducts = {
    data: [
      { id: '1', title: 'Movie 1' },
      { id: '2', title: 'Movie 2' }
    ],
    pageNumber: 2,
    totalPages: 5
  };
  
  const mockGenres = [
    { id: '1', name: 'Action', slug: 'action' },
    { id: '2', name: 'Drama', slug: 'drama' }
  ];
  
  const mockState = {
    products: {
      products: mockProducts,
      genres: mockGenres
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the search params to default
    jest.requireMock('react-router-dom').useSearchParams = () => [
      mockURLSearchParams.default,
      jest.fn()
    ];
    
    // Mock action implementations
    actions.fetchProducts.mockImplementation((params) => ({
      type: 'MOCK_FETCH_PRODUCTS',
      payload: params
    }));
    
    actions.fetchAllGenres.mockImplementation(() => ({
      type: 'MOCK_FETCH_ALL_GENRES'
    }));
    
    actions.addProductToCart.mockImplementation((product) => ({
      type: 'MOCK_ADD_TO_CART',
      payload: product
    }));
  });

  test('fetches products with correct page parameter from URL', () => {
    render(<ProductsContainer />, { preloadedState: mockState });
    
    // Check that fetchProducts was called with the correct page from URL
    expect(actions.fetchProducts).toHaveBeenCalledWith(
      expect.objectContaining({ page: "2" })
    );
  });
  
  test('fetches products with query parameter when search is performed', async () => {
    // Set the useSearchParams mock to return with query param for this test
    jest.requireMock('react-router-dom').useSearchParams = () => [
      mockURLSearchParams.withQuery,
      jest.fn()
    ];
    
    render(<ProductsContainer />, { preloadedState: mockState });
    
    // Verify that fetchProducts was called with the correct query
    expect(actions.fetchProducts).toHaveBeenCalledWith(
      expect.objectContaining({ 
        page: expect.anything(),
        query: "test"
      })
    );
  });
    
  test('navigates to a new URL with page 1 when search is performed', () => {
    render(<ProductsContainer />, { preloadedState: mockState });
    
    // Type in search query
    const searchInput = screen.getByPlaceholderText('Search for movies');
    fireEvent.change(searchInput, { target: { value: 'new test' } });
    
    // Click search button - using a more specific query to get the search button
    const searchButton = screen.getByRole('button', { 
      name: '', // Empty name since the button contains just an icon
      // Finding the button that's closest to the search input
      // or you could specify a test ID in the component and use getByTestId
    });
    fireEvent.click(searchButton);
    
    // Verify navigation was called with correct URL
    expect(mockNavigate).toHaveBeenCalledWith('/products?page=1&query=new test');
    
    // Verify fetchProducts was called with page 1 and the new query
    expect(actions.fetchProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1, 
        query: 'new test'
      })
    );
  });
});
