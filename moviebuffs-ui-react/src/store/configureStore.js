import { configureStore } from '@reduxjs/toolkit';
import { loadState, saveState } from "./localStorage";
import rootReducer from "./reducers/index";

const persistedState = loadState();

const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(process.env.NODE_ENV !== 'production' ? require('redux-logger').createLogger() : [])
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
