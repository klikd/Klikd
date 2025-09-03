import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroMaterials,
  ViroNode,
  ViroAnimations,
  ViroText,
  ViroTrackingState,
  ViroTrackingStateConstants,
  ViroAmbientLight,
  ViroSpotLight,
  Viro3DObject,
  ViroARPlaneSelector,
  ViroARPlane,
} from '@viro-community/react-viro';
import { Ionicons } from '@expo/vector-icons';

interface ARSceneProps {
  onClose: () => void;
  sceneType: 'zone' | 'booth' | 'ncp';
  arData?: any;
}

// AR Scene Component
const ARExperienceScene = ({ sceneType, arData }: { sceneType: string; arData?: any }) => {
  const [text, setText] = useState('Initializing AR...');
  const [trackingNormal, setTrackingNormal] = useState(false);

  const onInitialized = (state: number, reason: number) => {
    console.log('AR Scene initialized', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingNormal(true);
      setText('AR Ready - Tap to place objects');
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setText('Move device to start tracking');
    }
  };

  const onAnchorFound = () => {
    setText('Surface detected - Ready for AR');
  };

  const onPlaneSelected = (anchor: any) => {
    console.log('Plane selected', anchor);
    setText('AR object placed!');
  };

  // Render different AR content based on scene type
  const renderARContent = () => {
    switch (sceneType) {
      case 'zone':
        return (
          <ViroARPlaneSelector onPlaneSelected={onPlaneSelected}>
            <ViroNode position={[0, 0, 0]} dragType="FixedToWorld">
              <ViroBox
                position={[0, 0.1, 0]}
                scale={[0.3, 0.3, 0.3]}
                materials={['zoneMaterial']}
                animation={{ name: 'rotate', run: true, loop: true }}
              />
              <ViroText
                text="AR Zone Active"
                scale={[0.5, 0.5, 0.5]}
                position={[0, 0.5, 0]}
                style={styles.arText}
              />
            </ViroNode>
          </ViroARPlaneSelector>
        );
      
      case 'booth':
        return (
          <ViroARPlaneSelector onPlaneSelected={onPlaneSelected}>
            <ViroNode position={[0, 0, 0]} dragType="FixedToWorld">
              <ViroBox
                position={[0, 0.2, 0]}
                scale={[0.5, 0.5, 0.5]}
                materials={['boothMaterial']}
                animation={{ name: 'bounce', run: true, loop: true }}
              />
              <ViroText
                text="Brand Experience"
                scale={[0.4, 0.4, 0.4]}
                position={[0, 0.7, 0]}
                style={styles.arText}
              />
            </ViroNode>
          </ViroARPlaneSelector>
        );
      
      case 'ncp':
        return (
          <ViroARPlaneSelector onPlaneSelected={onPlaneSelected}>
            <ViroNode position={[0, 0, 0]} dragType="FixedToWorld">
              <ViroBox
                position={[0, 0.3, 0]}
                scale={[0.4, 0.6, 0.4]}
                materials={['ncpMaterial']}
                animation={{ name: 'pulse', run: true, loop: true }}
              />
              <ViroText
                text="AI Companion"
                scale={[0.3, 0.3, 0.3]}
                position={[0, 0.8, 0]}
                style={styles.arText}
              />
            </ViroNode>
          </ViroARPlaneSelector>
        );
      
      default:
        return (
          <ViroBox
            position={[0, 0, -1]}
            scale={[0.3, 0.3, 0.3]}
            materials={['defaultMaterial']}
          />
        );
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized} onAnchorFound={onAnchorFound}>
      <ViroAmbientLight color="#aaaaaa" />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#ffffff"
        castsShadow={true}
      />
      
      {trackingNormal && renderARContent()}
      
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, -1, -2]}
        style={styles.instructionText}
      />
    </ViroARScene>
  );
};

// Main AR Component
export default function ARScene({ onClose, sceneType, arData }: ARSceneProps) {
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <ARExperienceScene sceneType={sceneType} arData={arData} />,
        }}
        style={styles.arView}
      />
      
      {/* AR Controls Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          
          <View style={styles.arInfo}>
            <Text style={styles.arTitle}>
              {sceneType === 'zone' ? 'AR Zone' : 
               sceneType === 'booth' ? 'AR Booth' : 'AI Companion'}
            </Text>
          </View>
        </View>
        
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.actionText}>Capture</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.actionText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={24} color="white" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Initialize AR Materials
ViroMaterials.createMaterials({
  zoneMaterial: {
    lightingModel: 'Lambert',
    diffuseColor: '#ff6b35',
  },
  boothMaterial: {
    lightingModel: 'Lambert',
    diffuseColor: '#007AFF',
  },
  ncpMaterial: {
    lightingModel: 'Lambert',
    diffuseColor: '#34C759',
  },
  defaultMaterial: {
    lightingModel: 'Lambert',
    diffuseColor: '#888888',
  },
});

// Initialize AR Animations
ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: '+=90',
    },
    duration: 2000,
  },
  bounce: {
    properties: {
      positionY: '+=0.1',
    },
    duration: 1000,
    easing: 'bounce',
  },
  pulse: {
    properties: {
      scaleX: 1.2,
      scaleY: 1.2,
      scaleZ: 1.2,
    },
    duration: 1500,
    easing: 'easeInEaseOut',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arInfo: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  arTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  arText: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  instructionText: {
    fontFamily: 'Arial',
    fontSize: 20,
    color: '#cccccc',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
