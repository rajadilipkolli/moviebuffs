
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components used by App
jest.mock('./components/Layout', () => {
  return function MockLayout() {
    return <div data-testid="layout-component">Layout Component</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  RouterProvider: ({ router }) => <div data-testid="router-provider">Router Provider</div>,
  createBrowserRouter: () => ({}),
  createRoutesFromElements: () => ({})
}));

describe('App Component', () => {
  test('renders RouterProvider', () => {
    render(<App />);
    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
  });
});