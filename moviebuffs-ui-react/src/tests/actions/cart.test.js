import axios from "../../store/actions/axios";
import * as cartActions from "../../store/actions/cart";
import { history } from "../../history";

jest.mock("../../store/actions/axios");
jest.mock("../../history", () => ({
  history: {
    navigate: jest.fn()
  }
}));

describe('Cart Actions', () => {
  let dispatch;
  
  beforeEach(() => {
    dispatch = jest.fn();
    axios.post.mockReset();
    axios.get.mockReset();
    history.navigate.mockReset();
  });

  test('addProductToCart should create correct action', () => {
    const product = { id: '1', title: 'Test Movie' };
    const action = cartActions.addProductToCart(product);
    
    expect(action).toEqual({
      type: cartActions.ADD_PRODUCT_TO_CART,
      payload: product
    });
  });

  test('clearCart should create correct action', () => {
    const action = cartActions.clearCart();
    
    expect(action).toEqual({
      type: cartActions.CLEAR_CART
    });
  });

  test('placeOrder should call API and dispatch success actions', async () => {
    const order = {
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      items: [{ productId: '1', quantity: 1 }]
    };
    
    const responseData = { 
      orderId: '12345',
      customerName: 'Test User'
    };
    
    axios.post.mockResolvedValue({ data: responseData });
    
    const thunkFunction = cartActions.placeOrder(order);
    await thunkFunction(dispatch, () => {});
    
    // Check that axios.post was called correctly
    expect(axios.post).toHaveBeenCalledWith('/api/orders', order);
    
    // Check that dispatch was called with correct actions
    expect(dispatch).toHaveBeenCalledWith(cartActions.orderCreationSuccess(responseData));
    expect(dispatch).toHaveBeenCalledWith(cartActions.clearCart());
    
    // Check that history.navigate was called correctly
    expect(history.navigate).toHaveBeenCalledWith('/orderconfirmation/12345');
  });

  test('fetchOrderById should call API and return data', async () => {
    const responseData = { 
      orderId: '12345',
      customerName: 'Test User',
      items: [{ productId: '1', quantity: 1 }]
    };
    
    axios.get.mockResolvedValue({ data: responseData });
    
    const result = await cartActions.fetchOrderById('12345');
    
    // Check that axios.get was called correctly
    expect(axios.get).toHaveBeenCalledWith('/api/orders/12345');
    
    // Check that the function returns the response data
    expect(result).toEqual(responseData);
  });

  test('fetchOrderById should handle errors', async () => {
    const error = new Error('Network error');
    axios.get.mockRejectedValue(error);
      expect.assertions(2); // Ensure we have two assertions in this test
    
    await expect(cartActions.fetchOrderById('12345')).rejects.toThrow(error);
    
    expect(console.log).toHaveBeenCalledWith('error', error);
  });
});
