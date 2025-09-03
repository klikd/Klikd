import React from 'react';
import { ViroNode, ViroSphere, ViroText, ViroMaterials } from 'viro';

interface NCPAvatarProps {
  ncp: any;
  isActive: boolean;
  isNearby: boolean;
  onInteract: (type: string) => void;
}

ViroMaterials.createMaterials({
  ncpActive: {
    lightingModel: 'Constant',
    diffuseColor: '#00FF88',
    bloomThreshold: 0.4,
  },
  ncpNearby: {
    lightingModel: 'Constant',
    diffuseColor: '#FFD700',
    bloomThreshold: 0.3,
  },
  ncpDefault: {
    lightingModel: 'Constant',
    diffuseColor: '#007AFF',
    bloomThreshold: 0.2,
  },
});

export const NCPAvatar: React.FC<NCPAvatarProps> = ({ ncp, isActive, isNearby, onInteract }) => {
  const getMaterial = () => {
    if (isActive) return 'ncpActive';
    if (isNearby) return 'ncpNearby';
    return 'ncpDefault';
  };

  const getStatusIndicator = () => {
    switch (ncp.personality.mood) {
      case 'friendly': return '😊';
      case 'mysterious': return '🤔';
      case 'energetic': return '⚡';
      case 'calm': return '😌';
      case 'playful': return '😄';
      default: return '🤖';
    }
  };

  return (
    <ViroNode position={[0, 2.2, 0]}>
      {/* Status indicator sphere */}
      <ViroSphere
        radius={0.2}
        materials={[getMaterial()]}
        onClick={() => onInteract('chat')}
        animation={{
          name: isActive ? 'boothPulse' : undefined,
          run: isActive,
          loop: true,
        }}
      />
      
      {/* Mood indicator */}
      <ViroText
        text={getStatusIndicator()}
        position={[0, 0, 0.21]}
        scale={[0.4, 0.4, 0.4]}
        style={{
          fontSize: 30,
          textAlign: 'center',
        }}
      />
      
      {/* Type indicator */}
      <ViroText
        text={ncp.type.toUpperCase()}
        position={[0, -0.4, 0]}
        scale={[0.2, 0.2, 0.2]}
        style={{
          fontSize: 12,
          color: isActive ? '#00FF88' : '#ffffff',
          textAlign: 'center',
        }}
      />
    </ViroNode>
  );
};
