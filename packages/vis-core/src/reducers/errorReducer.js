export const errorActionTypes = {
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const initialState = {
  error: null,
};

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case errorActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case errorActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

export default errorReducer;
