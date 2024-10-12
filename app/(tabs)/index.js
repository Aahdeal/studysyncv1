import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const handlePress = () => {
    alert("Welcome to the App!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My Landing Page!</Text>
      <Text style={styles.subtitle}>This is a simple landing page built with React Native.</Text>
      <Button title="Get Started" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
});
