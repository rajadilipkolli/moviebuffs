import productsReducer from "../../store/reducers/products";
import * as actions from "../../store/actions/products";

describe('Products Reducer', () => {
  const initialState = {
    genres: [],
    products: { data: [] },
    product: {}
  };

  const sampleProducts = {
    data: [
      { id: '1', title: 'Test Movie 1' },
      { id: '2', title: 'Test Movie 2' }
    ],
    pageNumber: 1,
    totalPages: 10,
    totalElements: 100
  };

  const sampleGenres = [
    { id: '1', name: 'Action', slug: 'action' },
    { id: '2', name: 'Drama', slug: 'drama' }
  ];

  const sampleProduct = {
    id: '1',
    title: 'Test Movie 1',
    overview: 'A test movie description'
  };

  test('should return initial state', () => {
    expect(productsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle receiving products', () => {
    const action = { type: actions.RECEIVE_PRODUCTS, payload: sampleProducts };
    const newState = productsReducer(initialState, action);
    
    expect(newState.products).toEqual(sampleProducts);
    expect(newState.genres).toEqual([]);
    expect(newState.product).toEqual({});
  });

  test('should handle receiving a single product', () => {
    const action = { type: actions.RECEIVE_PRODUCT, payload: sampleProduct };
    const newState = productsReducer(initialState, action);
    
    expect(newState.product).toEqual(sampleProduct);
    expect(newState.products).toEqual({ data: [] });
    expect(newState.genres).toEqual([]);
  });

  test('should handle receiving genres', () => {
    const action = { type: actions.RECEIVE_ALL_GENRES, payload: sampleGenres };
    const newState = productsReducer(initialState, action);
    
    expect(newState.genres).toEqual(sampleGenres);
    expect(newState.products).toEqual({ data: [] });
    expect(newState.product).toEqual({});
  });
});
