import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ARState {
  isARSupported: boolean;
  isARActive: boolean;
  anchors: ARAnchor[];
  currentSession: ARSession | null;
  trackingState: 'initializing' | 'tracking' | 'limited' | 'not_available';
}

export interface ARAnchor {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  assetUrl: string;
  metadata: Record<string, any>;
}

export interface ARSession {
  id: string;
  startTime: Date;
  anchorsPlaced: number;
  interactionsCount: number;
}

const initialState: ARState = {
  isARSupported: false,
  isARActive: false,
  anchors: [],
  currentSession: null,
  trackingState: 'not_available',
};

export const arSlice = createSlice({
  name: 'ar',
  initialState,
  reducers: {
    setARSupported: (state, action: PayloadAction<boolean>) => {
      state.isARSupported = action.payload;
    },
    setARActive: (state, action: PayloadAction<boolean>) => {
      state.isARActive = action.payload;
    },
    setTrackingState: (state, action: PayloadAction<ARState['trackingState']>) => {
      state.trackingState = action.payload;
    },
    addAnchor: (state, action: PayloadAction<ARAnchor>) => {
      state.anchors.push(action.payload);
    },
    removeAnchor: (state, action: PayloadAction<string>) => {
      state.anchors = state.anchors.filter(anchor => anchor.id !== action.payload);
    },
    startSession: (state, action: PayloadAction<string>) => {
      state.currentSession = {
        id: action.payload,
        startTime: new Date(),
        anchorsPlaced: 0,
        interactionsCount: 0,
      };
    },
    endSession: (state) => {
      state.currentSession = null;
    },
    incrementInteractions: (state) => {
      if (state.currentSession) {
        state.currentSession.interactionsCount += 1;
      }
    },
  },
});
