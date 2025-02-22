import {configureStore} from '@reduxjs/toolkit';
import AdminStore from './features/admin-site';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import TaskStore from './features/tasks-sites';

export const store = configureStore({
     reducer: {
          AdminStore,
          TaskStore,
     },
     devTools: true
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;