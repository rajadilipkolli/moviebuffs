import userReducer from "../../store/reducers/user";
import * as actionTypes from "../../store/actions/actionTypes";

describe('User Reducer', () => {
  const initialState = {};
  const sampleUserData = {
    username: 'testuser',
    access_token: 'abc123',
    roles: ['USER']
  };

  test('should return initial state', () => {
    expect(userReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle login success', () => {
    const action = { 
      type: actionTypes.LOGIN_SUCCESS, 
      payload: sampleUserData 
    };
    
    const newState = userReducer(initialState, action);
    expect(newState).toEqual(sampleUserData);
  });

  test('should handle login failure', () => {
    const action = { type: actionTypes.LOGIN_FAILURE };
    const newState = userReducer(initialState, action);
    
    expect(newState).toEqual({ loginError: true });
  });

  test('should handle logout', () => {
    // Start with a logged-in state
    const loggedInState = { ...sampleUserData };
    
    const action = { type: actionTypes.LOGOUT };
    const newState = userReducer(loggedInState, action);
    
    expect(newState).toEqual({});
  });
});
