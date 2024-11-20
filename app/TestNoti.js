import React from "react";
import { Button, View, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";

const TestNotification = () => {
  const triggerNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Notification permissions are not granted.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification.",
      },
      trigger: { seconds: 1 }, // Trigger after 1 second
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Test Notification" onPress={triggerNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TestNotification;
