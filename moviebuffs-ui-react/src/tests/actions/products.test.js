import axios from "../../store/actions/axios";
import * as productActions from "../../store/actions/products";

jest.mock("../../store/actions/axios");

describe('Product Actions', () => {
  let dispatch;
  
  beforeEach(() => {
    dispatch = jest.fn();
    axios.get.mockReset();
  });

  test('receiveProducts should create correct action', () => {
    const products = { data: [{ id: '1', title: 'Test Movie' }] };
    const action = productActions.receiveProducts(products);
    
    expect(action).toEqual({
      type: productActions.RECEIVE_PRODUCTS,
      payload: products
    });
  });

  test('receiveProduct should create correct action', () => {
    const product = { id: '1', title: 'Test Movie' };
    const action = productActions.receiveProduct(product);
    
    expect(action).toEqual({
      type: productActions.RECEIVE_PRODUCT,
      payload: product
    });
  });

  test('receiveAllGenres should create correct action', () => {
    const genres = [{ id: '1', name: 'Action' }];
    const action = productActions.receiveAllGenres(genres);
    
    expect(action).toEqual({
      type: productActions.RECEIVE_ALL_GENRES,
      payload: genres
    });
  });

  test('fetchProducts should call API with correct parameters and dispatch action', async () => {
    const params = { page: 1, query: 'test', genre: 'action' };
    const products = { 
      data: [{ id: '1', title: 'Test Movie' }],
      pageNumber: 1,
      totalPages: 10
    };
    
    axios.get.mockResolvedValue({ data: products });
    
    const thunkFunction = productActions.fetchProducts(params);
    await thunkFunction(dispatch, () => {});
    
    // Check that axios.get was called with correct URL
    expect(axios.get).toHaveBeenCalledWith('/api/movies?page=1&query=test&genre=action');
    
    // Check that dispatch was called with correct action
    expect(dispatch).toHaveBeenCalledWith(productActions.receiveProducts(products));
  });

  test('fetchProducts should work with minimal parameters', async () => {
    const params = { page: 1 };
    const products = { data: [] };
    
    axios.get.mockResolvedValue({ data: products });
    
    const thunkFunction = productActions.fetchProducts(params);
    await thunkFunction(dispatch, () => {});
    
    // Check that axios.get was called with correct URL
    expect(axios.get).toHaveBeenCalledWith('/api/movies?page=1');
    
    // Check that dispatch was called with correct action
    expect(dispatch).toHaveBeenCalledWith(productActions.receiveProducts(products));
  });
  
  test('fetchProducts should handle string page parameter correctly', async () => {
    // Test with page as a string value, as it would come from URL parameters
    const params = { page: "2" };
    const products = { 
      data: [{ id: '3', title: 'Test Movie 3' }],
      pageNumber: 2,
      totalPages: 10
    };
    
    axios.get.mockResolvedValue({ data: products });
    
    const thunkFunction = productActions.fetchProducts(params);
    await thunkFunction(dispatch, () => {});
    
    // Check that axios.get was called with correct URL - page=2 should be passed
    expect(axios.get).toHaveBeenCalledWith('/api/movies?page=2');
    
    // Check that dispatch was called with correct action
    expect(dispatch).toHaveBeenCalledWith(productActions.receiveProducts(products));
  });

  test('fetchProductById should call API and dispatch action', async () => {
    const productId = '123';
    const product = { id: '123', title: 'Test Movie' };
    
    axios.get.mockResolvedValue({ data: product });
    
    const thunkFunction = productActions.fetchProductById(productId);
    await thunkFunction(dispatch, () => {});
    
    // Check that axios.get was called with correct URL
    expect(axios.get).toHaveBeenCalledWith('/api/movies/123');
    
    // Check that dispatch was called with correct action
    expect(dispatch).toHaveBeenCalledWith(productActions.receiveProduct(product));
  });

  test('fetchAllGenres should call API and dispatch action', async () => {
    const genres = [
      { id: '1', name: 'Action', slug: 'action' },
      { id: '2', name: 'Drama', slug: 'drama' }
    ];
    
    axios.get.mockResolvedValue({ data: genres });
    
    const thunkFunction = productActions.fetchAllGenres();
    await thunkFunction(dispatch, () => {});
    
    // Check that axios.get was called with correct URL
    expect(axios.get).toHaveBeenCalledWith('/api/genres');
    
    // Check that dispatch was called with correct action
    expect(dispatch).toHaveBeenCalledWith(productActions.receiveAllGenres(genres));
  });

  test('fetchProducts should properly handle route changes with different page parameters', async () => {
    // First page request
    let params = { page: "1" };
    let products = { 
      data: [{ id: '1', title: 'Test Movie 1' }],
      pageNumber: 1,
      totalPages: 10
    };
    
    axios.get.mockResolvedValue({ data: products });
    
    let thunkFunction = productActions.fetchProducts(params);
    await thunkFunction(dispatch, () => {});
    
    expect(axios.get).toHaveBeenCalledWith('/api/movies?page=1');
    
    // Simulate route change to page 2
    params = { page: "2" };
    products = { 
      data: [{ id: '2', title: 'Test Movie 2' }],
      pageNumber: 2,
      totalPages: 10
    };
    
    axios.get.mockReset();
    axios.get.mockResolvedValue({ data: products });
    
    thunkFunction = productActions.fetchProducts(params);
    await thunkFunction(dispatch, () => {});
    
    // Verify correct page parameter is sent to API
    expect(axios.get).toHaveBeenCalledWith('/api/movies?page=2');
    
    // Simulate route change to page 3 with additional parameters
    params = { page: "3", genre: "action", query: "test" };
    products = { 
      data: [{ id: '3', title: 'Test Movie 3' }],
      pageNumber: 3,
      totalPages: 10
    };
    
    axios.get.mockReset();
    axios.get.mockResolvedValue({ data: products });
    
    thunkFunction = productActions.fetchProducts(params);
    await thunkFunction(dispatch, () => {});
    
    // Verify correct parameters are sent to API
    expect(axios.get).toHaveBeenCalledWith('/api/movies?page=3&query=test&genre=action');
  });
});
