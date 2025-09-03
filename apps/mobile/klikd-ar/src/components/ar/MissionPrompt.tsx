import React from 'react';
import { ViroNode, ViroText, ViroBox, ViroMaterials } from 'viro';

interface MissionPromptProps {
  ncp: any;
  missions: Array<{
    id: string;
    title: string;
    description: string;
    rewards: any[];
  }>;
  position: [number, number, number];
  onMissionSelect: (missionId: string) => void;
}

ViroMaterials.createMaterials({
  missionBackground: {
    lightingModel: 'Constant',
    diffuseColor: '#1C1C1E',
    opacity: 0.95,
  },
  missionButton: {
    lightingModel: 'Constant',
    diffuseColor: '#007AFF',
    bloomThreshold: 0.3,
  },
});

export const MissionPrompt: React.FC<MissionPromptProps> = ({ ncp, missions, position, onMissionSelect }) => {
  if (!missions.length) return null;

  const mission = missions[0]; // Show first available mission

  return (
    <ViroNode position={position}>
      {/* Background panel */}
      <ViroBox
        position={[0, 0, 0]}
        scale={[3, 2, 0.1]}
        materials={['missionBackground']}
      />
      
      {/* Mission title */}
      <ViroText
        text={`Mission: ${mission.title}`}
        position={[0, 0.6, 0.06]}
        scale={[0.35, 0.35, 0.35]}
        style={{
          fontSize: 18,
          color: '#FFD700',
          textAlign: 'center',
        }}
      />
      
      {/* Mission description */}
      <ViroText
        text={mission.description}
        position={[0, 0.2, 0.06]}
        scale={[0.25, 0.25, 0.25]}
        style={{
          fontSize: 14,
          color: '#ffffff',
          textAlign: 'center',
        }}
      />
      
      {/* Rewards */}
      <ViroText
        text={`Rewards: ${mission.rewards.map(r => `${r.amount} ${r.type}`).join(', ')}`}
        position={[0, -0.1, 0.06]}
        scale={[0.2, 0.2, 0.2]}
        style={{
          fontSize: 12,
          color: '#00FF88',
          textAlign: 'center',
        }}
      />
      
      {/* Accept button */}
      <ViroBox
        position={[0, -0.5, 0.02]}
        scale={[1, 0.3, 0.05]}
        materials={['missionButton']}
        onClick={() => onMissionSelect(mission.id)}
      />
      
      <ViroText
        text="Accept Mission"
        position={[0, -0.5, 0.08]}
        scale={[0.3, 0.3, 0.3]}
        style={{
          fontSize: 14,
          color: '#ffffff',
          textAlign: 'center',
        }}
      />
    </ViroNode>
  );
};
