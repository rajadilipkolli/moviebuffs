import React from 'react';
import { render, screen } from '../utils/test-utils';
import ProductContainer from '../../containers/ProductContainer';
import * as actions from '../../store/actions/index';
import { useParams } from 'react-router-dom';

// Mock the actions
jest.mock('../../store/actions/index', () => ({
  fetchProductById: jest.fn(),
  addProductToCart: jest.fn()
}));

// Mock the Product component to simplify testing
jest.mock('../../components/Product', () => {
  return function MockProduct({ product, onAddToCart }) {
    return (
      <div data-testid="product-component">
        <h1>{product.title || 'No Product'}</h1>
        <button 
          data-testid="add-to-cart-button"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    );
  };
});

// Mock useParams to return the expected id
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

describe('ProductContainer Component', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Movie',
    overview: 'A test movie description'
  };
  
  const mockState = {
    products: {
      product: mockProduct
    }
  };

  beforeEach(() => {
    // Reset mock implementations
    actions.fetchProductById.mockClear();
    actions.addProductToCart.mockClear();
    
    // Mock implementation for fetchProductById action creator
    actions.fetchProductById.mockImplementation(() => ({
      type: 'MOCK_FETCH_PRODUCT_BY_ID'
    }));
    
    // Mock implementation for addProductToCart action creator
    actions.addProductToCart.mockImplementation((product) => ({
      type: 'MOCK_ADD_PRODUCT_TO_CART',
      payload: product
    }));
  });

  test('fetches product on mount', () => {
    render(<ProductContainer />, { preloadedState: mockState });
    
    // Check that the fetchProductById action was dispatched with the correct ID
    expect(actions.fetchProductById).toHaveBeenCalledWith('1');
  });

  test('renders Product component with correct props', () => {
    render(<ProductContainer />, { preloadedState: mockState });
    
    // Check that the Product component renders the product title
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  test('dispatches addProductToCart action when Add to Cart button is clicked', () => {
    // Create a mock dispatch function
    const mockDispatch = jest.fn();
    
    // Mock useDispatch to return our mock function
    jest.mock('react-redux', () => ({
      ...jest.requireActual('react-redux'),
      useDispatch: () => mockDispatch
    }));
    
    render(<ProductContainer />, { preloadedState: mockState });
    
    // Find and click the Add to Cart button
    const addButton = screen.getByTestId('add-to-cart-button');
    addButton.click();
    
    // Check that the addProductToCart action creator was called
    expect(actions.addProductToCart).toHaveBeenCalled();
  });
});
