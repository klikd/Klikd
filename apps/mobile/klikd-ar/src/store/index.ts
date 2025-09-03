import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { arSlice } from './slices/arSlice';
import { missionsSlice } from './slices/missionsSlice';
import { rewardsSlice } from './slices/rewardsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ar: arSlice.reducer,
    missions: missionsSlice.reducer,
    rewards: rewardsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
