import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { database } from "./firebase"; // Adjust the path to your firebase config
import { ref, onValue, set } from "firebase/database";

const useUpcomingNotifications = (user, events) => {
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
            projectId: "studysync-c9282",
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

    // Function to check for upcoming events and schedule local notifications
    const scheduleEventNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Notification permissions are not granted.");
        return;
      }
      console.log("in schedule");
      const userId = user.uid; // Replace this with actual user ID logic
      const eventsRef = ref(database, `users/${userId}/calendar/events`);

      // Listen for changes to the user's events
      onValue(eventsRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log("snapshot exists");
          // const events = snapshot.val();
          const events = Object.values(snapshot.val());
          console.log("Snapshot value:", events);
          const currentTime = Date.now();

          // Check each event to see if it's within the 5-10 minute notification window
          console.log("Processing event:", eventId);

          /* Object.keys(events)*/ events.forEach((eventId) => {
            console.log("event in foreach: ", eventId);
            //console.log("I am event: ", eventId, eventId.startDate);
            if (eventId?.startDate && eventId?.title) {
              const eventTime = moment(eventId.startDate).format("HH:mm");
              console.log("Event time:", eventTime);
            } else {
              console.warn("Invalid event data:", eventId);
            }

            //const timeDiff = (eventTime - currentTime) / 60000; // in minutes
            const tenMinutesBefore = eventTime.clone().subtract(10, "minutes");
            const fiveMinutesBefore = eventTime.clone().subtract(5, "minutes");
            const now = moment();

            // Schedule 10-minute reminder if it's still in the future
            if (tenMinutesBefore.isAfter(now)) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Upcoming Event",
                  body: `${eventId.title} starts in 10 minutes.`,
                },
                trigger: tenMinutesBefore.toDate(), // Trigger at 10 minutes before
              });
            }
            if (tenMinutesBefore == now) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Upcoming Event1",
                  body: `${eventId.title} starts in 10 minutes1.`,
                },
                trigger: { seconds: 1 }, // Trigger at 10 minutes before
              });
            }

            if (fiveMinutesBefore.isAfter(now)) {
              console.log("check for noti");
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Event Reminder",
                  body: `${eventId.title} starts in 5 minutes. ${eventId.startDate}`,
                },
                trigger: fiveMinutesBefore.toDate(), // Trigger at 5 minutes before
              });
            }

            // Schedule reminder on start
            if (eventTime == currentTime) {
              console.log("event starts now");

              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Event Reminder",
                  body: `${eventId.event.title} starts now.`,
                },
                trigger: now, // Trigger at 5 minutes before
              });
            }
          });
        }
      });

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    };

    // Call the function to get permissions and register the token
    // registerForPushNotificationsAsync();

    // Periodically check for event notifications
    const intervalId = setInterval(() => {
      console.log("Triggering periodic notification check.");
      scheduleEventNotifications();
    }, 1 * 60 * 1000); // Every 5 minutes

    // Clear interval when the component unmounts
    return () => {
      //console.log("Cleaning up notification interval.");
      clearInterval(intervalId);
    };
  }, [user]);
};

export default useUpcomingNotifications;
