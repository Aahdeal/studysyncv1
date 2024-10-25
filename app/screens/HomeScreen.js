// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from "react-native";
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import NavBar from "../../components/NavBar";
import { ref, get } from "firebase/database";
import { database } from '../firebase'; // Ensure this points to your Firebase config

const getRandomMotivationalMessage = async () => {
  try {
    const randomIndex = Math.floor(Math.random() * 39);
    const snapshot = await get(ref(database, `motivationalMessage/${randomIndex}`));
    const messageData = snapshot.val();
    return messageData;
  } catch (error) {
    console.error('Error fetching motivational message:', error);
    return null;
  }
};

export default function HomeScreen({ navigation, user }) {
  const [motivationalMessage, setMotivationalMessage] = useState({ message: '', author: '' });
  //fake data to be replaced with database data
  const [hoursStudied, setHoursStudied] = useState([4, 5, 2, 6, 7, 3, 4]); // Example data for bar chart
  const [progress, setProgress] = useState(0.75); // Example progress (75% of goals met)
  const [tasksDue, setTasksDue] = useState([
    { id: '1', title: 'Math Assignment', dueDate: 'Oct 25' },
    { id: '2', title: 'Science Project', dueDate: 'Oct 27' },
    { id: '3', title: 'History Essay', dueDate: 'Oct 28' },
    { id: '4', title: 'History Essay', dueDate: 'Oct 28' },
    { id: '5', title: 'History Essay', dueDate: 'Oct 28' },
    // Add more tasks as needed
  ]);

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDueDate}>Due: {item.dueDate}</Text>
    </View>
  );

  useEffect(() => {
    const fetchMessage = async () => {
      const messageData = await getRandomMotivationalMessage();
      if (messageData) {
        setMotivationalMessage(messageData);
      }
    };
    fetchMessage();
  }, []);

  return (
    <View>
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
      <Text style={styles.title}>PROGRESS TRACKER</Text>

      <View id="motivationalMessage">
        <Text style={styles.motivation}>
          {motivationalMessage.Quote
            ? `${motivationalMessage.Quote} - ${motivationalMessage.Author}`
            : 'Loading...'}
        </Text>
      </View>

      <View id="charts" style={styles.chartsContainer}>
        {/* Line Chart */}
        <Text>Hours Studied This Week</Text>
        <LineChart
          data={{
            labels: ["M", "T", "W", "T", "F", "S", "S"],
            datasets: [
              {
                data: hoursStudied
              }
            ]
          }}
          width={Dimensions.get("window").width * 0.85} // Adjust width as needed
          height={110}
          yAxisLabel=""
          yAxisSuffix="h"
          bezier
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
        
        <Text>Weekly Goal Progress</Text>
        {/* Progress Circle */}
        <ProgressChart
          data={{
            labels: ["Goals\n", "Tasks\n", "Tests\n"],
            data: [progress, progress-0.4, progress-0.1]
          }}
          width={Dimensions.get("window").width * 0.85} // Adjust width as needed
          height={150}
          strokeWidth={7}
          radius={32}
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

      <View id="tasksView" style={styles.tasksContainer}>
        <Text style={styles.tasksHeading}>Tasks Due</Text>
        <ScrollView style={styles.listView}
        nestedScrollEnabled = {true}>
          <FlatList
            data={tasksDue}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      </View>

      <View id="deadlinesView" style={styles.deadlinesContainer}>
        <Text style={styles.tasksHeading}>Upcoming Deadlines</Text>
        <ScrollView style={styles.listView}
        nestedScrollEnabled = {true}>
          <FlatList
            data={tasksDue}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      </View>
      

      
    </View>
    </ScrollView>
    <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  motivation: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "cyan",
    padding: 5,
  },
  listView: {
    height: 150,
  },
  deadlinesContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
  },
  tasksHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskDueDate: {
    fontSize: 14,
    color: 'grey',
  },
});
