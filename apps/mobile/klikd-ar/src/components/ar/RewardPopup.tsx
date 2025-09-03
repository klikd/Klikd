import React from 'react';
import { ViroNode, ViroText, ViroBox, ViroMaterials, ViroAnimations } from 'viro';

interface RewardPopupProps {
  visible: boolean;
  position: [number, number, number];
  reward?: {
    type: string;
    amount: number;
  };
}

ViroMaterials.createMaterials({
  rewardBackground: {
    lightingModel: 'Constant',
    diffuseColor: '#00FF88',
    bloomThreshold: 0.5,
  },
});

ViroAnimations.registerAnimations({
  rewardAppear: {
    properties: {
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      opacity: 1,
    },
    duration: 500,
    easing: 'Bounce',
  },
});

export const RewardPopup: React.FC<RewardPopupProps> = ({ visible, position, reward }) => {
  if (!visible) return null;

  return (
    <ViroNode position={position}>
      <ViroBox
        position={[0, 0, 0]}
        scale={[1.5, 0.8, 0.1]}
        materials={['rewardBackground']}
        animation={{
          name: 'rewardAppear',
          run: true,
        }}
      />
      
      <ViroText
        text="🎉 Reward Earned! 🎉"
        position={[0, 0.1, 0.06]}
        scale={[0.4, 0.4, 0.4]}
        style={{
          fontSize: 20,
          color: '#ffffff',
          textAlign: 'center',
        }}
      />
      
      {reward && (
        <ViroText
          text={`+${reward.amount} ${reward.type.toUpperCase()}`}
          position={[0, -0.1, 0.06]}
          scale={[0.3, 0.3, 0.3]}
          style={{
            fontSize: 16,
            color: '#ffffff',
            textAlign: 'center',
          }}
        />
      )}
    </ViroNode>
  );
};
