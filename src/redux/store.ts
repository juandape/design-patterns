import { configureStore, Middleware } from '@reduxjs/toolkit';
import tasksSlice from './tasksSlice';

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof action.type === 'string' &&
    action.type.startsWith('tasks/')
  ) {
    const state = store.getState();
    localStorage.setItem('tasks', JSON.stringify(state.tasks.tasks));
  }
  return result;
};

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
