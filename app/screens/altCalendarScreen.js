import React, { useState, useEffect } from "react";
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

  // Sample data for homework/tasks
  const [tasks, setTasks] = useState([
    { id: "1", title: "Math Assignment", dueDate: "Oct 25", completed: true },
    { id: "2", title: "Science Project", dueDate: "Oct 27" },
    { id: "3", title: "History Essay", dueDate: "Oct 28" },
    { id: "4", title: "History Essay", dueDate: "Oct 28" },
    { id: "5", title: "History Essay", dueDate: "Oct 28" },
  ]);

  const toggleHomeworkVisibility = () => {
    setShowHomework(!showHomework);
  };

  //state for adding a new event to calendar, these are the default settings
  const [newEvent, setNewEvent] = useState({
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
    id: 1, //ID is required to check task as complete which ticking checkbox
    title: "",
    description: "",
    allDay: false,
    date: new Date(), //task only has a start date. it doesnt span accross a time period. like todo list
    repeat: "does not repeat",
    repeatCount: 1,
    completed: false,
  });

  //once all day is toggled, add event's end date should be set to end of that day and input field should set to not editable
  const toggleAllDay = () => {
    setNewEvent((prev) => ({ ...prev, allDay: !prev.allDay }));
  };

  const showTaskDatePicker = () => {
    setTaskDatePickerVisibility(true);
  };

  const hideTaskDatePicker = () => {
    setTaskDatePickerVisibility(false);
  };

  const handleConfirmTask = (date) => {
    setNewEvent({
      ...newEvent,
      startDate: date,
      // Ensure end date is after start date
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

  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };

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

  const showToDatePicker = () => {
    console.log("from date: ", newEvent.startDate);
    setToDatePickerVisibility(true);
  };

  const hideToDatePicker = () => {
    setToDatePickerVisibility(false);
  };

  //set events end date
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
  //functions

  //i don't think this is necessary, it is mainly used for the fake data set on this page
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
  let data = [
    {
      //our events won't have date. startdate & enddate both carrt time with them. see the event const line 56
      date: "2024-10-26",
      title: "Mathhhh Exam",
      description: "Writing Math Exam worth 50% sub min 45%",
      allDay: false,
      StartTime: moment(timeToString("12:00"), "HH:mm"),
      EndTime: moment(timeToString("12:00"), "HH:mm").add(1, "hour"),
      type: "Test",
      repeat: "does not repeat",
      repeatCount: 1,
    },
    {
      date: "2024-10-25",
      title: "CPUT Fun Day",
      description: "Be ready for a day full of fun",
      StartTime: moment(timeToString("12:45"), "HH:mm"),
      EndTime: moment(timeToString("12:45"), "HH:mm").add(1, "hour"),
      type: "Any",
    },
    {
      date: "2024-10-27",
      title: "Write Up due",
      description: "You have a excel spreadsheet due for communiction",
      StartTime: moment(timeToString("23:45"), "HH:mm"),
      EndTime: moment(timeToString("23:45"), "HH:mm").add(1, "hour"),
      type: "Submission",
    },
    {
      date: "2024-10-29",
      title: "Physics Test",
      description: "Small test",
      StartTime: moment("08:00").format("HH:mm"),
      EndTime: moment("08:00").add(1, "hour").format("HH:mm"),
      type: "Test",
    },
    {
      date: "2024-10-1",
      title: "Workers Study",
      description: "Get 35% off all food items this day",
      StartTime: moment("09:00").format("HH:mm"),
      EndTime: moment("09:00").add(1, "hour").format("HH:mm"),
      type: "Study",
    },
    {
      date: "2024-10-12",
      title: "Workers FavDay",
      description: "Get 35% off all food items this day",
      StartTime: moment("09:00").format("HH:mm"),
      EndTime: moment("09:00").add(1, "hour").format("HH:mm"),
      type: "Any",
    },
  ];

  //i think this was supposed to load the events & tasks in the month being shown on calendar,
  //so when you move to new month new events and tasks display
  loadItemsForMonth = (month) => {
    console.log("trigger items loading");
  };

  // set dotmarking on calendar
  const formattedEvents =
    //if data is true and data is an array and data array>0
    data && Array.isArray(data) && data.length > 0
      ? //run through all of it and set dot colour according to the type of event
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
        }, {})
      : console.log("data is not array");

  // Loading items for the calendar
  const loadItems = (day) => {
    //day is either current day or day selected on calendar
    const items = {}; // Temporary object to hold events and tasks

    setTimeout(() => {
      // Loop through a range of dates (-15 days to +85 days from the current date)
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000; // Calculate date offsets
        const strTime = timeToString(time); // Convert timestamp to 'YYYY-MM-DD' string

        // Ensure that items[strTime] is initialized as an empty array
        if (!items[strTime]) {
          items[strTime] = [];
        }

        // Add events from 'data' to the items object if it is within date range
        data.forEach((event) => {
          if (event.date === strTime) {
            items[strTime].push({
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
          if (task.date === strTime) {
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
          {/* <Card>
            <Card.Content> */}
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
          {/* </Card.Content>
          </Card> */}
        </TouchableOpacity>
      );
    }
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

  // Function to generate repeated events
  function generateRepeatedEvents(newEvent) {
    const events = [];
    const startDate = moment(newEvent.startDate); // Use startDate for initial date of event
    let repeatCount = 1;

    if (newEvent.repeat === "does not repeat") {
      events.push(newEvent); // Push the event as-is to array
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
      //let nextEnd

      switch (newEvent.repeat) {
        //if daily then add repeat count number to days etc.
        case "daily":
          nextDate = startDate.clone().add(i, "days");
          //nextEnd = startDate.clone().add(i, "days");
          break;
        case "weekly":
          nextDate = startDate.clone().add(i, "weeks");
          break;
        case "monthly":
          nextDate = startDate.clone().add(i, "months");
          break;
        default:
          nextDate = startDate;
      }
      //change next event startDate to new date set by repeat count, this should be formatted with time as well "format("YYYY-MM-DD HH:mm")"
      nextEvent.startDate = nextDate.format("YYYY-MM-DD");
      //end date should be set to prev endDate + same amo of repeat count just to keep enddate time spacing as well.
      //nextEvent.endDate = nextEnd.format("YYYY-MM-DD HH:mm")
      nextEvent.endDate = nextEvent.startDate; // Keep this for simplicity, adjust as needed
      events.push(nextEvent);
    }

    return events;
  }

  const handleAddEvent = (newEvent) => {
    const repeatedEvents = generateRepeatedEvents(newEvent); //returns array of events
    console.log("repeated events list: ", repeatedEvents);
    // Update state only once with new events
    //setEvents((prevEvents) => [...prevEvents, ...repeatedEvents]);
    data.push(repeatedEvents); //add array of new events to current array

    // Update items for calendar rendering to display new events to calendar
    const updatedItems = { ...items };
    repeatedEvents.forEach((event) => {
      const dateKey = event.startDate; // Ensure this matches your calendar's expected format
      if (!updatedItems[dateKey]) {
        updatedItems[dateKey] = [];
      }
      updatedItems[dateKey].push({
        title: event.title,
        description: event.description,
        StartTime: event.StartTime,
        EndTime: event.EndTime,
        type: event.type,
      });
    });

    setItems(updatedItems); // Set the updated items once
    data.push(updatedItems);
  };

  // Function to save new events to events array
  const saveEvent = () => {
    const newEventEntry = {
      title: newEvent.title,
      description: newEvent.description,
      startDate: moment(newEvent.startDate).format("YYYY-MM-DD"),
      endDate: moment(newEvent.endDate).format("YYYY-MM-DD"),
      type: newEvent.type,
      repeat: newEvent.repeat,
      repeatCount: newEvent.repeatCount || 1,
    };

    console.log("Saving new event:", newEventEntry); // Debug log
    handleAddEvent(newEventEntry); // renders events to calendar and generates repeated events
    setEventModalVisible(false); // Close modal after saving
  };

  const saveTask = () => {
    const newTaskEntry = {
      title: newTask.title,
      description: newTask.description,
      startDate: newTask.startDate,
      repeat: newTask.repeat,
      completed: newTask.completed, // Save the completed state
    };
    setTasks((prevTasks) => [...prevTasks, newTaskEntry]);
    setTaskModalVisible(false);
  };

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

  const toggleTaskCompletion = (task) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* <Text style={styles.title}>CALENDAR</Text> */}
      <View style={styles.calendarContainer}>
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          selected={new Date()}
          renderItem={renderItem}
          markedDates={formattedEvents}
          onDayPress={(day) => {
            const event = data.find((event) => event.date === day.dateString);
            if (event) {
              alert(`${event.title}: ${event.type}`);
            }
          }}
        />
      </View>

      <View>
        <Text style={styles.title}>TO DO LIST</Text>
        <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.checkboxContainer}>
                <BouncyCheckbox
                  isChecked={item.completed} // Use isChecked instead of value
                  fillColor={item.completed ? "blue" : "#FF6347"} // Green when checked, red when unchecked
                  unfillColor="#FFFFFF" // Background color when unchecked
                  onPress={() => toggleTaskCompletion(item)} // Call toggle function
                />
                <View style={styles.item}>
                  <Text style={styles.itemText}>{item.title}</Text>
                  <Text style={styles.itemText}>{item.dueDate}</Text>
                </View>
              </View>
            )}
          />
        </ScrollView>
      </View>

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

      {/* Add Event Modal */}
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
                  : ""
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
                value={newEvent.repeatCount?.toString() || ""}
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

      {/* Task Modal */}
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
          <RNPickerSelect
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
          )}
          <Button title="Save Task" onPress={saveTask} />
          <Button title="Close" onPress={() => setTaskModalVisible(false)} />
        </View>
      </Modal>

      {/* Plus Button to Open Modal */}
      <TouchableOpacity
        style={styles.viewTask}
        onPress={() => {
          setModalVisible(true);
          //console.log(items);
        }}
      >
        <Icon name="plus" size={30} color="white" family="FontAwesome" />
      </TouchableOpacity>
      <NavBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  calendarContainer: {
    height: "60%",
    borderWidth: 1,
    borderColor: "cyan",
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
