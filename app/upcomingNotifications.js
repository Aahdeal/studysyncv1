import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { database } from "./firebase"; // Adjust the path to your firebase config
import { ref, onValue, set } from "firebase/database";

const useUpcomingNotifications = (user) => {
  console.log("in upcoming");

  useEffect(() => {
    if (!user) return; // Ensure user exists before proceeding

    // Request notification permissions and retrieve Expo push token
    const registerForPushNotificationsAsync = async () => {
      console.log("in register for push");
      const { status } = await Notifications.getPermissionsAsync(); //await Permissions.askAsync(Permissions.NOTIFICATIONS);
      console.log("perm status: ", status);
      if (status === "granted") {
        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: "your-project-id",
          })
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

    // Function to check for upcoming events and schedule local notifications
    const scheduleEventNotifications = () => {
      console.log("in schedule");
      const userId = user.uid; // Replace this with actual user ID logic
      const eventsRef = ref(database, `users/${userId}/calendar/events`);

      // Listen for changes to the user's events
      onValue(eventsRef, (snapshot) => {
        if (snapshot.exists()) {
          const events = snapshot.val();
          const currentTime = Date.now();

          // Check each event to see if it's within the 5-10 minute notification window
          Object.keys(events).forEach((eventId) => {
            console.log("I am event: ", event, event.event.startDate);
            const event = events[eventId];
            const eventTime = new Date(event.startDate).getTime();
            const timeDiff = (eventTime - currentTime) / 60000; // in minutes

            if (timeDiff > 5 && timeDiff <= 10) {
              // Schedule local notification
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Upcoming Event",
                  body: `Your event "${event.title}" is starting soon!`,
                },
                trigger: { seconds: timeDiff * 60 },
              });
            }

            if (timeDiff === 10) {
              // Schedule local notification
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Upcoming Event",
                  body: `Your event "${event.title}" is starting in 10mins!`,
                },
                trigger: { seconds: timeDiff * 60 },
              });
            }
          });
        }
      });
    };

    // Periodically check for event notifications
    const intervalId = setInterval(() => {
      console.log("Triggering periodic notification check.");
      scheduleEventNotifications();
    }, 10 * 60 * 1000); // Every 10 minutes

    // Clear interval when the component unmounts
    return () => {
      console.log("Cleaning up notification interval.");
      clearInterval(intervalId);
    };
  }, [user]);
};

export default useUpcomingNotifications;
