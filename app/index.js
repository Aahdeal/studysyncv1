// index.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AppNavigator from "./Navigation";
import { View, Text } from "react-native";
import useUpcomingNotifications from "./upcomingNotifications";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false after checking auth status
    });

    return unsubscribe; // Cleanup the subscription on unmount
  }, []);

  // Use the custom hook to schedule notifications
  useUpcomingNotifications(user);

  if (loading) {
    // Display a loading indicator while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <AppNavigator user={user} />
    </NavigationContainer>
  );
}
