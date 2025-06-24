import cartReducer from "../../store/reducers/cart";
import * as actions from "../../store/actions/cart";

describe('Cart Reducer', () => {
  const initialState = { cart: [] };
  const sampleProduct = { 
    id: '1', 
    title: 'Test Movie', 
    price: 9.99,
    poster_path: '/path/to/image.jpg',
    overview: 'A test movie description'
  };

  test('should return initial state', () => {
    expect(cartReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle adding product to empty cart', () => {
    const newState = cartReducer(initialState, actions.addProductToCart(sampleProduct));
    expect(newState.cart.length).toBe(1);
    expect(newState.cart[0]).toEqual({ product: sampleProduct, quantity: 1 });
  });

  test('should handle adding the same product to cart', () => {
    const stateWithProduct = { 
      cart: [{ product: sampleProduct, quantity: 1 }]
    };
    
    const newState = cartReducer(stateWithProduct, actions.addProductToCart(sampleProduct));
    expect(newState.cart.length).toBe(1);
    expect(newState.cart[0].quantity).toBe(2);
  });

  test('should handle clearing cart', () => {
    const stateWithProducts = {
      cart: [
        { product: sampleProduct, quantity: 1 },
        { product: { ...sampleProduct, id: '2' }, quantity: 2 }
      ]
    };
    
    const newState = cartReducer(stateWithProducts, actions.clearCart());
    expect(newState.cart).toEqual([]);
  });
});
