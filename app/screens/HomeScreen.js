// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from "react-native";
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import NavBar from "../../components/NavBar";
import { ref, get } from "firebase/database";
import { database } from '../firebase'; // Ensure this points to your Firebase config
import moment from 'moment';



export default function HomeScreen({ navigation, user }) {

  const [motivationalMessage, setMotivationalMessage] = useState({ message: '', author: '' });
  //fake data to be replaced with database data
  const [hoursStudied, setHoursStudied] = useState([1,1,1,1,1,1,1]); // Example data for bar chart
  const [progress, setProgress] = useState(0.75); // Example progress (75% of goals met)
  const [eventData, setEventData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [eventsThisWeek, setEventsThisWeek] = useState([]);
  /*-------------------------DATA ACCESSOR METHODS---------------------- */

  

  // ref(database, "users/" + userId + "/calender/events) try with and without the 0
  const fetchTasks = async () => {
    let tData = [];
    let userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/tasks`);

    try {
      // Retrieve data from Firebase
      const snapshot = await get(eventsRef);
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();  // Get the event data
          const taskId = childSnapshot.key;
          console.log("task state: " + task['completed']);  // Get the unique key

          // Push both the key and data into the events array
          task['startDate'] = moment(new Date(task['startDate'])).format("MMM DD");
          if(!task['completed']){
            tData.push({task, taskId});
          }
        });
        
        setTaskData(tData);
        console.log("Fetched tasks:", taskData);
      } else {
        console.log("No events found for user.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ref(database, "users/" + userId + "/calender/events) try with and without the 0
  const fetchEvents = async () => {
    let eData = [];
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
          const event = childSnapshot.val();  // Get the event data
          const eventId = childSnapshot.key;  // Get the unique key
          const eventDate = moment(event['startDate']);
          //if (eventDate < today && eventDate >= sevenDays && event['type'] == "Relaxing"){
          //  weekData.push({event, eventId});
          //}
          if (new Date(event['startDate']) >= today && new Date(event['endDate']) >= today || new Date(event['endDate']) >= today){
            // Push both the key and data into the events array only if event is upcoming
            console.log(event['startDate'] + " " + event['endDate'])
            eData.push({event, eventId});
          }

          
        });
        
        setEventData(eData);
        //setEventsThisWeek(weekData);
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
  const calcHoursStudied = (eventsThisWeek) => {
    //console.log(eventsThisWeek[0]['event']['id']);
    //i have all the events from the past 7 days
    //create 7 variables, check each event, calculate duration and find start day, if same start date add to variable
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
    //calcHoursStudied(weekData);
    
  }, []);

  const renderTaskItem = ({ item }) => 
    (
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
