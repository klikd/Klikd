import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#333', fontSize: 18 }}>Profile Screen</Text>
      <Text style={{ color: '#666', marginTop: 10 }}>User profile will go here</Text>
    </View>
  );
}
