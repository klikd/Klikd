import React from 'react';
import { ViroNode, ViroText, ViroBox, ViroMaterials } from 'viro';

interface BrandOverlayProps {
  booth: any;
  position: [number, number, number];
  visible: boolean;
}

ViroMaterials.createMaterials({
  overlayBackground: {
    lightingModel: 'Constant',
    diffuseColor: '#000000',
    opacity: 0.8,
  },
});

export const BrandOverlay: React.FC<BrandOverlayProps> = ({ booth, position, visible }) => {
  if (!visible) return null;

  return (
    <ViroNode position={position}>
      {/* Background panel */}
      <ViroBox
        position={[0, 0, 0]}
        scale={[2, 1, 0.1]}
        materials={['overlayBackground']}
      />
      
      {/* Brand name */}
      <ViroText
        text={booth.name}
        position={[0, 0.2, 0.06]}
        scale={[0.4, 0.4, 0.4]}
        style={{
          fontFamily: booth.branding.font,
          fontSize: 24,
          color: booth.branding.primaryColor,
          textAlign: 'center',
        }}
      />
      
      {/* Campaign info */}
      {booth.campaign && (
        <ViroText
          text={`Campaign: ${booth.campaign.id}`}
          position={[0, -0.1, 0.06]}
          scale={[0.3, 0.3, 0.3]}
          style={{
            fontSize: 16,
            color: '#ffffff',
            textAlign: 'center',
          }}
        />
      )}
      
      {/* Interaction hint */}
      <ViroText
        text="Tap to interact"
        position={[0, -0.3, 0.06]}
        scale={[0.25, 0.25, 0.25]}
        style={{
          fontSize: 14,
          color: '#cccccc',
          textAlign: 'center',
        }}
      />
    </ViroNode>
  );
};
