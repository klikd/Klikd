import React from 'react';
import { View, Text } from 'react-native';

export default function ChatScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#333', fontSize: 18 }}>Chat Screen</Text>
      <Text style={{ color: '#666', marginTop: 10 }}>Messages will go here</Text>
    </View>
  );
}
