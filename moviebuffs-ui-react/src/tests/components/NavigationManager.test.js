import React from 'react';
import { render } from '../utils/test-utils';
import { NavigationManager } from '../../components/NavigationManager';
import { history } from '../../history';

jest.mock('../../history');

describe('NavigationManager Component', () => {
  test('sets the navigate function in history', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    render(<NavigationManager />);
    
    // Check that history.setNavigate was called with the navigate function
    expect(history.setNavigate).toHaveBeenCalled();
  });

  test('renders nothing visible to the user', () => {
    const { container } = render(<NavigationManager />);
    expect(container.firstChild).toBeNull();
  });
});
