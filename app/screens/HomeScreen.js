// screens/HomeScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import NavBar from "../../components/NavBar";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Button
          title="Go to Calendar"
          onPress={() => navigation.navigate("Calendar")}
        />
        <Button
          title="Go to Flashcards"
          onPress={() => navigation.navigate("Flashcards")}
        />
        <Button
          title="Go to Account"
          onPress={() => navigation.navigate("Account")}
        />
      </View>
      <View>
        <Text>Home Screen Content Here</Text>
        <NavBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});
