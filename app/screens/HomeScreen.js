import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import NavBar from "../../components/NavBar";
import { ref, get } from "firebase/database";
import { database } from '../firebase';
import moment from 'moment';
import colors from '../../constants/Colours';
import * as Font from 'expo-font';
import useUserTheme from "../../hooks/useuserTheme";
import createStyles from "../style/styles";

const HomeScreen = ({ navigation, user }) => {
  const themeColours = useUserTheme(user.uid); // Get the dynamic colours based on theme preference
  const styles = createStyles(themeColours); // Pass colours into styles
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState({
    message: "",
    author: "",
  });
  //fake data to be replaced with database data
  const [hoursStudied, setHoursStudied] = useState([1, 1, 1, 1, 1, 1, 1]); // Example data for bar chart
  const [progress, setProgress] = useState(0.75); // Example progress (75% of goals met)
  const [eventData, setEventData] = useState([]);
  const [eventPastData, setPastEventData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [completeTaskData, setCTD] = useState([]);
  const [eventsThisWeek, setEventsThisWeek] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFonts = async () => {
        await Font.loadAsync({
          Graduate: require("../../assets/fonts/Graduate.ttf"),
        });
        setFontsLoaded(true);
      };

      const fetchData = async () => {
        const messageData = await getRandomMotivationalMessage();
        if (messageData) {
          setMotivationalMessage(messageData);
        }
        fetchEvents();
        fetchTasks();
      };

      loadFonts();
      fetchData();
    }, [])
  );

  useEffect(() => {
    // Check if both taskData and completeTaskData are populated before calculating completion
    if (
      taskData.length > 0 &&
      completeTaskData.length > 0 &&
      eventData.length > 0
    ) {
      calcTaskCompletion();
      calcHoursStudied();
    }
    //registerForPushNotificationsAsync();
    //scheduleNotificationsForEvents(eventData);
  }, [taskData, completeTaskData, eventData]);

  /*-------------------------DATA ACCESSOR METHODS---------------------- */

  // ref(database, "users/" + userId + "/calender/events) try with and without the 0
  const fetchTasks = async () => {
    let tData = [];
    let ctData = [];
    let userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/tasks`);

    try {
      // Retrieve data from Firebase
      const snapshot = await get(eventsRef);

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val(); // Get the event data
          const taskId = childSnapshot.key;

          // Push both the key and data into the events array
          task["startDate"] = moment(new Date(task["startDate"])).format(
            "MMM DD"
          );
          if (!task["completed"]) {
            tData.push({ task, taskId });
          } else {
            ctData.push({ task, taskId });
          }
        });

        setTaskData(tData);
        setCTD(ctData);
      } else {
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ref(database, "users/" + userId + "/calender/events) try with and without the 0
  const fetchEvents = async () => {
    let eData = [];
    let oData = [];
    let userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/events`);

    try {
      // Retrieve data from Firebase
      const snapshot = await get(eventsRef);

      if (snapshot.exists()) {
        const today = new Date();
        const sevenDays = moment().subtract(7, "days");
        let weekData = [];

        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val(); // Get the event data
          const eventId = childSnapshot.key; // Get the unique key
          const eventDate = moment(event["startDate"]);
          //if (eventDate < today && eventDate >= sevenDays && event['type'] == "Relaxing"){
          //  weekData.push({event, eventId});
          //}
          if (
            (new Date(event["startDate"]) >= today &&
              new Date(event["endDate"]) >= today) ||
            new Date(event["endDate"]) >= today
          ) {
            // Push both the key and data into the events array only if event is upcoming
            eData.push({ event, eventId });
          } else {
            oData.push({ event, eventId });
          }
        });

        setEventData(eData);

        setPastEventData(oData);
        //setEventsThisWeek(weekData);
      } else {
        console.log("No events found for user.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const getRandomMotivationalMessage = async () => {
    try {
      const randomIndex = Math.floor(Math.random() * 39);
      const snapshot = await get(
        ref(database, `motivationalMessage/${randomIndex}`)
      );
      const messageData = snapshot.val();
      return messageData;
    } catch (error) {
      console.error("Error fetching motivational message:", error);
      return null;
    }
  };

  //calculate hours studied in the past 7 days
  const calcHoursStudied = () => {
    const today = new Date(); // Get today's date
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month

    let eventsSinceMonthStart = [];

    eventPastData.forEach((e) => {
      const eventStartDate = new Date(e["event"]["startDate"]); // Convert startDate to Date object
      const eventEndDate = new Date(e["event"]["endDate"]);

      if (
        eventStartDate >= startOfMonth &&
        eventStartDate <= today &&
        eventEndDate >= startOfMonth &&
        eventEndDate <= today
      ) {
        eventsSinceMonthStart.push(e); // Push the event to the array
      }
    });

    console.log("eventsSince", eventsSinceMonthStart);
    eventsSinceMonthStart.sort(
      (a, b) => new Date(a.event.startDate) - new Date(b.event.startDate)
    );
    console.log("eventsSince sorted", eventsSinceMonthStart);
    let duration = []; // Initialize total duration

    // Object to hold the duration for events grouped by date
    const eventsByDate = {};

    // Loop through events and group them by start date
    for (const { event } of eventsSinceMonthStart) {
      const startDate = new Date(event.startDate).toDateString(); // Group by day
      const endDate = new Date(event.endDate);

      // Calculate the duration of the event in hours
      const eventDuration =
        (endDate - new Date(event.startDate)) / (1000 * 60 * 60); // Convert milliseconds to hours

      // Initialize the grouping if it doesn't exist
      if (!eventsByDate[startDate]) {
        eventsByDate[startDate] = 0;
      }

      // Accumulate the duration for that date
      eventsByDate[startDate] += eventDuration;
    }
    console.log("eventsByDate", eventsByDate);

    Object.entries(eventsByDate).forEach(([date, count]) => {
      const eventDate = new Date(date); // Convert string date to Date object
      // Calculate the number of days since the beginning of the month
      const daysSinceStart = (today - startOfMonth) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
      // Check if duration is empty
      if (duration.length === 0) {
        // Push 0 to duration for each day since the beginning of the month
        for (let i = 0; i <= daysSinceStart; i++) {
          duration.push(0);
        }
      }
      const daysSinceEvent = (eventDate - startOfMonth) / (1000 * 60 * 60 * 24);
      duration[daysSinceEvent] = count;
    });

    console.log(duration);
    setHoursStudied(duration);
  };

  const calcTaskCompletion = () => {
    const completeTasks = Array.isArray(completeTaskData)
      ? completeTaskData.length
      : 0;
    const totalTasks =
      Array.isArray(completeTaskData) && Array.isArray(taskData)
        ? completeTaskData.length + taskData.length
        : 0;

    // Avoid division by zero
    if (totalTasks > 0) {
      setProgress(completeTasks / totalTasks);
    } else {
      setProgress(0); // Set to 0 if there are no tasks
    }
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item["task"]["title"]}</Text>
      <Text style={styles.taskDueDate}>Due: {item["task"]["startDate"]}</Text>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item["event"]["title"]}</Text>
      <Text style={styles.taskDueDate}>Type: {item["event"]["type"]}</Text>
    </View>
  );

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  TestNotification();

  return (
    <View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Progress Tracker</Text>
          <View style={styles.motivationalMessage}>
            <Text style={styles.motivation}>
              {motivationalMessage.Quote
                ? `${motivationalMessage.Quote} - ${motivationalMessage.Author}`
                : "Loading..."}
            </Text>
          </View>

          <View id="charts" style={styles.chartsContainer}>
            {/* Line Chart */}
            <Text style={styles.chartTitle}>Hours Studied This Month</Text>
            <LineChart
              data={{
                datasets: [
                  {
                    data: hoursStudied,
                  },
                ],
              }}
              width={Dimensions.get("window").width * 0.85} // Adjust width as needed
              height={110}
              yAxisLabel=""
              yAxisSuffix=""
              bezier
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 1,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "0",
                  stroke: "#ffa726",
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />

            <Text style={styles.chartTitle}>Weekly Goal Progress</Text>
            {/* Progress Circle */}
            <ProgressChart
              data={{
                labels: ["Tasks\n"],
                data: [progress],
              }}
              width={Dimensions.get("window").width * 0.85} // Adjust width as needed
              height={150}
              strokeWidth={25}
              radius={50}
              hideLegend={false}
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

      <View style={styles.listContainer}>
          <Text style={styles.sectionHeading}>Task(s) Due</Text>
        <ScrollView style={styles.listView}
        nestedScrollEnabled = {true}>
          <FlatList
            data={taskData}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item['taskId']}
          />
        </ScrollView>
        </View>
        <View style={styles.listContainer}>
          <Text style={styles.sectionHeading}>Upcoming Events</Text>
        <ScrollView style={styles.listView}
        nestedScrollEnabled = {true}>
          <FlatList
            data={eventData}
            renderItem={renderEventItem}
            keyExtractor={(item)=> item['eventId']}
          />
        </ScrollView>
      </View>
  
      
    </View>
    </ScrollView>
    <NavBar />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white", // Set the background color to white
  },
  scrollContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "Graduate",
    marginBottom: 15,
    textAlign: "center",
    color: colors.darkBlue,
  },
  motivationalMessage: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.lightgrey,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  motivation: {
    fontSize: 16,
    textAlign: "center",
    color: colors.darkBlue,
  },
  chartsContainer: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "white",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  chartWrapper: {
    width: Dimensions.get("window").width * 0.85,
    marginVertical: 10, // Space between charts
  },
  chartSpacing: {
    height: 20, // Additional space between charts
  },
  chartTitle: {
    textAlign: "center",
    fontSize: 16,
    color: colors.darkBlue,
    fontFamily: "Graduate",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listContainer: {
    marginTop: 20,
  },
  listView: {
    height: 150,
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: "Graduate",
    color: colors.darkBlue,
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.lightPink,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: "Graduate",
    color: colors.darkBlue,
  },
  taskDueDate: {
    fontSize: 14,
    color: colors.darkBlue,
  },
});
}

export default HomeScreen;
