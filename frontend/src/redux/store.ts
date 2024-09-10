import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer'; // Your auth reducer
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage

// Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer, // Add other reducers here if needed
});

// Persist config
const persistConfig = {
  key: 'root', // Key for the root of your persisted state
  storage,     // Storage engine (defaults to localStorage)
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist non-serializable actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Persistor for PersistGate
export const persistor = persistStore(store);

// Export types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
