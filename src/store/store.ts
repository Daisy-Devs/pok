import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './services/apiSlice';
import { authSlice } from './services/slice/authSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store=configureStore({
  reducer: {
   [apiSlice.reducerPath]: apiSlice.reducer,
   auth: authSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
