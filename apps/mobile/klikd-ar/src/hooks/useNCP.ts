import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useARSession } from './useARSession';

export interface NCP {
  id: string;
  name: string;
  type: 'guide' | 'merchant' | 'companion' | 'challenger' | 'storyteller';
  personality: {
    traits: string[];
    mood: 'friendly' | 'mysterious' | 'energetic' | 'calm' | 'playful';
    voice: 'male' | 'female' | 'neutral';
    language: 'ar' | 'en' | 'fr';
  };
  appearance: {
    model: string;
    textures: string[];
    animations: {
      idle: string;
      talking: string;
      gesturing: string;
      celebrating: string;
    };
    scale: [number, number, number];
  };
  position: [number, number, number];
  behavior: {
    greetingRadius: number;
    interactionRadius: number;
    followUser: boolean;
    autoGreet: boolean;
    contextAware: boolean;
  };
  capabilities: {
    chat: boolean;
    missions: boolean;
    rewards: boolean;
    commerce: boolean;
    guidance: boolean;
  };
  missions?: Array<{
    id: string;
    title: string;
    description: string;
    rewards: any[];
  }>;
  dialogue: {
    greetings: string[];
    responses: Record<string, string[]>;
    farewells: string[];
  };
  aiConfig: {
    model: 'gpt-4' | 'claude' | 'local';
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
  };
  status: 'active' | 'inactive' | 'busy';
  lastInteraction?: number;
}

