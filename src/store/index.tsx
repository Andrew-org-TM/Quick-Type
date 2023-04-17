import { configureStore } from '@reduxjs/toolkit';
import StatSlice from './slices/StatSlice';
import TypeInputSlice from './slices/TypeInputSlice';
import formatSlice from './slices/formatSlice';
import AuthSlice from './slices/AuthSlice';

const store = configureStore({
  reducer: {
    typeInput: TypeInputSlice,
    statSlice: StatSlice,
    format: formatSlice,
    auth: AuthSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
