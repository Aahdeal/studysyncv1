import * as Notifications from "expo-notifications";
import moment from "moment";

const scheduleNotificationsForEvents = (events) => {
  events.forEach((event) => {
    console.log("I am event: ", event);
    const eventTime = moment(event.startDate); // Assuming startDate is a moment-compatible date

    // Calculate reminder times
    const tenMinutesBefore = eventTime.clone().subtract(10, "minutes");
    const fiveMinutesBefore = eventTime.clone().subtract(5, "minutes");
    const now = moment();

    // Schedule 10-minute reminder if it's still in the future
    if (tenMinutesBefore.isAfter(now)) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming Event",
          body: `${event.title} starts in 10 minutes.`,
        },
        trigger: tenMinutesBefore.toDate(), // Trigger at 10 minutes before
      });
    }

    // Schedule 5-minute reminder if it's still in the future
    if (fiveMinutesBefore.isAfter(now)) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Event Reminder",
          body: `${event.title} starts in 5 minutes.`,
        },
        trigger: fiveMinutesBefore.toDate(), // Trigger at 5 minutes before
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
