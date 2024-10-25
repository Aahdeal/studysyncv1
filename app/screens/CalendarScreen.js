// screens/CalendarScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import NavBar from "../../components/NavBar";

export default function CalendarScreen({ navigation, user }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const token = await signInWithGoogle();
      if (token) {
        const fetchedEvents = await getCalendarEvents(token);
        setEvents(fetchedEvents);
      }
    }
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.summary}</Text>
            <Text>{item.start.dateTime}</Text>
          </View>
        )}
      />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});
