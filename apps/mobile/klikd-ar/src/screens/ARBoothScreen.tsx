import React from 'react';
import { View, Text } from 'react-native';

export default function ARBoothScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>AR Booth Screen</Text>
      <Text style={{ color: '#ccc', marginTop: 10 }}>Brand AR experiences will go here</Text>
    </View>
  );
}
