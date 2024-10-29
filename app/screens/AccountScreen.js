// screens/AccountScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import NavBar from "../../components/NavBar";
import { ScrollView } from "react-native-gesture-handler";
import { auth } from "../firebase"; // Import auth from firebase
import { signOut } from "firebase/auth"; // Import signOut function

export default function AccountScreen({ navigation, user }) {
  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigation.navigate("Login"); // Navigate to the Login screen
    } catch (error) {
      console.error("Logout error:", error);
      // You might want to show an alert here to inform the user of the error
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Account</Text>
        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});

