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
} from "react-native";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "../../components/Icon";

import { Card } from "react-native-paper";
import { Agenda } from "react-native-calendars";

export default function BrokerCalendar({ navigation }) {
  const [items, setItems] = useState({});
  const [isModalVisible, setModalVisible] = useState(false); // State to handle modal visibility
  const [isTaskModalVisible, setTaskModalVisible] = useState(false); // State to handle modal visibility
  const [isEventModalVisible, setEventModalVisible] = useState(false); // State to handle modal visibility
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    allDay: false,
    startDate: new Date(),
    endDate: moment().add(1, "hour").toDate(),
    type: "Relaxing",
    repeat: "does not repeat",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    allDay: false,
    date: new Date(),
    repeat: "does not repeat",
  });
  const toggleAllDay = () => {
    setNewEvent((prev) => ({ ...prev, allDay: !prev.allDay }));
  };

  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };

  const handleConfirmFrom = (date) => {
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

  const showToDatePicker = () => {
    console.log("from date: ", newEvent.startDate);
    setToDatePickerVisibility(true);
  };

  const hideToDatePicker = () => {
    setToDatePickerVisibility(false);
  };

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

  let data = [
    {
      date: "2024-10-26",
      title: "Mathhhh Exam",
      description: "Writing Math Exam worth 50% sub min 45%",
      StartTime: moment(timeToString("12:00"), "HH:mm"),
      EndTime: moment(timeToString("12:00"), "HH:mm").add(1, "hour"),
      type: "Test",
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

  loadItemsForMonth = (month) => {
    console.log("trigger items loading");
  };

  // Ensure data is defined and not empty before running reduce
  const formattedEvents =
    data && Array.isArray(data) && data.length > 0
      ? data.reduce((acc, current) => {
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

          acc[current.date] = {
            marked: true,
            dotColor: dotColor,
            activeOpacity: 0.5,
            title: current.title,
            description: current.description,
            StartTime: current.StartTime,
            EndTime: current.EndTime,
          };
          return acc;
        }, {})
      : console.log("data is not array");
  // Return an empty object if data is undefined or empty

  // Loading items for the calendar
  const loadItems = (day) => {
    const items = {}; // Temporary object to hold the events
    setTimeout(() => {
      // Loop through a range of dates (for example: -15 days to +85 days from the current date)
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000; // Calculate date offsets
        const strTime = timeToString(time); // Convert timestamp to 'YYYY-MM-DD' string

        // Ensure that items[strTime] is initialized as an empty array if not already populated
        if (!items[strTime]) {
          items[strTime] = [];
        }

        // Add events from data to the items object
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
      }

      // Update the state with the newly created items object
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });

      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={{ marginRight: 10, marginTop: 17 }}
        onPress={() =>
          navigation.navigate("PullForwardDetails", {
            data: item,
          })
        }
      >
        <Card>
          <Card.Content>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={[styles.StatusStrip, { backgroundColor: "#009ad8" }]}
              />
              <View style={{ flex: 0.7 }}>
                <View style={styles.Time}>
                  <Text style={styles.timeText}>
                    {item?.StartTime} - {item?.EndTime}
                    {/* {item?.pullforward?.pullforward} */}
                    {/* <Icon
                      size={20}
                      name="forwardburger"
                      family="MaterialCommunityIcons"
                      // style={styles.inputIcons}
                    />
                    {item?.pullforward?.pullDate} */}
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
  };

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
    const startDate = moment(newEvent.startDate); // Use startDate for initial date
    let repeatCount = 1;

    if (newEvent.repeat === "does not repeat") {
      events.push(newEvent); // Push the event as-is
      return events;
    }

    if (newEvent.repeat === "daily") {
      repeatCount = 14;
    } else if (newEvent.repeat === "weekly") {
      repeatCount = 4;
    } else if (newEvent.repeat === "monthly") {
      repeatCount = 3;
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

    for (let i = 0; i < repeatCount; i++) {
      let nextEvent = { ...newEvent };
      let nextDate;

      switch (newEvent.repeat) {
        case "daily":
          nextDate = startDate.clone().add(i, "days");
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

      nextEvent.startDate = nextDate.format("YYYY-MM-DD");
      nextEvent.endDate = nextEvent.startDate; // Keep this for simplicity, adjust as needed
      events.push(nextEvent);
    }

    return events;
  }

  const handleAddEvent = (newEvent) => {
    const repeatedEvents = generateRepeatedEvents(newEvent);
    console.log("repeated events list: ", repeatedEvents);
    // Update state only once with new events
    setEvents((prevEvents) => [...prevEvents, ...repeatedEvents]);

    // Update items for calendar rendering
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
        info: event.type,
      });
    });

    setItems(updatedItems); // Set the updated items once
    data.push(updatedItems);
  };

  // Function to save new events
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
    handleAddEvent(newEventEntry);
    setEventModalVisible(false); // Close modal after saving
  };

  const saveTask = () => {
    const dateKey = timeToString(newTask.date);
    if (items[dateKey]) {
      items[dateKey].push({
        title: newTask.title,
        description: newTask.description,
        StartTime: moment(newTask.date).format("HH:mm"),
        type: "Task",
      });
    } else {
      items[dateKey] = [
        {
          title: newTask.title,
          description: newTask.description,
          StartTime: moment(newTask.date).format("HH:mm"),
          type: "Task",
        },
      ];
    }
    setItems({ ...items });
    setTaskModalVisible(false);
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
          {/* Date Input */}
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
              onFocus={showFromDatePicker} // Show picker when TextInput gains focus
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isFromDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirmFrom}
            onCancel={hideFromDatePicker}
          />
          {/* Select To Date and Time Input */}
          <TouchableOpacity onPress={showToDatePicker}>
            <TextInput
              placeholder="Select To Date and Time"
              value={
                newEvent.endDate
                  ? moment(newEvent.endDate).format("MMMM Do YYYY, h:mm A")
                  : ""
              }
              style={styles.input}
              editable={false} // To prevent direct editing
              onFocus={showToDatePicker} // Show picker when TextInput gains focus
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isToDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirmTo}
            onCancel={hideToDatePicker}
          />
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
          {/* All Day Toggle */}
          <View style={styles.row}>
            <Text>All Day</Text>
            <Switch
              value={newTask.allDay}
              onValueChange={() =>
                setNewTask((prev) => ({ ...prev, allDay: !prev.allDay }))
              }
            />
          </View>
          {/* Date and Time Picker */}
          {/* !newTask.allDay && ( */}
          {/* <DateTimePicker
            date={new Date(newTask.date)}
            mode="single"
            is24Hour={true}
            display="default"
            onChange={(date) => setNewTask({ ...newTask, date })}
          /> */}
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
});
