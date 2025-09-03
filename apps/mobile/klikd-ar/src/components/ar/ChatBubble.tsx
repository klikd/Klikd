import React from 'react';
import { ViroNode, ViroText, ViroBox, ViroMaterials } from 'viro';

interface ChatBubbleProps {
  ncp: any;
  messages: Array<{
    id: string;
    senderId: string;
    content: string;
    type: string;
  }>;
  position: [number, number, number];
  isTyping: boolean;
}

ViroMaterials.createMaterials({
  chatBackground: {
    lightingModel: 'Constant',
    diffuseColor: '#2C2C2E',
    opacity: 0.9,
  },
});

export const ChatBubble: React.FC<ChatBubbleProps> = ({ ncp, messages, position, isTyping }) => {
  const lastMessage = messages[messages.length - 1];
  
  if (!lastMessage && !isTyping) return null;

  return (
    <ViroNode position={position}>
      {/* Chat bubble background */}
      <ViroBox
        position={[0, 0, 0]}
        scale={[2.5, 1, 0.1]}
        materials={['chatBackground']}
      />
      
      {/* Message content */}
      {lastMessage && (
        <ViroText
          text={lastMessage.content}
          position={[0, 0.1, 0.06]}
          scale={[0.3, 0.3, 0.3]}
          style={{
            fontSize: 16,
            color: '#ffffff',
            textAlign: 'center',
          }}
        />
      )}
      
      {/* Typing indicator */}
      {isTyping && (
        <ViroText
          text="..."
          position={[0, -0.2, 0.06]}
          scale={[0.4, 0.4, 0.4]}
          style={{
            fontSize: 20,
            color: '#00FF88',
            textAlign: 'center',
          }}
        />
      )}
      
      {/* NCP name */}
      <ViroText
        text={ncp.name}
        position={[0, -0.35, 0.06]}
        scale={[0.25, 0.25, 0.25]}
        style={{
          fontSize: 12,
          color: '#cccccc',
          textAlign: 'center',
        }}
      />
    </ViroNode>
  );
};
