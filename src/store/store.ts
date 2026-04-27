import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authSlice } from './services/slice/authSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from '../lib/persistStorage';
import { apiSlice } from './services/slice/apiSlice';
import { loaderSlice } from './services/slice/loaderSlice';
import { loaderMiddleware } from './middleware/loaderMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  blacklist: ['api'], // exclude RTK Query cache entirely
}

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice.reducer,
  loader:loaderSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store=configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required: ignore redux-persist internal actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware,loaderMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
