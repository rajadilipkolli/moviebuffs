import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Pagination from '../../components/Pagination';

describe('Pagination Component', () => {
  const mockProducts = {
    data: [{ id: '1', title: 'Test Movie' }],
    pageNumber: 2,
    totalPages: 5
  };

  test('renders pagination links with correct URLs', () => {
    render(
      <BrowserRouter>
        <Pagination 
          products={mockProducts} 
          basePath="/products"
        />
      </BrowserRouter>
    );
    
    // First page link
    const firstLink = screen.getByLabelText('First');
    expect(firstLink).toHaveAttribute('href', '/products?page=1');
    
    // Previous page link
    const prevLink = screen.getByLabelText('Previous');
    expect(prevLink).toHaveAttribute('href', '/products?page=1');
    
    // Next page link
    const nextLink = screen.getByLabelText('Next');
    expect(nextLink).toHaveAttribute('href', '/products?page=3');
    
    // Last page link
    const lastLink = screen.getByLabelText('Last');
    expect(lastLink).toHaveAttribute('href', '/products?page=5');
    
    // Current page indicator
    expect(screen.getByText('2 of 5')).toBeInTheDocument();
  });

  test('renders pagination links with additional query parameters', () => {
    render(
      <BrowserRouter>
        <Pagination 
          products={mockProducts} 
          basePath="/products"
          genre="action"
          query="test"
        />
      </BrowserRouter>
    );
    
    // Check that links include both genre and query parameters
    const nextLink = screen.getByLabelText('Next');
    expect(nextLink).toHaveAttribute('href', '/products?page=3&genre=action&query=test');
    
    const prevLink = screen.getByLabelText('Previous');
    expect(prevLink).toHaveAttribute('href', '/products?page=1&genre=action&query=test');
  });

  test('disables navigation links when on first or last page', () => {
    // Test first page
    const firstPageProducts = {...mockProducts, pageNumber: 1};
    const { rerender } = render(
      <BrowserRouter>
        <Pagination 
          products={firstPageProducts} 
          basePath="/products"
        />
      </BrowserRouter>
    );
    
    // First and Previous links should be disabled
    expect(screen.getByLabelText('First').parentElement).toHaveClass('disabled');
    expect(screen.getByLabelText('Previous').parentElement).toHaveClass('disabled');
    
    // Test last page
    const lastPageProducts = {...mockProducts, pageNumber: 5};
    rerender(
      <BrowserRouter>
        <Pagination 
          products={lastPageProducts} 
          basePath="/products"
        />
      </BrowserRouter>
    );
    
    // Next and Last links should be disabled
    expect(screen.getByLabelText('Next').parentElement).toHaveClass('disabled');
    expect(screen.getByLabelText('Last').parentElement).toHaveClass('disabled');
  });

  test('renders nothing when there is only one page', () => {
    const singlePageProducts = {
      data: [{ id: '1', title: 'Test Movie' }],
      pageNumber: 1,
      totalPages: 1
    };
    
    const { container } = render(
      <BrowserRouter>
        <Pagination 
          products={singlePageProducts} 
          basePath="/products"
        />
      </BrowserRouter>
    );
    
    // Component should render nothing
    expect(container.firstChild).toBeNull();
  });
});
