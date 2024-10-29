// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from "react-native";
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import NavBar from "../../components/NavBar";
import { ref, get } from "firebase/database";
import { database } from '../firebase'; // Ensure this points to your Firebase config
import moment from 'moment';

export default function HomeScreen({ navigation, user }) {
  const [motivationalMessage, setMotivationalMessage] = useState({ message: '', author: '' });
  const [hoursStudied, setHoursStudied] = useState([1, 1, 1, 1, 1, 1, 1]); // Example data for bar chart
  const [progress, setProgress] = useState(0.75); // Example progress (75% of goals met)
  const [eventData, setEventData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

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

  const calcHoursStudied = (eventsThisWeek) => {
    // Implement logic to calculate hours studied based on events
  };

  useEffect(() => {
    const fetchData = async () => {
      const messageData = await getRandomMotivationalMessage();
      if (messageData) {
        setMotivationalMessage(messageData);
      }
      await fetchEvents();
      await fetchTasks();
      setLoading(false);
    };
    fetchData();
  }, []);

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

  if (loading) {
    return <Text>Loading...</Text>; // Add a loading indicator
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

        {/* Horizontal scroll view for both graphs */}
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
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
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

// --------------Styles----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f8ff', // Pastel blue background
    padding: 20,
  },
  scrollContainer: {
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#4A4A4A', // Darker text color for contrast
  },
  motivationalMessage: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e0f7fa', // Light pastel blue
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  motivation: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chartsContainer: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#fff', // White background for charts
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    flexDirection: 'row', // Ensure horizontal layout for charts
  },
  chartWrapper: {
    marginRight: 20, // Space between charts
    width: Dimensions.get("window").width * 0.85,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartStyle: {
    borderRadius: 16,
  },
  tasksContainer: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  tasksHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventsContainer: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  eventsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#666',
  },
});
