import React from 'react';
import { ViroNode, ViroSphere, ViroText, ViroMaterials } from 'viro';

interface BoothIconProps {
  type: 'try_on' | 'game' | 'photo' | 'showcase';
  booth: any;
  onInteract: () => void;
}

// Register materials for booth icons
ViroMaterials.createMaterials({
  tryOnIcon: {
    lightingModel: 'Constant',
    diffuseColor: '#FF6B35',
    bloomThreshold: 0.3,
  },
  gameIcon: {
    lightingModel: 'Constant',
    diffuseColor: '#00FF88',
    bloomThreshold: 0.3,
  },
  photoIcon: {
    lightingModel: 'Constant',
    diffuseColor: '#007AFF',
    bloomThreshold: 0.3,
  },
  showcaseIcon: {
    lightingModel: 'Constant',
    diffuseColor: '#FFD700',
    bloomThreshold: 0.3,
  },
});

export const BoothIcon: React.FC<BoothIconProps> = ({ type, booth, onInteract }) => {
  const getMaterial = () => {
    switch (type) {
      case 'try_on': return 'tryOnIcon';
      case 'game': return 'gameIcon';
      case 'photo': return 'photoIcon';
      case 'showcase': return 'showcaseIcon';
      default: return 'tryOnIcon';
    }
  };

  const getIconText = () => {
    switch (type) {
      case 'try_on': return '👕';
      case 'game': return '🎮';
      case 'photo': return '📸';
      case 'showcase': return '🛍️';
      default: return '✨';
    }
  };

  return (
    <ViroNode>
      <ViroSphere
        radius={0.15}
        materials={[getMaterial()]}
        onClick={onInteract}
        animation={{
          name: 'boothPulse',
          run: true,
          loop: true,
        }}
      />
      <ViroText
        text={getIconText()}
        position={[0, 0, 0.16]}
        scale={[0.3, 0.3, 0.3]}
        style={{
          fontSize: 40,
          textAlign: 'center',
        }}
      />
    </ViroNode>
  );
};
