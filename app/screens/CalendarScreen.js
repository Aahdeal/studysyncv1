// screens/CalendarScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import NavBar from "../../components/NavBar";

export default function CalendarScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <View>
        <NavBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});
