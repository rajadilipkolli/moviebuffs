// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = {
  reload: jest.fn(),
  href: '',
  pathname: '/'
};

// Mock console methods to avoid cluttering test output
console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn();

// Setup mock for react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '1', orderId: '1' }),
  useSearchParams: () => [
    { get: (param) => param === 'page' ? '1' : param === 'genre' ? 'action' : '' }
  ],
}));
