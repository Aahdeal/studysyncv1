// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import NavBar from "../../components/NavBar";
import { ScrollView } from "react-native-gesture-handler";
import { ref, get } from "firebase/database";
import { database } from '../firebase'; // Make sure this points to your Firebase config

const getRandomMotivationalMessage = async () => {
  try {
    // Generate a random number between 0 and 1662 (inclusive)
    const randomIndex = Math.floor(Math.random() * 39);

    // Fetch the message from the database
    const snapshot = await get(ref(database, `motivationalMessage/${randomIndex}`));
    const messageData = snapshot.val();

    // Return the message data
    return messageData;
  } catch (error) {
    console.error('Error fetching motivational message:', error);
    return null;
  }
};

export default function HomeScreen({ navigation, user }) {
  const [motivationalMessage, setMotivationalMessage] = useState({ message: '', author: '' });

  useEffect(() => {
    const fetchMessage = async () => {
      const messageData = await getRandomMotivationalMessage();
      if (messageData) {
        setMotivationalMessage(messageData);
      }
    };

    fetchMessage();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.heading}>Progress Tracker</Text>

      {/* Motivational message section */}
      <View id="motivationalMessage">
        <Text style={styles.motivation}>
          {motivationalMessage.Quote
            ? `${motivationalMessage.Quote} - ${motivationalMessage.Author}`
            : 'Loading...'}
        </Text>
      </View>

      <View id="progressView">
        <Text>Hello {user.uid}</Text>
      </View>

      <NavBar/>
    </SafeAreaView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  motivation: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center'
  },
});