// src/redux/reducers/someReducer.js
const initialState = {
    // Initial state
  };
  
  const someReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ACTION_TYPE': // Replace with your action
        return {
          ...state,
          // Update state
        };
      default:
        return state;
    }
  };
  
  export default someReducer;
  