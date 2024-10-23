// screens/FlashcardsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import NavBar from "../../components/NavBar";
import RNCalendarEvents from "react-native-calendar-events";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";

export default function FlashcardsScreen({ navigation }) {
  // State variables for event data
  const [eventTitle, setEventTitle] = useState("Gym Workout");
  const [eventLocation, setEventLocation] = useState("New Delhi");
  const [eventId, setEventId] = useState("");
  const [calendars, setCalendars] = useState([]);
  const [pickedCal, setPickedCal] = useState(null);

  // Effect hook to fetch calendars and request permissions (Android specific)
  useEffect(() => {
    async function loadCalendars() {
      try {
        const perms = await RNCalendarEvents.requestPermissions();
        if (perms === "authorized") {
          const allCalendars = await RNCalendarEvents.findCalendars();
          const primaryCal = allCalendars.find(
            (cal) => cal.isPrimary && cal.allowsModifications
          );
          if (primaryCal) {
            setCalendars(allCalendars);
            setPickedCal(primaryCal);
          } else {
            console.log(
              "No primary calendar with modification permissions found."
            );
          }
        } else {
          console.log("Calendar permission denied.");
        }
      } catch (error) {
        console.error("Error while fetching calendars:", error);
      }
    }

    if (Platform.OS === "android" || Platform.OS === "ios") {
      loadCalendars();
    }
  }, []);

  // Event creation function
  const createEvent = async () => {
    try {
      const savedEventId = await RNCalendarEvents.saveEvent(eventTitle, {
        calendarId: Platform.OS === "android" ? pickedCal?.id : undefined,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: eventLocation,
      });

      setEventId(savedEventId);
      alert("Event saved successfully.");
    } catch (error) {
      console.log("Error while saving event:", error);
    }
  };

  // Event fetching function
  const fetchEvent = async () => {
    try {
      // Code for fetching event by ID
      // ...
    } catch (error) {
      console.log("Error while fetching event:", error);
    }
  };

  // Render the UI components
  return (
    <View style={styles.container}>
      <View>
        {/* UI components for input fields and buttons */}
        <TextInput
          style={styles.textInput}
          placeholder="Enter Event Title"
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Event Location"
          value={eventLocation}
          onChangeText={setEventLocation}
          multiline={true}
          numberOfLines={2}
        />
        <Button title="Save Event" onPress={createEvent} />
        <Button title="Fetch Event" onPress={fetchEvent} />
      </View>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
