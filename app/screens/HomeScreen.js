// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from "react-native";
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import NavBar from "../../components/NavBar";
import { ref, get } from "firebase/database";
import { database } from '../firebase'; // Ensure this points to your Firebase config



export default function HomeScreen({ navigation, user }) {

  const [motivationalMessage, setMotivationalMessage] = useState({ message: '', author: '' });
  //fake data to be replaced with database data
  const [hoursStudied, setHoursStudied] = useState([4, 5, 2, 6, 7, 3, 4]); // Example data for bar chart
  const [progress, setProgress] = useState(0.75); // Example progress (75% of goals met)
  const [eventData, setEventData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  /*-------------------------DATA ACCESSOR METHODS---------------------- */

  let eData = [];
  let tData = [];

  // ref(database, "users/" + userId + "/calender/events) try with and without the 0
  const fetchTasks = async () => {
    let userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/tasks`);

    try {
      // Retrieve data from Firebase
      const snapshot = await get(eventsRef);
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();  // Get the event data
          const taskId = childSnapshot.key;
          console.log("task id: " + childSnapshot.key);  // Get the unique key

          // Push both the key and data into the events array
          tData.push({task, taskId});
        });
        
        setTaskData(tData);
        console.log("Fetched tasks:");
      } else {
        console.log("No events found for user.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ref(database, "users/" + userId + "/calender/events) try with and without the 0
  const fetchEvents = async () => {
    let userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/events`);

    try {
      // Retrieve data from Firebase
      const snapshot = await get(eventsRef);
      
      if (snapshot.exists()) {
        const events = [];
        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val();  // Get the event data
          const eventId = childSnapshot.key; // Get the unique key

          // Push both the key and data into the events array
          eData.push({event, eventId});
        });
        
        setEventData(eData);
        console.log("Fetched events", eventData);
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
      const messageData = snapshot.val();
      return messageData;
    } catch (error) {
      console.error('Error fetching motivational message:', error);
      return null;
    }
  };

  //calculate hours studied in the past 7 days
  const calcHoursStudied = (eventData) => {
    console.log(eventData[0]['event']);
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
      //store all events from 7 days prior to array lastSeven remove all events where type not study
      var lastSevenDaysEvents = [];
      for(i = 0; i < eventData.length; i++){
        let event = eventData[i]['event']['startDate'];
        console.log(event);
      }
      eventData.forEach(event =>{
        const eventDate = event['event']['startDate'];
        console.log(eventDate)
        if(eventDate >= sevenDaysAgo && eventDate <= today && event['event']['type'] === 'Relaxing'){
          lastSevenDaysEvents.push(event);
        }
      });
    
      console.log("last 7 days: ", lastSevenDaysEvents);
      //separate events by day and calculate hours studied for that day by looking at startDate and endDate
      const hoursByDay = {};

      lastSevenDaysEvents.forEach(event => {
        const eventDate = new Date(event['event']['startDate']).toDateString();
        const startDate = new Date(event['event']['startDate']);
        const endDate = new Date(event['event']['endDate']);
        
        // Calculate hours studied for the event
        const hoursStudied = (endDate - startDate) / (1000 * 60 * 60); // Convert ms to hours

        // Initialize the day's entry if it doesn't exist
        if (!hoursByDay[eventDate]) {
          hoursByDay[eventDate] = 0;
        }

        hoursByDay[eventDate] += hoursStudied;
        

      });
      

      const arrayHours = Object.entries(hoursByDay).map(([date, hours]) => ({ date, hours }));

        // Set hours studied (you might want to store it or return it)
        setHoursStudied(arrayHours);

  };

  useEffect(() => {
    const fetchData = async () => {
      const messageData = await getRandomMotivationalMessage();
      if (messageData) {
        setMotivationalMessage(messageData);
      }
      fetchEvents();
      fetchTasks();
    };
    fetchData();
    //calcHoursStudied(eventData);
    
  }, []);

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item['task']['title']}</Text>
      <Text style={styles.taskDueDate}>Due: {item['task']['dueDate']}</Text>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item['event']['title']}</Text>
      <Text style={styles.taskDueDate}>Type: {item['event']['type']}</Text>
    </View>
  );

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
            data={taskData}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item['taskId']}
          />
        </ScrollView>
      </View>

      <View id="deadlinesView" style={styles.deadlinesContainer}>
        <Text style={styles.tasksHeading}>Upcoming Deadlines</Text>
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
