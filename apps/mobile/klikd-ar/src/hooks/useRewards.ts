import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addReward, updateStats, setLoading, setError } from '../store/slices/rewardsSlice';

export interface Reward {
  id: string;
  type: 'xp' | 'coins' | 'coupon' | 'nft' | 'badge' | 'achievement';
  amount: number;
  source: 'mission' | 'booth_interaction' | 'ncp_chat' | 'daily_login' | 'referral' | 'purchase';
  earnedAt: string;
  claimed: boolean;
  metadata?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    expiresAt?: string;
    conditions?: any;
  };
}

export const useRewards = () => {
  const dispatch = useDispatch();
  const rewardsState = useSelector((state: RootState) => state.rewards);

  const claimReward = useCallback(async (reward: Reward) => {
    dispatch(setLoading(true));
    
    try {
      // Mock API call to claim reward
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(addReward(reward));
      
      // Update user stats based on reward type
      switch (reward.type) {
        case 'xp':
          dispatch(updateStats({ 
            totalXP: rewardsState.stats.totalXP + reward.amount 
          }));
          break;
        case 'coins':
          dispatch(updateStats({ 
            totalCoins: rewardsState.stats.totalCoins + reward.amount 
          }));
          break;
      }
      
      return reward;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to claim reward'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, rewardsState.stats]);

  return {
    ...rewardsState,
    claimReward,
  };
};
