import { combineReducers } from 'redux';
import someReducer from './someReducer.js';  // Replace with your actual reducer

const rootReducer = combineReducers({
  someState: someReducer,  // Add other reducers if needed
});

export default rootReducer;