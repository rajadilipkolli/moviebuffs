import axios from "../../store/actions/axios";
import * as userActions from "../../store/actions/user";
import * as actionTypes from "../../store/actions/actionTypes";

jest.mock("../../store/actions/axios");

describe('User Actions', () => {
  let dispatch;
  
  beforeEach(() => {
    dispatch = jest.fn();
    axios.post.mockReset();
  });

  test('login should call API and dispatch LOGIN_SUCCESS on success', async () => {
    const credentials = { username: 'testuser', password: 'password' };
    const userData = { 
      username: 'testuser',
      access_token: 'abc123',
      roles: ['USER']
    };
    
    axios.post.mockResolvedValue({ data: userData });
    
    const thunkFunction = userActions.login(credentials);
    await thunkFunction(dispatch, () => {});
    
    // Check that axios.post was called correctly
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
    
    // Check that dispatch was called with LOGIN_SUCCESS action
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.LOGIN_SUCCESS,
      payload: userData
    });
  });

  test('login should dispatch LOGIN_FAILURE on error', async () => {
    const credentials = { username: 'testuser', password: 'wrong' };
    const error = new Error('Invalid credentials');
    
    axios.post.mockRejectedValue(error);
    
    const thunkFunction = userActions.login(credentials);
    
    try {
      await thunkFunction(dispatch, () => {});
    } catch (e) {
      expect(e).toBe(error);
    }
    
    // Check that axios.post was called correctly
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
    
    // Check that dispatch was called with LOGIN_FAILURE action
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.LOGIN_FAILURE
    });
    
    // Check that error was logged
    expect(console.log).toHaveBeenCalledWith('login error', error);
  });
});