export const useNCP = () => {
  const dispatch = useDispatch();
  const { userPosition, addAnchor, getNearbyAnchors } = useARSession();
  
  const [ncps, setNCPs] = useState<NCP[]>([]);
  const [activeNCP, setActiveNCP] = useState<NCP | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Record<string, Array<{
    id: string;
    senderId: string;
    content: string;
    timestamp: number;
    type: 'user' | 'ncp';
  }>>>({});

  // Fetch NCPs from API
  const fetchNCPs = useCallback(async (location?: [number, number, number], radius: number = 1000) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual API
      const mockNCPs: NCP[] = [
        {
          id: 'ncp_guide_001',
          name: 'Zara',
          type: 'guide',
          personality: {
            traits: ['helpful', 'knowledgeable', 'patient'],
            mood: 'friendly',
            voice: 'female',
            language: 'en',
          },
          appearance: {
            model: 'https://cdn.klikd.com/models/guide_zara.glb',
            textures: ['guide_texture_1.jpg'],
            animations: {
              idle: 'guide_idle',
              talking: 'guide_talking',
              gesturing: 'guide_gesturing',
              celebrating: 'guide_celebrating',
            },
            scale: [1, 1, 1],
          },
          position: [userPosition[0] + 0.0005, userPosition[1], userPosition[2] + 1],
          behavior: {
            greetingRadius: 5,
            interactionRadius: 3,
            followUser: false,
            autoGreet: true,
            contextAware: true,
          },
          capabilities: {
            chat: true,
            missions: true,
            rewards: false,
            commerce: false,
            guidance: true,
          },
          missions: [
            {
              id: 'mission_tutorial_001',
              title: 'AR Basics Tutorial',
              description: 'Learn the fundamentals of AR interaction',
              rewards: [{ type: 'xp', amount: 100 }],
            },
          ],
          dialogue: {
            greetings: [
              'Welcome to Klikd! I\'m Zara, your AR guide.',
              'Hello there! Ready to explore the AR world?',
              'Hi! I\'m here to help you navigate this space.',
            ],
            responses: {
              'hello': ['Hello! How can I assist you today?', 'Hi there! What would you like to explore?'],
              'help': ['I\'m here to help! What do you need assistance with?', 'Of course! What can I explain for you?'],
              'missions': ['I have some exciting missions for you! Would you like to see them?'],
            },
            farewells: [
              'See you later! Happy exploring!',
              'Goodbye! Come back anytime you need help.',
              'Until next time! Enjoy your AR adventure.',
            ],
          },
          aiConfig: {
            model: 'gpt-4',
            systemPrompt: 'You are Zara, a helpful AR guide in the Klikd platform. You assist users with navigation, tutorials, and discovering new experiences. Be friendly, knowledgeable, and encouraging.',
            temperature: 0.7,
            maxTokens: 150,
          },
          status: 'active',
        },
        {
          id: 'ncp_merchant_002',
          name: 'Omar',
          type: 'merchant',
          personality: {
            traits: ['charismatic', 'business-minded', 'persuasive'],
            mood: 'energetic',
            voice: 'male',
            language: 'ar',
          },
          appearance: {
            model: 'https://cdn.klikd.com/models/merchant_omar.glb',
            textures: ['merchant_texture_1.jpg'],
            animations: {
              idle: 'merchant_idle',
              talking: 'merchant_talking',
              gesturing: 'merchant_gesturing',
              celebrating: 'merchant_celebrating',
            },
            scale: [1, 1, 1],
          },
          position: [userPosition[0] - 0.0005, userPosition[1], userPosition[2] + 2],
          behavior: {
            greetingRadius: 4,
            interactionRadius: 2,
            followUser: false,
            autoGreet: true,
            contextAware: true,
          },
          capabilities: {
            chat: true,
            missions: false,
            rewards: true,
            commerce: true,
            guidance: false,
          },
          dialogue: {
            greetings: [
              'أهلاً وسهلاً! I have amazing deals for you!',
              'Welcome, my friend! Come see what I have today.',
              'Greetings! The best products are right here!',
            ],
            responses: {
              'products': ['I have the finest selection! What are you looking for?'],
              'deals': ['Today only - special prices for AR explorers!'],
              'buy': ['Excellent choice! Let me show you the details.'],
            },
            farewells: [
              'Thank you for visiting! Come back soon!',
              'May your journey be profitable, my friend!',
              'Until we meet again! Safe travels!',
            ],
          },
          aiConfig: {
            model: 'gpt-4',
            systemPrompt: 'You are Omar, a charismatic AR merchant in the Klikd platform. You sell virtual and physical products, offer deals, and help users with commerce. Be enthusiastic, trustworthy, and business-minded. Mix English with occasional Arabic phrases.',
            temperature: 0.8,
            maxTokens: 120,
          },
          status: 'active',
        },
      ];

      setNCPs(mockNCPs);
      
      // Add NCPs as AR anchors
      mockNCPs.forEach(ncp => {
        addAnchor({
          position: ncp.position,
          rotation: [0, 0, 0, 1],
          type: 'ncp',
          metadata: { ncpId: ncp.id },
        });
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NCPs');
    } finally {
      setLoading(false);
    }
  }, [userPosition, addAnchor]);

  // Get nearby NCPs within radius
  const getNearbyNCPs = useCallback((position: [number, number, number], radius: number) => {
    return ncps.filter(ncp => {
      const distance = Math.sqrt(
        Math.pow(ncp.position[0] - position[0], 2) +
        Math.pow(ncp.position[1] - position[1], 2) +
        Math.pow(ncp.position[2] - position[2], 2)
      );
      return distance <= radius && ncp.status === 'active';
    });
  }, [ncps]);

  // Send message to NCP
  const sendMessageToNCP = useCallback(async (ncpId: string, message: string) => {
    const ncp = ncps.find(n => n.id === ncpId);
    if (!ncp) {
      throw new Error('NCP not found');
    }

    // Add user message to conversation history
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      senderId: 'user',
      content: message,
      timestamp: Date.now(),
      type: 'user' as const,
    };

    setConversationHistory(prev => ({
      ...prev,
      [ncpId]: [...(prev[ncpId] || []), userMessage],
    }));

    try {
      // Generate NCP response (mock AI integration)
      let response = '';
      
      // Check for predefined responses first
      const lowerMessage = message.toLowerCase();
      const predefinedResponse = ncp.dialogue.responses[lowerMessage];
      
      if (predefinedResponse) {
        response = predefinedResponse[Math.floor(Math.random() * predefinedResponse.length)];
      } else {
        // Simulate AI response based on NCP personality
        const responses = [
          `That's interesting! As a ${ncp.type}, I think...`,
          `Let me help you with that. In my experience...`,
          `I understand your question. Here's what I suggest...`,
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }

      // Add NCP response to conversation history
      const ncpMessage = {
        id: `msg_${Date.now()}_ncp`,
        senderId: ncpId,
        content: response,
        timestamp: Date.now(),
        type: 'ncp' as const,
      };

      setConversationHistory(prev => ({
        ...prev,
        [ncpId]: [...(prev[ncpId] || []), ncpMessage],
      }));

      // Update NCP last interaction time
      setNCPs(prev => prev.map(n => 
        n.id === ncpId 
          ? { ...n, lastInteraction: Date.now() }
          : n
      ));

      return response;
    } catch (error) {
      console.error('Failed to send message to NCP:', error);
      throw error;
    }
  }, [ncps]);

  // Get NCP by ID
  const getNCPById = useCallback((ncpId: string) => {
    return ncps.find(ncp => ncp.id === ncpId);
  }, [ncps]);

  // Get NCPs by type
  const getNCPsByType = useCallback((type: NCP['type']) => {
    return ncps.filter(ncp => ncp.type === type);
  }, [ncps]);

  // Check if user can interact with NCP
  const canInteractWithNCP = useCallback((ncp: NCP, userPos: [number, number, number]) => {
    const distance = Math.sqrt(
      Math.pow(ncp.position[0] - userPos[0], 2) +
      Math.pow(ncp.position[1] - userPos[1], 2) +
      Math.pow(ncp.position[2] - userPos[2], 2)
    );
    
    return distance <= ncp.behavior.interactionRadius && ncp.status === 'active';
  }, []);

  // Get conversation history for NCP
  const getConversationHistory = useCallback((ncpId: string) => {
    return conversationHistory[ncpId] || [];
  }, [conversationHistory]);

  // Start mission with NCP
  const startMissionWithNCP = useCallback(async (ncpId: string, missionId: string) => {
    const ncp = getNCPById(ncpId);
    if (!ncp || !ncp.capabilities.missions) {
      throw new Error('NCP cannot provide missions');
    }

    const mission = ncp.missions?.find(m => m.id === missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }

    // Mock mission start logic
    console.log(`Starting mission ${missionId} with NCP ${ncpId}`);
    
    return mission;
  }, [getNCPById]);

  // Initialize NCPs when component mounts
  useEffect(() => {
    if (userPosition[0] !== 0 || userPosition[1] !== 0) {
      fetchNCPs(userPosition);
    }
  }, [userPosition, fetchNCPs]);

  return {
    // State
    ncps,
    activeNCP,
    loading,
    error,
    conversationHistory,

    // Actions
    setActiveNCP,
    fetchNCPs,
    sendMessageToNCP,
    startMissionWithNCP,

    // Queries
    getNearbyNCPs,
    getNCPById,
    getNCPsByType,
    canInteractWithNCP,
    getConversationHistory,
  };
};
