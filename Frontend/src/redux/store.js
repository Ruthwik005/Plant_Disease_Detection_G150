// src/redux/store.js
import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer.js';  // Import the rootReducer

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Optional: for Redux DevTools
);

export default store;
