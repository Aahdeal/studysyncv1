import React, { useState, useEffect, useCallback } from "react"; 
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from "react-native";
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import NavBar from "../../components/NavBar";
import { ref, get } from "firebase/database";
import { database } from '../firebase';
import moment from 'moment';
import colors from '../../constants/Colours';
import * as Font from 'expo-font';

const HomeScreen = ({ navigation, user }) => {
  const [motivationalMessage, setMotivationalMessage] = useState({ message: '', author: '' });
  const [hoursStudied, setHoursStudied] = useState([1, 1, 1, 1, 1, 1, 1]);
  const [progress, setProgress] = useState(0.75);
  const [eventData, setEventData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({ Graduate: require('../../assets/fonts/Graduate.ttf') });
      setFontsLoaded(true);
    };

    loadFonts();
    fetchData();
  }, []);

  const fetchData = async () => {
    const messageData = await getRandomMotivationalMessage();
    if (messageData) setMotivationalMessage(messageData);
    
    await Promise.all([fetchDataFromFirebase('calendar/tasks', setTaskData), fetchDataFromFirebase('calendar/events', setEventData)]);
  };

  const fetchDataFromFirebase = async (path, setter) => {
    const userId = user.uid;
    const refPath = ref(database, `users/${userId}/${path}`);
    try {
      const snapshot = await get(refPath);
      if (snapshot.exists()) {
        const data = [];
        const today = new Date();
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          const itemId = childSnapshot.key;
          if (path === 'calendar/tasks') {
            item['startDate'] = moment(new Date(item['startDate'])).format("MMM DD");
            if (!item['completed']) data.push({ task: item, taskId: itemId });
          } else if (path === 'calendar/events') {
            if (new Date(item['startDate']) >= today || new Date(item['endDate']) >= today) {
              data.push({ event: item, eventId: itemId });
            }
          }
        });
        setter(data);
      } else {
        console.log(`No data found for ${path}.`);
      }
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
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

  const renderTaskItem = useCallback(({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.task.title}</Text>
      <Text style={styles.taskDueDate}>Due: {item.task.startDate}</Text>
    </View>
  ), []);

  const renderEventItem = useCallback(({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.event.title}</Text>
      <Text style={styles.taskDueDate}>Type: {item.event.type}</Text>
    </View>
  ), []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Progress Tracker</Text>
        <View style={styles.motivationalMessage}>
          <Text style={styles.motivation}>
            {motivationalMessage.Quote ? `${motivationalMessage.Quote} - ${motivationalMessage.Author}` : 'Loading...'}
          </Text>
        </View>

        {/* Sticky Charts Container */}
        <View style={styles.chartsContainer}>
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
                backgroundColor: "yellow", // Set the background color to yellow
                backgroundGradientFrom: "lightblue",
                backgroundGradientTo: "white",
                decimalPlaces: 2,
                color: (opacity = 1) => colors.blushPink,
                labelColor: (opacity = 1) => colors.darkBlue,
              }}
              style={styles.chartStyle}
            />
          </View>

          {/* Space between charts */}
          <View style={styles.chartSpacing} />

          <View style={styles.chartWrapper}>
            <Text style={styles.chartTitle}>Hours Studied This Week</Text>
            <LineChart
              data={{
                labels: ["M", "T", "W", "T", "F", "S", "S"],
                datasets: [{ data: hoursStudied }],
              }}
              width={Dimensions.get("window").width * 0.85}
              height={110}
              yAxisSuffix="h"
              bezier
              chartConfig={{
                backgroundColor: "yellow", // Set the background color to yellow
                backgroundGradientFrom: "lightblue",
                backgroundGradientTo: "white",
                decimalPlaces: 2,
                color: (opacity = 1) => colors.lightPink,
                labelColor: (opacity = 1) => colors.darkBlue,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: colors.beige },
              }}
              style={styles.chartStyle}
            />
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionHeading}>Tasks Due</Text>
          <FlatList
            data={taskData}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.taskId}
          />
        </View>
        <View style={styles.listContainer}>
          <Text style={styles.sectionHeading}>Upcoming Events</Text>
          <FlatList
            data={eventData}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.eventId}
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
    padding: 20,
    backgroundColor: 'white', // Set the background color to white
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Graduate',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.darkBlue,
  },
  motivationalMessage: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.lightgrey,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  motivation: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.darkBlue,
  },
  chartsContainer: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  chartWrapper: {
    width: Dimensions.get('window').width * 0.85,
    marginVertical: 10, // Space between charts
  },
  chartSpacing: {
    height: 20, // Additional space between charts
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.darkBlue,
    fontFamily: 'Graduate',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listContainer: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: 'Graduate',
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
    fontFamily: 'Graduate',
    color: colors.darkBlue,
  },
  taskDueDate: {
    fontSize: 14,
    color: colors.darkBlue,
  },
});

export default HomeScreen;
