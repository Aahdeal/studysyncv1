import * as Notifications from "expo-notifications";
import moment from "moment";
import React, { useEffect } from "react";
import * as Permissions from "expo-permissions";
import { database } from "./firebase"; // Adjust the path to your firebase config
import { ref, onValue } from "firebase/database";

const scheduleNotificationsForEvents = (events) => {
  events.forEach((event) => {
    console.log("I am event: ", event, event.event.startDate);
    const eventTime = moment(event.event.startDate); // Assuming startDate is a moment-compatible date

    // Calculate reminder times
    const tenMinutesBefore = eventTime.clone().subtract(10, "minutes");
    const fiveMinutesBefore = eventTime.clone().subtract(5, "minutes");
    const now = moment();

    // Schedule 10-minute reminder if it's still in the future
    if (tenMinutesBefore.isAfter(now)) {
      console.log("ten mins");
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming Event",
          body: `${event.event.title} starts in 10 minutes.`,
        },
        trigger: tenMinutesBefore.toDate(), // Trigger at 10 minutes before
      });
    }

    // Schedule 5-minute reminder if it's still in the future
    if (fiveMinutesBefore.isAfter(now)) {
      console.log("check for noti");
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Event Reminder",
          body: `${event.event.title} starts now.`,
        },
        trigger: fiveMinutesBefore.toDate(), // Trigger at 5 minutes before
      });
    }

    // Schedule reminder on start
    if (eventTime == now) {
      console.log("event starts now");

      Notifications.scheduleNotificationAsync({
        content: {
          title: "Event Reminder",
          body: `${event.event.title} starts in 5 minutes.`,
        },
        trigger: now, // Trigger at 5 minutes before
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

export { scheduleNotificationsForEvents };
