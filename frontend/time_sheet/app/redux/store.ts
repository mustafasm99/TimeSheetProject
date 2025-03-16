import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage"; // Use localStorage
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import AdminStore from "./features/admin-site";
import TaskStore from "./features/tasks-sites";
import CurrentTaskReducer from "./features/current-task";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["CurrentTaskReducer"], // Persist only specific reducers
};

// Root Reducer (combining all reducers)
const rootReducer = combineReducers({
  AdminStore,
  TaskStore,
  CurrentTaskReducer,
});

// Apply persistReducer to the entire rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Typed Redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
