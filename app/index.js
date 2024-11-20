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

  // Request notification permissions and retrieve Expo push token
  const registerForPushNotificationsAsync = async () => {
    console.log("in register for push");
    const { status } = await Notifications.getPermissionsAsync(); //await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log("perm status: ", status);
    if (status === "granted") {
      const token = (
        await Notifications.getExpoPushTokenAsync(/*{
          projectId: "your-project-id",
        }*/)
      ).data;
      console.log("Expo Push Token:", token);

      // Store the token in Firebase under the user's profile if needed
      const userId = user.uid; // Replace this with actual user ID logic
      const tokenRef = ref(database, `users/${userId}/preferances/pushToken`);
      set(tokenRef, token);
    } else {
      alert("Notification permissions required!");
    }
  };

  // Call the function to get permissions and register the token
  registerForPushNotificationsAsync();

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
