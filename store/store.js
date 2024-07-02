import { configureStore } from '@reduxjs/toolkit';
import visualisationsReducer from './slices/visualisationsSlice';

export const store = configureStore({
  reducer: {
    visualisations: visualisationsReducer,
  },
});

export default store;