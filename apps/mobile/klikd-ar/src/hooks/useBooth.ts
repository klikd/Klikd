import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useARSession } from './useARSession';

export interface ARBooth {
  id: string;
  brandId: string;
  name: string;
  position: [number, number, number];
  type: 'product_showcase' | 'interactive_game' | 'photo_booth' | 'virtual_try_on';
  assets: {
    model: string;
    textures: string[];
    animations: string[];
    logo: string;
  };
  interactions: {
    type: 'tap' | 'gesture' | 'voice' | 'proximity';
    triggers: Array<{
      action: string;
      reward?: {
        type: 'xp' | 'coins' | 'coupon' | 'nft';
        amount: number;
        metadata?: any;
      };
    }>;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    theme: 'modern' | 'playful' | 'elegant' | 'tech';
  };
  campaign?: {
    id: string;
    startDate: string;
    endDate: string;
    budget: number;
    targeting: any;
  };
  status: 'active' | 'inactive' | 'maintenance';
  analytics: {
    views: number;
    interactions: number;
    conversions: number;
    revenue: number;
  };
}

export const useBooth = () => {
  const dispatch = useDispatch();
  const { userPosition, addAnchor, getNearbyAnchors } = useARSession();
  
  const [booths, setBooths] = useState<ARBooth[]>([]);
  const [activeBooth, setActiveBooth] = useState<ARBooth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interactionHistory, setInteractionHistory] = useState<Array<{
    boothId: string;
    action: string;
    timestamp: number;
    reward?: any;
  }>>([]);

  // Fetch booths from API
  const fetchBooths = useCallback(async (location?: [number, number, number], radius: number = 5000) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual API
      const mockBooths: ARBooth[] = [
        {
          id: 'booth_nike_001',
          brandId: 'nike',
          name: 'Nike AR Experience',
          position: [userPosition[0] + 0.001, userPosition[1], userPosition[2] + 2],
          type: 'virtual_try_on',
          assets: {
            model: 'https://cdn.klikd.com/models/nike_booth.glb',
            textures: ['nike_texture_1.jpg', 'nike_texture_2.jpg'],
            animations: ['idle', 'showcase', 'try_on'],
            logo: 'https://cdn.klikd.com/logos/nike.png',
          },
          interactions: {
            type: 'tap',
            triggers: [
              {
                action: 'try_on',
                reward: { type: 'xp', amount: 50, metadata: { category: 'fashion' } },
              },
              {
                action: 'share',
                reward: { type: 'coins', amount: 100 },
              },
            ],
          },
          branding: {
            primaryColor: '#FF6B35',
            secondaryColor: '#000000',
            font: 'Nike-Font',
            theme: 'modern',
          },
          campaign: {
            id: 'nike_summer_2024',
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            budget: 50000,
            targeting: { age: [18, 35], interests: ['sports', 'fashion'] },
          },
          status: 'active',
          analytics: {
            views: 1250,
            interactions: 340,
            conversions: 45,
            revenue: 12500,
          },
        },
        {
          id: 'booth_adidas_002',
          brandId: 'adidas',
          name: 'Adidas Gaming Zone',
          position: [userPosition[0] - 0.001, userPosition[1], userPosition[2] + 3],
          type: 'interactive_game',
          assets: {
            model: 'https://cdn.klikd.com/models/adidas_booth.glb',
            textures: ['adidas_texture_1.jpg'],
            animations: ['idle', 'game_active'],
            logo: 'https://cdn.klikd.com/logos/adidas.png',
          },
          interactions: {
            type: 'gesture',
            triggers: [
              {
                action: 'start_game',
                reward: { type: 'xp', amount: 75 },
              },
              {
                action: 'complete_game',
                reward: { type: 'coupon', amount: 1, metadata: { discount: 20, product: 'shoes' } },
              },
            ],
          },
          branding: {
            primaryColor: '#000000',
            secondaryColor: '#FFFFFF',
            font: 'Adidas-Font',
            theme: 'tech',
          },
          status: 'active',
          analytics: {
            views: 890,
            interactions: 230,
            conversions: 28,
            revenue: 8400,
          },
        },
      ];

      setBooths(mockBooths);
      
      // Add booths as AR anchors
      mockBooths.forEach(booth => {
        addAnchor({
          position: booth.position,
          rotation: [0, 0, 0, 1],
          type: 'booth',
          metadata: { boothId: booth.id },
        });
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booths');
    } finally {
      setLoading(false);
    }
  }, [userPosition, addAnchor]);

  // Get nearby booths within radius
  const getNearbyBooths = useCallback((position: [number, number, number], radius: number) => {
    return booths.filter(booth => {
      const distance = Math.sqrt(
        Math.pow(booth.position[0] - position[0], 2) +
        Math.pow(booth.position[1] - position[1], 2) +
        Math.pow(booth.position[2] - position[2], 2)
      );
      return distance <= radius && booth.status === 'active';
    });
  }, [booths]);

  // Record booth interaction
  const recordInteraction = useCallback(async (boothId: string, action: string, reward?: any) => {
    const interaction = {
      boothId,
      action,
      timestamp: Date.now(),
      reward,
    };
    
    setInteractionHistory(prev => [...prev, interaction]);
    
    // Send analytics to backend
    try {
      // Mock API call
      console.log('Recording booth interaction:', interaction);
      
      // Update booth analytics locally
      setBooths(prev => prev.map(booth => 
        booth.id === boothId 
          ? {
              ...booth,
              analytics: {
                ...booth.analytics,
                interactions: booth.analytics.interactions + 1,
              },
            }
          : booth
      ));
      
    } catch (error) {
      console.error('Failed to record interaction:', error);
    }
  }, []);

  // Get booth by ID
  const getBoothById = useCallback((boothId: string) => {
    return booths.find(booth => booth.id === boothId);
  }, [booths]);

  // Get booths by brand
  const getBoothsByBrand = useCallback((brandId: string) => {
    return booths.filter(booth => booth.brandId === brandId);
  }, [booths]);

  // Get booths by type
  const getBoothsByType = useCallback((type: ARBooth['type']) => {
    return booths.filter(booth => booth.type === type);
  }, [booths]);

  // Check if user can interact with booth
  const canInteractWithBooth = useCallback((booth: ARBooth, userPos: [number, number, number]) => {
    const distance = Math.sqrt(
      Math.pow(booth.position[0] - userPos[0], 2) +
      Math.pow(booth.position[1] - userPos[1], 2) +
      Math.pow(booth.position[2] - userPos[2], 2)
    );
    
    const maxInteractionDistance = 3; // 3 meters
    return distance <= maxInteractionDistance && booth.status === 'active';
  }, []);

  // Get available actions for booth
  const getAvailableActions = useCallback((booth: ARBooth) => {
    return booth.interactions.triggers.map(trigger => ({
      action: trigger.action,
      reward: trigger.reward,
      canExecute: canInteractWithBooth(booth, userPosition),
    }));
  }, [canInteractWithBooth, userPosition]);

  // Execute booth action
  const executeBoothAction = useCallback(async (boothId: string, action: string) => {
    const booth = getBoothById(boothId);
    if (!booth) {
      throw new Error('Booth not found');
    }

    if (!canInteractWithBooth(booth, userPosition)) {
      throw new Error('Too far from booth to interact');
    }

    const trigger = booth.interactions.triggers.find(t => t.action === action);
    if (!trigger) {
      throw new Error('Action not available for this booth');
    }

    // Record the interaction
    await recordInteraction(boothId, action, trigger.reward);
    
    return trigger.reward;
  }, [getBoothById, canInteractWithBooth, userPosition, recordInteraction]);

  // Initialize booths when component mounts
  useEffect(() => {
    if (userPosition[0] !== 0 || userPosition[1] !== 0) {
      fetchBooths(userPosition);
    }
  }, [userPosition, fetchBooths]);

  return {
    // State
    booths,
    activeBooth,
    loading,
    error,
    interactionHistory,

    // Actions
    setActiveBooth,
    fetchBooths,
    recordInteraction,
    executeBoothAction,

    // Queries
    getNearbyBooths,
    getBoothById,
    getBoothsByBrand,
    getBoothsByType,
    getAvailableActions,
    canInteractWithBooth,
  };
};
