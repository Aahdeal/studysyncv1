// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from "react-native";
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import NavBar from "../../components/NavBar";
import { ref, get } from "firebase/database";
import { database } from '../firebase'; // Ensure this points to your Firebase config
import moment from 'moment';
import colors from '../../constants/Colours';


// Load custom font
import * as Font from 'expo-font';

export default function HomeScreen({ navigation, user }) {
  const [motivationalMessage, setMotivationalMessage] = useState({ message: '', author: '' });
  const [hoursStudied, setHoursStudied] = useState([1, 1, 1, 1, 1, 1, 1]);
  const [progress, setProgress] = useState(0.75);
  const [eventData, setEventData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Graduate: require('../../assets/fonts/Graduate.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
    fetchData();
  }, []);

  const fetchData = async () => {
    const messageData = await getRandomMotivationalMessage();
    if (messageData) {
      setMotivationalMessage(messageData);
    }
    await fetchEvents();
    await fetchTasks();
    setLoading(false);
  };

  const fetchTasks = async () => {
    const userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/tasks`);
    try {
      const snapshot = await get(eventsRef);
      let tData = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();
          const taskId = childSnapshot.key;
          task['startDate'] = moment(new Date(task['startDate'])).format("MMM DD");
          if (!task['completed']) {
            tData.push({ task, taskId });
          }
        });
        setTaskData(tData);
      } else {
        console.log("No tasks found for user.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchEvents = async () => {
    const userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/events`);
    try {
      const snapshot = await get(eventsRef);
      let eData = [];
      if (snapshot.exists()) {
        const today = new Date();
        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val();
          const eventId = childSnapshot.key;
          if (new Date(event['startDate']) >= today || new Date(event['endDate']) >= today) {
            eData.push({ event, eventId });
          }
        });
        setEventData(eData);
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
      const snapshot = await get(ref(database, `motivationalMessage/${randomIndex}`));
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching motivational message:', error);
      return null;
    }
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item['task']['title']}</Text>
      <Text style={styles.taskDueDate}>Due: {item['task']['startDate']}</Text>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item['event']['title']}</Text>
      <Text style={styles.taskDueDate}>Type: {item['event']['type']}</Text>
    </View>
  );

  if (!fontsLoaded || loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>PROGRESS TRACKER</Text>
        <View style={styles.motivationalMessage}>
          <Text style={styles.motivation}>
            {motivationalMessage.Quote
              ? `${motivationalMessage.Quote} - ${motivationalMessage.Author}`
              : 'Loading...'}
          </Text>
        </View>
        <ScrollView horizontal={true} style={styles.chartsContainer}>
          <View style={styles.chartWrapper}>
            <Text style={styles.chartTitle}>Weekly Goal Progress</Text>
            <ProgressChart
              data={{
                labels: ["Goals\n", "Tasks\n", "Tests\n"],
                data: [progress, progress - 0.4, progress - 0.1],
              }}
              width={Dimensions.get("window").width * 0.85}
              height={150}
              strokeWidth={7}
              radius={32}
              hideLegend={false}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#f0f0f0",
                decimalPlaces: 2,
                color: (opacity = 1) => colors.blushPink,
                labelColor: (opacity = 1) => colors.darkBlue,
              }}
              style={styles.chartStyle}
            />
          </View>
          <View style={styles.chartWrapper}>
            <Text style={styles.chartTitle}>Hours Studied This Week</Text>
            <LineChart
              data={{
                labels: ["M", "T", "W", "T", "F", "S", "S"],
                datasets: [{ data: hoursStudied }],
              }}
              width={Dimensions.get("window").width * 0.85}
              height={110}
              yAxisLabel=""
              yAxisSuffix="h"
              bezier
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#f0f0f0",
                decimalPlaces: 2,
                color: (opacity = 1) => colors.lightPink,
                labelColor: (opacity = 1) => colors.darkBlue,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: colors.beige },
              }}
              style={styles.chartStyle}
            />
          </View>
        </ScrollView>
        <View style={styles.tasksContainer}>
          <Text style={styles.tasksHeading}>Tasks Due</Text>
          <FlatList
            data={taskData}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item['taskId']}
          />
        </View>
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsHeading}>Upcoming Events</Text>
          <FlatList
            data={eventData}
            renderItem={renderEventItem}
            keyExtractor={(item) => item['eventId']}
          />
        </View>
      </ScrollView>
      <NavBar navigation={navigation} user={user} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paleBlue,
    padding: 20,
  },
  scrollContainer: {
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Graduate',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.darkBlue,
  },
  motivationalMessage: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.lightPink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  motivation: {
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: 'Graduate',
    textAlign: 'center',
    color: colors.darkBlue,
  },
  chartsContainer: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    flexDirection: 'row',
  },
  chartWrapper: {
    marginRight: 20,
    width: Dimensions.get("window").width * 0.85,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Graduate',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.darkBlue,
  },
  tasksContainer: {
    marginBottom: 20,
  },
  tasksHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Graduate',
    color: colors.caramel,
  },
  eventsContainer: {
    marginBottom: 20,
  },
  eventsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Graduate',
    color: colors.caramel,
  },
  taskItem: {
    padding: 15,
    backgroundColor: colors.lightPink,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Graduate',
    color: colors.darkBlue,
  },
  taskDueDate: {
    fontSize: 14,
    fontFamily: 'Graduate',
    color: colors.darkBlue,
  },
});

