import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/apiSlice";
import uiReducer from "./slices/uiSlice";
import taskReducer from "./slices/taskSlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tasks'],
  timeout: 10000, // Only persist the tasks reducer
};

const persistedTaskReducer = persistReducer(persistConfig, taskReducer);

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ui: uiReducer,
    tasks: persistedTaskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;