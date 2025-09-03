import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'ar_scan' | 'social_share' | 'location_visit' | 'purchase';
  status: 'available' | 'active' | 'completed' | 'expired';
  reward: {
    xp: number;
    coins: number;
    items?: string[];
  };
  requirements: {
    location?: {
      latitude: number;
      longitude: number;
      radius: number;
    };
    products?: string[];
    socialPlatforms?: string[];
  };
  progress: number; // 0-100
  expiresAt: string;
  createdAt: string;
}

export interface MissionsState {
  missions: Mission[];
  activeMissions: Mission[];
  completedMissions: Mission[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MissionsState = {
  missions: [],
  activeMissions: [],
  completedMissions: [],
  isLoading: false,
  error: null,
};

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setMissions: (state, action: PayloadAction<Mission[]>) => {
      state.missions = action.payload;
    },
    addMission: (state, action: PayloadAction<Mission>) => {
      state.missions.push(action.payload);
    },
    updateMission: (state, action: PayloadAction<{ id: string; updates: Partial<Mission> }>) => {
      const index = state.missions.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.missions[index] = { ...state.missions[index], ...action.payload.updates };
      }
    },
    startMission: (state, action: PayloadAction<string>) => {
      const mission = state.missions.find(m => m.id === action.payload);
      if (mission) {
        mission.status = 'active';
        state.activeMissions.push(mission);
      }
    },
    completeMission: (state, action: PayloadAction<string>) => {
      const mission = state.missions.find(m => m.id === action.payload);
      if (mission) {
        mission.status = 'completed';
        mission.progress = 100;
        state.activeMissions = state.activeMissions.filter(m => m.id !== action.payload);
        state.completedMissions.push(mission);
      }
    },
    updateProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const mission = state.missions.find(m => m.id === action.payload.id);
      if (mission) {
        mission.progress = action.payload.progress;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});
