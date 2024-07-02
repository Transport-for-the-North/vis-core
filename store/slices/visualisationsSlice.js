import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // your initial state here
};

const visualisationsSlice = createSlice({
  name: 'visualisations',
  initialState,
  reducers: {
    // your reducers here
  },
});

export const { actions } = visualisationsSlice;
export default visualisationsSlice.reducer;