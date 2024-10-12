import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button,ActivityIndicator } from 'react-native';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the "landingMessage" in your Realtime Database
    const dataRef = ref(database, 'landingMessage');

    // Listen for changes in the data
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      setData(value);
      setLoading(false);
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to StudySync</Text>
      <Text style={styles.subtitle}>
        {data ? data.message : "No message available"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 40,
  },
});