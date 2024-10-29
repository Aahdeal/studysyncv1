import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import NavBar from "../../components/NavBar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Modal,
  TextInput,
  Button,
  Switch,
  ScrollView,
  FlatList,
} from "react-native";
import { set, ref, get } from "firebase/database";
import { database } from "../firebase";
import moment from "moment"; //helps get different variants of time
import RNPickerSelect from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "../../components/Icon";

import { Card } from "react-native-paper";
import { Agenda } from "react-native-calendars";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function BrokerCalendar({ navigation, user }) {
  const [items, setItems] = useState({}); //state for tasks and events to be loaded within selected date range
  const [isModalVisible, setModalVisible] = useState(false); // State to handle modal visibility
  const [isTaskModalVisible, setTaskModalVisible] = useState(false); // State to handle task modal visibility
  const [isEventModalVisible, setEventModalVisible] = useState(false); // State to handle event modal visibility
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false); // State to handle start date picker visibility
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false); // State to handle end date picker visibility
  const [isTaskDatePickerVisible, setTaskDatePickerVisibility] =
    useState(false); // State to handle task date picker visibility
  const [isAllDay, setIsAllDay] = useState(false); //state to mark events as all day
  const [showHomework, setShowHomework] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  let userId = user.uid;

  /*----------------------DATA ACCESSOR METHODS----------------------- */
  const handleEventUpload = async () => {
    let userId = user.uid;
    console.log(data.length);

    let event = data.slice(-1);
    let repeat = event[0].repeatCount;
    console.log("event.eventId : ", event[0].eventId, " event: ", { event });

    try {
      for (i = 1; i <= repeat; i++) {
        let uploadEvent = data[data.length - i];
        let eventID = uploadEvent.eventId.replace(".", "");
        await set(
          ref(database, "users/" + userId + "/calendar/events/" + eventID),
          uploadEvent
        )
          .then(() => {
            console.log("Event uploaded successfully!");
          })
          .catch((error) => {
            console.error("Error uploading event:", error);
          });
      }
    } catch (error) {
      console.error("Loop Error uploading event:", error);
    }
  };
  const handleTaskUpload = async () => {
    console.log("uid: ", userId);
    //console.log(data.length);
    let event = taskData.slice(-1);
    console.log(
      "task.Id : ",
      event[0].taskId,
      " task: ",
      event[0],
      " start: ",
      event[0].startDate
    );

    try {
      let uploadEvent = taskData[taskData.length - 1];
      let taskID = uploadEvent.taskId.replace(".", "");
      console.log("T ", taskID, " date ", uploadEvent.startDate);
      await set(
        ref(database, "users/" + userId + "/calendar/tasks/" + taskID),
        uploadEvent
      )
        .then(() => {
          console.log("Task uploaded successfully!");
        })
        .catch((error) => {
          console.error("Error uploading event:", error);
        });
    } catch (error) {
      console.error("Loop Error uploading event:", error);
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
        // Convert the snapshot data to an array of events
        const events = Object.values(snapshot.val());
        //console.log("Fetched events:", events);
        // Set the fetched data to array
        data = events;
      } else {
        console.log("No events found for user.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchTasks = async () => {
    let userId = user.uid;
    const eventsRef = ref(database, `users/${userId}/calendar/tasks`);

    try {
      // Retrieve data from Firebase
      const snapshot = await get(eventsRef);

      if (snapshot.exists()) {
        // Convert the snapshot data to an array of events
        const tasks = Object.values(snapshot.val());

        // Set the fetched data to array
        taskData = tasks;
        setTasks(tasks);
        //console.log("Fetched tasks:", tasks);
      } else {
        console.log("No tasks found for user.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const deleteEventFromDatabase = (eventId) => {
    let userId = user.uid;
    firebase.database().ref(`users/${userId}/calendar/events/${eventId}`).remove();
  };
  
  const deleteTaskFromDatabase = (taskId) => {
    let userId = user.uid;
    firebase.database().ref(`users/${userId}/calendar/tasks/${eventId}`).remove();
  };

  /*--------------------------Sample Data--------------------------------*/

  //data variables
  let data = [];
  fetchEvents();
  let taskData = [];
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const [tasks, setTasks] = useState([]);
  //console.log("taskData ", tasks);

  const timeToString = (time) => {
    // Check if the input is a time string (e.g., "12:00")
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (timePattern.test(time)) {
      return time; // Just return the valid time string
    }

    // If the time is not a string but a date, handle it normally
    const date = new Date(time); // Convert the passed time to a Date object

    if (isNaN(date.getTime())) {
      // Handle invalid date by logging and returning an empty string or fallback value
      console.error("Invalid date:", time);
      return "";
    }

    // Format date to 'YYYY-MM-DD'
    return date.toISOString().split("T")[0];
  };
  //said fake data

  /*-----------------------------Modal Visibility Functions----------------------------------*/

  const toggleHomeworkVisibility = () => {
    setShowHomework(!showHomework);
  };
  const showTaskDatePicker = () => {
    setTaskDatePickerVisibility(true);
  };
  const hideTaskDatePicker = () => {
    setTaskDatePickerVisibility(false);
  };
  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };
  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };
  const showToDatePicker = () => {
    setToDatePickerVisibility(true);
  };
  const hideToDatePicker = () => {
    setToDatePickerVisibility(false);
  };

  //close modal that gives you the option to add event/task
  const closeModal = () => {
    setModalVisible(false);
  };
  const openEventModal = () => {
    setEventModalVisible(true);
    closeModal();
  };
  const openTaskModal = () => {
    setTaskModalVisible(true);
    closeModal();
  };

  /*--------------------------------------Event and Task Creation-----------------------------------------------*/

  //state for adding a new event to calendar, these are the default settings
  const [newEvent, setNewEvent] = useState({
    eventId: "",
    title: "",
    description: "",
    allDay: false,
    startDate: new Date(), //current date
    endDate: moment().add(1, "hour").toDate(), //current date +1h
    type: "Relaxing",
    repeat: "does not repeat",
    repeatCount: 1,
  });
  //state for adding a new task to calendar, these are the default settings
  const [newTask, setNewTask] = useState({
    taskId: "", //ID is required to check task as complete which ticking checkbox
    title: "",
    description: "",
    allDay: false,
    startDate: new Date(), //task only has a start date. it doesnt span accross a time period. like todo list
    completed: false,
  });

  //once all day is toggled, add event's end date should be set to end of that day and input field should set to not editable
  const toggleAllDay = () => {
    setNewEvent((prev) => ({ ...prev, allDay: !prev.allDay }));
  };

  /*-------------------------------------Handles Task Confirmation------------------------------------------ */

  /*-------------------------------------Handles Task Date Confirmation------------------------------------------ */
  const handleConfirmTask = (date) => {
    setNewTask({
      ...newTask,
      startDate: date,
    });
    console.warn(
      "A Task date has been picked: ",
      moment(date).format("MMMM Do YYYY, h:mm A")
    );
    console.log("task date: ", newTask.startDate);
    hideTaskDatePicker();
  };

  /*-------------------------------------Updates newEvent start------------------------------------------ */
  //once start date is entered, set newEvent state's startDate
  const handleConfirmFrom = (date) => {
    // "...newEvent" carries all the already stored info and sets "startDate" to "date"
    setNewEvent({
      ...newEvent,
      startDate: date,
      // Automatically Ensure end date is after start date by making enddate = startdate +1h, user can change end date afterwards
      endDate:
        newEvent.endDate && date > newEvent.endDate
          ? moment(new Date(date.getTime() + 60 * 60 * 1000)).format(
              "MMMM Do YYYY, h:mm A"
            ) // Add 1 hour default
          : newEvent.endDate,
    });
    console.warn(
      "A From date has been picked: ",
      moment(date).format("MMMM Do YYYY, h:mm A")
    );
    console.log("new date: ", newEvent.startDate);
    console.log("start time ", moment(newEvent.startDate).format("HH:mm")),
      hideFromDatePicker();
  };

  /*-------------------------------------updates new event end------------------------------------------ */

  const handleConfirmTo = (date) => {
    setNewEvent({
      ...newEvent,
      endDate: date,
    });
    console.warn(
      "A To date has been picked: ",
      moment(date).format("MMMM Do YYYY, h:mm A")
    );
    g;
    hideToDatePicker();
  };

  /*-------------------------------------FUNCTIONS------------------------------------------ */

  //i think this was supposed to load the events & tasks in the month being shown on calendar,
  //so when you move to new month new events and tasks display
  loadItemsForMonth = (month) => {
    console.log("trigger items loading");
  };

  /*----------------------------Sets dot color on events------------------------------------ */
  const formattedEvents =
    //if data is true and data is an array and data array>0
    data && Array.isArray(data) && data.length > 0;
  //run through all of it and set dot colour according to the type of event
  data.reduce((acc, current) => {
    let dotColor;
    switch (current.type) {
      case "Submission":
        dotColor = "red";
        break;
      case "Test":
        dotColor = "orange";
        break;
      case "Study":
        dotColor = "blue";
        break;
      case "Birthday":
        dotColor = "pink";
        break;
      case "Any":
        dotColor = "beige";
        break;
      default:
        dotColor = "gray"; // fallback color
    }
    //settings to display the dots on calendar for each date
    acc[current.date] = {
      marked: true,
      dotColor: dotColor,
      activeOpacity: 0.5,
      //next 4 props are probably not necessary here
      title: current.title,
      description: current.description,
      StartTime: current.StartTime,
      EndTime: current.EndTime,
    };
    return acc;
  }, {});

  /*-------------------------------------loads items to display------------------------------------------ */
  const loadItems = (day) => {
    //day is either current day or day selected on calendar
    //fetch data from db
    const items = {}; // Temporary object to hold events and tasks
    const fourteenDaysAgo = moment().subtract(14, 'days');

    setTimeout(() => {
      // Loop through a range of dates (-14 days to +30 days from the current date)
      for (let i = -14; i < 30; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000; // Calculate date offsets
        const strTime = timeToString(time); // Convert timestamp to 'YYYY-MM-DD' string

        // Ensure that items[strTime] is initialized as an empty array
        if (!items[strTime]) {
          items[strTime] = [];
        }

        // Add events from 'data' to the items object if it is within date range
        data.forEach((event) => {
          const eventStartDate = moment(event.startDate);
          if (eventStartDate.isBefore(fourteenDaysAgo)) {
            // Assuming you have a function to delete from the database
            deleteEventFromDatabase(event.eventId); // Replace with your deletion method
          }
          else if (moment(event.startDate).format("YYYY-MM-DD") === strTime) {
            items[strTime].push({
              eventId: event.eventId,
              title: event.title,
              description: event.description,
              StartTime: moment(event.startDate).format("HH:mm"),
              EndTime: moment(event.endDate).format("HH:mm"),
              type: event.type,
            });
          }
        });

        // Add tasks to the items object if it is within date range
        tasks.forEach((task) => {
          const taskDate = moment(task.date);
          // Delete task if older than 14 days
          if (taskDate.isBefore(fourteenDaysAgo)) {
            deleteTaskFromDatabase(task.taskId); // Replace with your deletion method
          } else if (task.date === strTime) {
            items[strTime].push({
              ...task,
              title: task.title,
              //title: `Task: ${task.title}`, // Prefix "Task" to distinguish tasks from events
              completed: task.completed,
            });
          }
        });
      }

      // Update the state with the newly created items object
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });

      setItems(newItems); // Update the state with tasks and events
    }, 1000);
  };

  /*-------------------------------------DISPLAYS EVENTS ON AGENDA------------------------------------------ */
  //displays tasks and events in agenda format "card", can remove tasks since aadil figured how to diplay at bottom of screen
  const renderItem = (item) => {
    if (item.completed !== undefined) {
      // This is a task, events dont have completed field
      return (
        <View style={styles.taskContainer}>
          {/* <CheckBox
            value={item.completed}
            onValueChange={() => toggleTaskCompletion(item)}
          /> */}
          <Text
            style={item.completed ? styles.completedTask : styles.taskTitle}
          >
            {item.title}
          </Text>
        </View>
      );
    } else {
      //display event card
      return (
        //allow it to be clickable, once clicked it can pop up to editable mode maybe?
        <TouchableOpacity
          style={{ marginRight: 10, marginTop: 17 }}
          onPress={() =>
            //we dont have this navigation, maybe we can set add event modal to display
            //but then we need event id's as well to pull the specific events info
            navigation.navigate("PullForwardDetails", {
              data: item,
            })
          }
        >
          <Card>
            <Card.Content>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  //statusStrip = that colour line on the side. can me set to same colour as dot marking
                  style={[styles.StatusStrip, { backgroundColor: "#009ad8" }]}
                />
                <View style={{ flex: 0.7 }}>
                  <View style={styles.Time}>
                    <Text style={styles.timeText}>
                      {/* display start and end time */}
                      {item?.StartTime} - {item?.EndTime}
                    </Text>
                  </View>
                  <Text style={styles.BookingNameText}>{item.title}</Text>
                  <Text style={styles.BookingDescriptionText}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }
  };

  /*-------------------------------------GENERATE REPEATED EVENTS------------------------------------------ */
  // Function to generate repeated events
  function generateRepeatedEvents(newEvent) {
    const events = [];
    const startDate = newEvent.startDate;
    const endDate = newEvent.endDate; // Use startDate for initial date of event

    let repeatCount = 1;

    if (newEvent.repeat === "does not repeat") {
      events.push(newEvent); // Push the event as-is to array
      data.push(newEvent);
      return events;
    }

    // Use the user-defined repetition count if available
    if (newEvent.repeatCount) {
      repeatCount = newEvent.repeatCount;
    } else if (newEvent.repeat === "daily") {
      repeatCount = 14; // Default count if no user input (optional)
    } else if (newEvent.repeat === "weekly") {
      repeatCount = 13; // Default count if no user input (optional)
    } else if (newEvent.repeat === "monthly") {
      repeatCount = 3; // Default count if no user input (optional)
    }

    //add events to array according to repeat count
    for (let i = 0; i < repeatCount; i++) {
      //get current event info and set to nextEvent var
      let nextEvent = { ...newEvent };
      let nextDate;
      let nextEnd;

      switch (newEvent.repeat) {
        //if daily then add repeat count number to days etc.
        case "daily":
          nextDate = moment(startDate).add(i, "days");
          nextEnd = moment(endDate).add(i, "days");
          break;
        case "weekly":
          nextDate = moment(startDate).add(i, "weeks");
          nextEnd = moment(endDate).add(i, "weeks");
          break;
        case "monthly":
          nextDate = moment(startDate).add(i, "months");
          nextEnd = moment(endDate).add(i, "months");
          break;
        default:
          nextDate = startDate;
      }
      //change next event startDate to new date set by repeat count, this should be formatted with time as well "format("YYYY-MM-DD HH:mm")"
      nextEvent.startDate = nextDate.format("YYYY-MM-DD HH:mm");
      nextEvent.endDate = nextEnd.format("YYYY-MM-DD HH:mm");

      nextEvent.eventId = newEvent.eventId + i; // adjusting ID for repeated events
      events.push(nextEvent);
      data.push(nextEvent);
    }

    return events;
  }
  // Function to handle date selection
  const handleDateSelect = (date) => {
    console.log("clicked: ", date);
    setSelectedDate(date);
    filterTasksByDate(date);
  };

  // Filter tasks by selected date
  const filterTasksByDate = (date) => {
    const filtered = tasks.filter(
      (task) =>
        task.startDate &&
        task.startDate.substring(0, 10) === date.substring(0, 10)
    );

    setFilteredTasks(filtered);
  };
  /*-------------------------------------SAVE EVENTS/TASKS------------------------------------------ */
  //handles repeated events
  const handleAddEvent = (newEvent) => {
    const repeatedEvents = generateRepeatedEvents(newEvent); //returns array of events
    console.log("repeated events list data: ", data);
    // Update state only once with new events
    //setEvents((prevEvents) => [...prevEvents, ...repeatedEvents]);
    //data.push(repeatedEvents); //add array of new events to current array

    // Update items for calendar rendering to display new events to calendar
    const updatedItems = { ...items };
    repeatedEvents.forEach((event) => {
      console.log(
        "event starts: ",
        moment(event.startDate).format("YYYY-MM-DD HH:mm")
      );
      const dateKey = event.startDate; // Ensure this matches your calendar's expected format
      if (!updatedItems[dateKey]) {
        updatedItems[dateKey] = [];
      }
      updatedItems[dateKey].push({
        title: event.title,
        description: event.description,
        StartTime: event.startDate,
        EndTime: event.endDate,
        type: event.type,
      });
    });

    setItems(updatedItems); // Set the updated items once
    handleEventUpload();
    console.log("data: ", data, "data 0: ", data[0]);
  };

  // Function to save new events to events array
  const saveEvent = () => {
    const newEventEntry = {
      eventId: new Date().toISOString(),
      title: newEvent.title,
      description: newEvent.description,
      startDate: moment(newEvent.startDate).format("YYYY-MM-DD HH:mm"),
      endDate: moment(newEvent.endDate).format("YYYY-MM-DD HH:mm"),
      type: newEvent.type,
      repeat: newEvent.repeat,
      repeatCount: newEvent.repeatCount || 1,
    };

    console.log(
      "Saving new event:",
      newEventEntry,
      " ",
      newEventEntry.startDate
    ); // Debug log
    handleAddEvent(newEventEntry); // renders events to calendar and generates repeated events

    //resets fields
    setNewEvent({
      title: '',
      description: '',
      startDate: moment(new Date()).format("MMMM Do YYYY, h:mm A"),
      endDate: moment(new Date()).format("MMMM Do YYYY, h:mm A"),
      type: '',
      repeat: 'does not repeat',
      repeatCount: '',
    });
    setEventModalVisible(false); // Close modal after saving
  };

  const saveTask = () => {
    const newTaskEntry = {
      taskId: new Date().toISOString(),
      title: newTask.title,
      description: newTask.description,
      startDate: moment(newTask.startDate).format("YYYY-MM-DD HH:mm"),
      completed: newTask.completed, // Save the completed state
    };
    taskData.push(newTaskEntry);
    console.log("taskData: ", taskData);
    handleTaskUpload();
    setTasks((prevTasks) => [...prevTasks, newTaskEntry]);

    setNewTask({
      taskId: new Date().toISOString(),
      title: "",
      description: "",
      startDate: moment(new Date()).format("YYYY-MM-DD HH:mm"),
      completed: "",
    })
    setTaskModalVisible(false);
  };

  /*-------------------------------------DISPLAYS TASKS IDK YET JAILYNN EXPLAIN------------------------------------------ */
  const renderTask = (task) => {
    return (
      <TouchableOpacity
        style={{ marginRight: 10, marginTop: 17 }}
        onPress={() => navigation.navigate("TaskDetails", { data: item })}
      >
        <Card>
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              {/* <CheckBox
                value={item.completed}
                onValueChange={() => toggleTaskCompletion(item)}
              /> */}
              <View>
                {/* <Text
                  style={
                    item.completed ? styles.completedTask : styles.taskTitle
                  }
                >
                  {item.title}
                </Text>
                <Text>{item.description}</Text> */}
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  /*-------------------------------------TASK COMPLETION TOGGLE------------------------------------------ */
  const toggleTaskCompletion = async (task) => {
    const updatedTasks = tasks.map((t) =>
      t.taskId === task.taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    console.log("uid: ", userId);

    try {
      let taskID = task.taskId.replace(".", "");
      const newCompletedStatus = !task.completed; // Toggle completed status
      console.log("T ", taskID, " complete? ", task.completed);
      await set(
        ref(database, "users/" + userId + "/calendar/tasks/" + taskID),
        // ref(database, "users/" + userId + "/calendar/tasks/" + taskID),
        {
          ...task,
          completed: newCompletedStatus,
        }
      )
        .then(() => {
          console.log("Task updated successfully!");
        })
        .catch((error) => {
          console.error("Error uploading event:", error);
        });
    } catch (error) {
      console.error("Loop Error uploading event:", error);
    }
  };

  /*-------------------------------------USER INTERFACE------------------------------------------ */
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>CALENDAR</Text>
      {/*-------------------------------------CALENDAR------------------------------------------ */}
      <View style={styles.calendarContainer}>
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          selected={new Date()}
          renderItem={renderItem}
          markedDates={formattedEvents}
          onDayPress={(day) => {
            const event = data.find((event) => event.date === day.dateString);
            // if (event) {
            //   alert(`${event.title}: ${event.type}`);
            //   },
            handleDateSelect(day.dateString);
          }}
        />
      </View>

      {/*-------------------------------------TO DO LIST------------------------------------------ */}
      <View>
        <Text style={styles.title}>TO DO LIST</Text>
        <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.taskId}
            renderItem={({ item }) => (
              <View style={styles.checkboxContainer}>
                <BouncyCheckbox
                  isChecked={item.completed} // Use isChecked instead of value
                  fillColor={item.completed ? "blue" : "#FF6347"} // Green when checked, red when unchecked
                  unfillColor="#FFFFFF" // Background color when unchecked
                  onPress={() => toggleTaskCompletion(item)} // Call toggle function
                />

                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            )}
          />
        </ScrollView>
      </View>

      {/*-------------------------------------PLUS ICON------------------------------------------ */}
      <TouchableOpacity
        style={styles.viewTask}
        onPress={() => {
          setModalVisible(true);
          //console.log(items);
        }}
      >
        <Icon name="plus" size={30} color="white" family="FontAwesome" />
      </TouchableOpacity>

      {/*-------------------------------------CREATION CHOICE VIEW------------------------------------------ */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.exitButton} onPress={closeModal}>
              <Icon name="close" size={30} color="#fff" family="FontAwesome" />
            </TouchableOpacity>
            {/* Event Icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={openEventModal}
            >
              <Icon
                name="calendar"
                type="material"
                size={40}
                color="#fff"
                family="FontAwesome"
              />
              <Text style={styles.iconLabel}>Event</Text>
            </TouchableOpacity>

            {/* Task Icon */}
            <TouchableOpacity style={styles.iconButton} onPress={openTaskModal}>
              <Icon
                name="check-circle-o"
                type="material"
                size={40}
                color="#fff"
                family="FontAwesome"
              />
              <Text style={styles.iconLabel}>Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*-------------------------------------EVENT CREATOR MODAL------------------------------------------ */}
      <Modal visible={isEventModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Event</Text>

          {/* Title Input */}
          <TextInput
            placeholder="Title"
            value={newEvent.title}
            onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            style={styles.input}
          />

          {/* Description Input */}
          <TextInput
            placeholder="Description"
            value={newEvent.description}
            onChangeText={(text) =>
              setNewEvent({ ...newEvent, description: text })
            }
            style={styles.input}
          />

          {/* Select From Date and Time Input */}
          <TouchableOpacity onPress={showFromDatePicker}>
            <TextInput
              placeholder="Select From Date and Time"
              value={
                newEvent.startDate
                  ? moment(newEvent.startDate).format("MMMM Do YYYY, h:mm A")
                  : "bla"
              }
              style={styles.input}
              editable={false} // To prevent direct editing
              //onFocus={showFromDatePicker} // Show picker when TextInput gains focus
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isFromDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirmFrom}
            onCancel={hideFromDatePicker}
          />

          {/* Select To Date and Time Input */}
          <TouchableOpacity onPress={!isAllDay ? showToDatePicker : null}>
            <TextInput
              placeholder="Select To Date and Time"
              value={
                newEvent.endDate
                  ? moment(newEvent.endDate).format("MMMM Do YYYY, h:mm A")
                  : ""
              }
              style={styles.input}
              editable={false}
              //editable={!isAllDay} // Disable when All Day is active
            />
          </TouchableOpacity>
          {!isAllDay && (
            <DateTimePickerModal
              isVisible={isToDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirmTo}
              onCancel={hideToDatePicker}
            />
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Switch
              value={isAllDay}
              onValueChange={(value) => {
                setIsAllDay(value);
                if (value && newEvent.startDate) {
                  // Set the To date to the end of the selected From date
                  setNewEvent((prevEvent) => ({
                    ...prevEvent,
                    endDate: moment(prevEvent.startDate).endOf("day").toDate(),
                  }));
                }
              }}
            />
            <Text>All Day</Text>
          </View>
          {/* Type of Property (info) */}
          <Text style={styles.label}>Type of Event</Text>
          <RNPickerSelect
            value={newEvent?.type}
            //useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: styles.pickerStyle,
              inputAndroid: styles.pickerStyle,
            }}
            onValueChange={(itemValue) =>
              setNewEvent({
                ...newEvent,
                type: itemValue,
              })
            }
            items={[
              { label: "Test", value: "Test" },
              { label: "Submission", value: "Submission" },
              { label: "Study session", value: "Study" },
              { label: "Birthday", value: "Birthday" },
              { label: "Any", value: "Any" },
            ]}
          />
          {/* Repeat Options */}
          <Text style={styles.label}>Repeat</Text>
          <RNPickerSelect
            value={newEvent.repeat}
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: styles.pickerStyle,
              inputAndroid: styles.pickerStyle,
            }}
            onValueChange={(itemValue) =>
              setNewEvent({ ...newEvent, repeat: itemValue })
            }
            items={[
              { label: "Does not repeat", value: "does not repeat" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
          />
          {/* Repeat Count Input 
          // Show this input only when repeat is not 'does not repeat' or
          'custom'*/}
          {newEvent.repeat !== "does not repeat" && (
            <>
              <Text style={styles.label}>Repetition Count</Text>
              <TextInput
                placeholder="Number of repetitions"
                value={newEvent.repeatCount}
                onChangeText={(text) =>
                  setNewEvent({ ...newEvent, repeatCount: parseInt(text) })
                }
                keyboardType="numeric"
                style={styles.input}
              />
            </>
          )}
          {/* Save Button */}
          <Button title="Save Event" onPress={saveEvent} />
          {/* Close Modal */}
          <Button title="Close" onPress={() => setEventModalVisible(false)} />
        </View>
      </Modal>

      {/* ------------------------------Task Creator Modal ------------------------------------ */}
      <Modal visible={isTaskModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Task</Text>
          <TextInput
            placeholder="Title"
            value={newTask.title}
            onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={newTask.description}
            onChangeText={(text) =>
              setNewTask({ ...newTask, description: text })
            }
            style={styles.input}
          />
          {/* Select From Date and Time Input */}
          <TouchableOpacity onPress={showTaskDatePicker}>
            <TextInput
              placeholder="Select From Date and Time"
              value={
                newTask.startDate
                  ? moment(newTask.startDate).format("MMMM Do YYYY, h:mm A")
                  : ""
              }
              style={styles.input}
              editable={false} // To prevent direct editing
              onFocus={showTaskDatePicker} // Show picker when TextInput gains focus
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTaskDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirmTask}
            onCancel={hideTaskDatePicker}
          />
          {/* Date and Time Picker */}

          {/* )Repeat Options */}
          {/* <RNPickerSelect
            value={newTask.repeat}
            useNativeAndroidPickerStyle={false}
            //placeholderTextColor={colors.BLACK}
            style={{
              inputIOS: styles.pickerStyle,
              placeholder: {
                color: "black",
              },
              inputAndroid: styles.pickerStyle,
            }}
            onValueChange={(itemValue) =>
              setNewTask({ ...newTask, repeat: itemValue })
            }
            items={[
              { label: "Does not repeat", value: "does not repeat" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
          />
          {newTask.repeat !== "does not repeat" && (
            <>
              <Text style={styles.label}>Repetition Count</Text>
              <TextInput
                placeholder="Number of repetitions"
                value={newEvent.repeatCount?.toString() || ""}
                onChangeText={(text) =>
                  setNewEvent({ ...newEvent, repeatCount: parseInt(text) })
                }
                keyboardType="numeric"
                style={styles.input}
              />
            </>
          )} */}
          <Button title="Save Task" onPress={saveTask} />
          <Button title="Close" onPress={() => setTaskModalVisible(false)} />
        </View>
      </Modal>

      <NavBar />
    </KeyboardAvoidingView>
  );
}

/*-------------------------------------STYLING------------------------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  calendarContainer: {
    height: "50%",
    borderWidth: 1,
    borderColor: "black",
    margin: 10,
    marginTop: 0,
  },
  checkboxContainer: {
    flexDirection: "row", // Align items in a row
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  Imagecon: {
    alignContent: "flex-end",
    justifyContent: "flex-end",
  },
  Image: {
    height: 75,
    width: 75,
    borderRadius: 50,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
    padding: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconButton: {
    margin: 10,
    alignItems: "center",
  },
  iconLabel: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  modalContent: { padding: 20, justifyContent: "center", alignItems: "center" },
  modalTitle: { fontSize: 20, marginBottom: 10 },
  input: { borderBottomWidth: 1, marginVertical: 10, width: "80%", padding: 5 },
  viewTask: {
    position: "absolute",
    bottom: 40,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: "#009ad8",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#009ad8",
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  Time: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "flex-start",
  },
  timeText: {
    fontSize: 17,
    fontWeight: "300",
    marginBottom: 10,
    color: "grey",
  },
  BookingNameText: {
    fontSize: 22,
    fontWeight: "300",
    marginBottom: 5,
  },
  BookingDescriptionText: {
    fontSize: 15,
    fontWeight: "300",
    marginBottom: 10,
    color: "#ff0000",
  },
  Imageplus: {
    height: 30,
    width: 30,
  },
  Bookingoffer: { fontSize: 15, marginBottom: 10 },
  StatusStrip: {
    height: 130,
    width: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  viewTask: {
    position: "absolute",
    bottom: 40,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: "#009ad8",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#009ad8",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  //styles for displaying todo lists
  scrollView: {
    height: 250,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});
