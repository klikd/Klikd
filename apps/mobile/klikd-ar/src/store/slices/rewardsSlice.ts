import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Reward {
  id: string;
  type: 'xp' | 'coins' | 'item' | 'badge';
  amount: number;
  itemId?: string;
  source: 'mission' | 'achievement' | 'referral' | 'purchase';
  earnedAt: string;
  claimed: boolean;
}

export interface UserStats {
  totalXP: number;
  level: number;
  coins: number;
  badges: string[];
  streak: number;
  rank: number;
}

export interface RewardsState {
  userStats: UserStats;
  pendingRewards: Reward[];
  rewardHistory: Reward[];
  leaderboard: Array<{
    userId: string;
    username: string;
    xp: number;
    rank: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: RewardsState = {
  userStats: {
    totalXP: 0,
    level: 1,
    coins: 0,
    badges: [],
    streak: 0,
    rank: 0,
  },
  pendingRewards: [],
  rewardHistory: [],
  leaderboard: [],
  isLoading: false,
  error: null,
};

export const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    updateUserStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.userStats = { ...state.userStats, ...action.payload };
    },
    addReward: (state, action: PayloadAction<Reward>) => {
      state.pendingRewards.push(action.payload);
    },
    claimReward: (state, action: PayloadAction<string>) => {
      const rewardIndex = state.pendingRewards.findIndex(r => r.id === action.payload);
      if (rewardIndex !== -1) {
        const reward = state.pendingRewards[rewardIndex];
        reward.claimed = true;
        
        // Update user stats based on reward type
        if (reward.type === 'xp') {
          state.userStats.totalXP += reward.amount;
          // Calculate new level (every 1000 XP = 1 level)
          state.userStats.level = Math.floor(state.userStats.totalXP / 1000) + 1;
        } else if (reward.type === 'coins') {
          state.userStats.coins += reward.amount;
        }
        
        // Move to history
        state.rewardHistory.unshift(reward);
        state.pendingRewards.splice(rewardIndex, 1);
      }
    },
    setLeaderboard: (state, action: PayloadAction<RewardsState['leaderboard']>) => {
      state.leaderboard = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});
