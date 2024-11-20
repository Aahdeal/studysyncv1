import {StyleSheet} from "react-native";
import { Dimensions } from "react-native";
import { useCustomFonts } from "../../constants/fonts";


const createStyles = (colours) => {
    const fontsLoaded = useCustomFonts();
    return styles = StyleSheet.create(
    {
        titleFont: {
            fontFamily: "Graduate_400Regular",
            fontSize: 40,
            textAlign: "center",
            color: colours.text, // Change this color to suit your app
        },
        container: {
            flex: 1,
            backgroundColor: colours.background,
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 40,
            paddingHorizontal: 20,
          },
          profileImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colours.paleBlue,
            marginBottom: 25,
            borderWidth: 2,
            borderColor: colours.paleBlue,
          },
          usernameInput: {
            borderWidth: 1,
            borderColor: colours.darkBlue,
            padding: 10,
            width: "90%",
            marginBottom: 25,
            textAlign: "center",
            backgroundColor: colours.paleBlue,
            borderRadius: 8,
            color: colours.text,
            fontSize: 16,
          },
          options: {
            width: "100%",
            marginTop: 30,
          },
          optionText: {
            fontSize: 18,
            color: colours.text,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colours.paleBlue,
            marginBottom: 10,
          },
          buttonsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 20,
          },
          button: {
            flex: 1,
            marginHorizontal: 5,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            backgroundColor: colours.paleBlue,
          },
          selectedButton: {
            backgroundColor: colours.lightPink,
          },
          buttonText: {
            color: colours.text,
            fontWeight: "bold",
            fontSize: 16,
          },
          logoutButton: {
            marginTop: 40,
            width: "70%",
          },
        container: {
            flex: 1,
            padding: 20,
            alignItems: "center",
            backgroundColor: colours.background,
            width: "100%",
        },
        noTasksText: {
            fontSize: 16,
            color: colours.text,
            textAlign: "center",
            marginTop: 20,
        },
        taskContainer: {
            padding: 15,
            backgroundColor: "#FFF",
            borderRadius: 10,
            marginBottom: 10,
            elevation: 2,
        },
        taskText: {
            fontSize: 16,
            color: colours.text,
        },
        completedTaskContainer: {
            padding: 15,
            backgroundColor: colours.beige, // Light gray background for completed tasks
            borderRadius: 10,
            marginBottom: 10,
            elevation: 2,
        },
        completedTaskText: {
            fontSize: 16,
            color: colours.text,
            textDecorationLine: "line-through", // Strikethrough for completed tasks
        },
        linkText: {
            fontSize: 16,
            color: colours.text, // Link color for "Show Completed Tasks" button
            marginTop: 15,
            textAlign: "center",
        },
        toDoListContainer: {
            width: "90%",
            height: "35%",
            padding: "10",
        },
        calendarContainer: {
            width: "90%",
            height: "40%",
            borderWidth: 1,
            borderColor: "#add8e6",
            borderRadius: 10,
            padding: 10,
            backgroundColor: colours.paleBlue, // Main background color of the agenda
            calendarBackground: colours.paleBlue, // Background color for the calendar itself
            textSectionTitleColor: "#007BFF", // Color for the section title (month/year)
            selectedDayBackgroundColor: "#00adf5", // Background color for selected day
            selectedDayTextColor: "#ffffff", // Text color for the selected day
            todayTextColor: colours.darkBlue, // Color for today's date
            dayTextColor: "#2d4150", // Color for regular days
            textDisabledColor: "#dd99ee", // Color for disabled dates
            monthTextColor: colours.darkBlue, // Color for the month name
            textDayFontFamily: "Avenir", // Font family for day text
            textMonthFontFamily: "Avenir", // Font family for month text
            textDayFontWeight: "bold", // Font weight for day text
            textMonthFontWeight: "bold", // Font weight for month text
            textDayFontSize: 16, // Font size for day text
            textMonthFontSize: 18, // Font size for month text
            textSectionTitleFontSize: 18, // Font size for section titles
        },
        modalBackgroundA: {
            flex: 1,
            backgroundColor: colours.paleBlue,
            justifyContent: "center",
            width: " 80%",
            marginVertical: "10%",
            left: "10%",
            borderRadius: 15,
        },
        modalContentA: {
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
            width: " 80%",
        },
        year: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#4a4a4a",
            textAlign: "center",
            marginVertical: 10,
        },
        checkboxContainer: {
            flexDirection: "row", // Align items in a row
            // marginVertical: 15, // Space above and below checkboxes
            padding: 10,
        },
        title: {
            fontSize: 30, // Larger title for better visibility
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            color: colours.text, // Change color to match calendar theme
        },
        Imagecon: {
            alignContent: "flex-end",
            justifyContent: "flex-end",
        },
        Image: {
            height: 90, // Slightly larger image
            width: 90,
            borderRadius: 45, // Make it circular
            borderWidth: 2,
            borderColor: colours.darkBlue,
            marginBottom: 10,
        },
        modalBackground: {
            flex: 1,
            backgroundColor: "#ffe4e1",
            justifyContent: "center",
            width: " 80%",
            marginVertical: "10%",
            left: "10%",
            borderRadius: 15,
            shadowColor: colours.beige,
            shadowOffset: { width: 0, height: 9 },
            shadowRadius: 30,
            shadowOpacity: 0.5,
        },
        iconContainer: {
            width: "98%",
            height: "100%",
            borderRadius: 15,
            padding: 20,
            alignItems: "flex-end",
        },
        iconButton: {
            position: "fixed",
            marginBottom: 10,
            alignItems: "center",
            top: 490,
            left: 70,
        },
        iconLabel: {
            color: colours.text, // Matching the theme color
            fontSize: 16,
            marginTop: 5,
            fontWeight: "bold",
        },
        exitButton: {
            position: "absolute",
            top: 10,
            left: 20,
            zIndex: 1,
        },
        modalContent: {
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffe4e1",
        },
        modalTitle: {
            fontSize: 24, // Larger modal title
            marginBottom: 20,
            color: colours.text,
        },
        input: {
            borderBottomWidth: 1,
            marginVertical: 15,
            width: "80%",
            padding: 10,
            borderBottomColor: colours.paleBlue, // Change border color to match the theme
        },
        viewTask: {
            position: "absolute",
            bottom: 40,
            right: 17,
            height: 70,
            width: 70,
            backgroundColor: "#007BFF", // Consistent color with the theme
            borderRadius: 35,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#007BFF",
            shadowOffset: { width: 0, height: 9 },
            shadowRadius: 30,
            shadowOpacity: 0.5,
            elevation: 7,
            zIndex: 999,
            marginBottom: 20, // Add this line to create space below the task box
        },
        Time: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "flex-start",
        },
        timeText: {
            fontSize: 18,
            fontWeight: "400",
            marginBottom: 10,
            color: colours.text, // Theme color
        },
        BookingNameText: {
            fontSize: 26, // Slightly larger for emphasis
            fontWeight: "600", // Semi-bold for better visibility
            marginBottom: 5,
            color: colours.text,
        },
        BookingDescriptionText: {
            fontSize: 16, // Increased for better readability
            fontWeight: "300",
            marginBottom: 10,
            color: colours.text,
        },
        Imageplus: {
            height: 30,
            width: 30,
        },
        Bookingoffer: {
            fontSize: 16, // Adjusted for consistency
            marginBottom: 10,
        },
        StatusStrip: {
            height: 60,
            width: 5,
            marginRight: 10,
            borderRadius: 5,
            backgroundColor: colours.beige, // Visual connection to the theme
        },
        scrollView: {
            flex: 1, // Take remaining space
            backgroundColor: colours.lightPink, // Change to white for contrast
            borderRadius: 15,
            padding: 20, // Increased padding for better spacing
            elevation: 3, // Add subtle shadow for depth
        },
        item: {
            padding: 15, // Increased padding for a more spacious item
            marginVertical: 15, // Increase the vertical margin between items
            borderWidth: 1, // Add a border for better separation
            borderColor: colours.beige, // Border color to match the theme
            backgroundColor: colours.paleBlue, // Keep background color for items
            borderRadius: 12, // Rounded corners for items
            elevation: 2, // Add a subtle shadow effect
        },
        itemText: {
            fontSize: 18,
            color: colours.text,
        },
        
        buttonContainer: {
            backgroundColor: colours.darkBlue,
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 8,
            alignItems: "center",
            marginVertical: 10,
            elevation: 2,
        },
        // Close button container
        closeButtonContainer: {
            backgroundColor: colours.paleBlue,
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 8,
            alignItems: "center",
            marginVertical: 10,
            elevation: 2,
        },
        // Button text style
        buttonText: {
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "bold",
        },
        optionsIcon: 
            {
                fontSize: 20,
                color: colours.text,
                position: "relative",
                left: 330,
                bottom: 35,
            },
            addDeckModal: {
                position: "absolute",
                bottom: 90,
                right: 17,
                height: 60,
                width: 60,
                backgroundColor: "#007BFF",
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
            modalContainer: { 
                backgroundColor: "#ccbe89",
                borderRadius: 15,       // Adds rounded corners
                padding: 15,            // Adds internal padding for spacing
                shadowColor: "#000",    // Adds shadow for a more polished look
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 5,  
                width: "90%",               // Sets modal width to 80% of the screen
                position: "absolute",         // Positions the modal absolutely
                top: "30%",                   // Moves the modal to the vertical center
                transform: [{ translateY: -100 }], // Adjusts position to truly center the modal
                alignSelf: "center",        // Centers the modal horizontally
            },
            modalTitle:{
                fontSize: 26,                 // Large font size for emphasis
                fontWeight: "bold",
                textAlign: "center",
                color: colours.text,             // Dark gray text color for contrast
                marginBottom: 20,             // Space below the title
                letterSpacing: 1,             // Adds slight spacing between letters
                textTransform: "uppercase",   // Converts text to uppercase for a clean look
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,          // Soft shadow for subtle depth
                shadowRadius: 1,
            },
            title: { 
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                color: colours.text, 
                marginBottom: 20,
            },
            navbarContainer: {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
            },
            deckContainer: {
                backgroundColor: "#aac3e8", 
                padding: 20,
                marginVertical: 10,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 5, // Android shadow
            },
            deckTitle: {
                position: "relative",
                top: 10,
                fontSize: 18,
                color: colours.text, // Darker gray for text
                fontWeight: "bold",
                textAlign: "center",
            },
            input: {
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                marginBottom: 10,
                paddingLeft: 10,
            },
            saveButton: {
                backgroundColor: "#aac3e8",
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
                alignItems: "center",
            },
            saveButtonText: {
                color: colours.text,
            },
            closeButton: {
                backgroundColor: "#aac3e8",      
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 4,
                width: '80%',
                alignSelf: "center",
            },
            closeButtonText: {
                color: colours.text,
            },
            emptyText: {
                textAlign: "center",
                marginTop: 20,
                fontSize: 16,
                color: colours.text,
            },
            addQuestionButton: {
                backgroundColor: "#ccbe89",
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
                alignItems: "center",
            },
            addQuestionButtonText: {
                color: colours.text,
            },

            addButton: {
                backgroundColor: "#aac3e8",      
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 4,
                width: '80%',
                alignSelf: "center"
            },
            containerQuiz: {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                backgroundColor: colours.background,
              },  
            quizContainer: {
                height: "60%",
                width: "90%",
                margin: 10,
                marginTop: 0,
                alignItems: "center",
                justifyContent: "center",
            },
            card: {
                backgroundColor: colours.paleBlue, // Light tan/beige color
                padding: 20,
                marginVertical: 10,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 5,
                flex: 1, // Make the card fill the available space
                alignItems: "center",
                justifyContent: "center",
                width: "85%",
            },
            cardText: {
                fontSize: 20,
                color: colours.text, // Darker gray for text
                fontWeight: "bold",
                textAlign: "center",
            },
            button: {
                marginTop: 20,
                backgroundColor: colours.darkBlue, // Darker gray button
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                margin: 10,
            },
            buttonText: {
                color: colours.text,
                fontSize: 16,
                textAlign: "center",
            },
            progressBar: {
                width: "90%",
                height: 10,
                marginVertical: 10,
                color: colours.paleBlue,
            },
            resetButton: {
                marginTop: 20,
                backgroundColor: colours.paleBlue, // Pastel blue theme color
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
                alignItems: "center",
            },
            exitButton: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 8,
                paddingHorizontal: 5,
                borderRadius: 5,
                position: "absolute",
                top: 20,
                left: 20,
            },
            startQuizButton: {
                backgroundColor: colours.darkBlue, // Use the dark blue color from your theme
                paddingVertical: 15, // Adjust padding for a more pronounced button
                paddingHorizontal: 25, // Adjust padding for a more pronounced button
                borderRadius: 10, // Slightly larger border radius for rounded corners
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: "#000", // Add shadow for a raised effect
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 5,
            },
            startQuizButtonText: {
                color: 'white', // Change to white for contrast
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: "Graduate_400Regular", // Use the Graduate font
                textAlign: 'center',
            },
            scrollContainer: {
                marginBottom: 30,
            },
            title: {
                fontSize: 28,
                fontFamily: 'Graduate',
                marginBottom: 15,
                textAlign: 'center',
                color: colours.text,
            },
            motivationalMessage: {
                marginVertical: 20,
                padding: 10,
                borderRadius: 8,
                backgroundColor: colours.lightgrey,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.5,
                elevation: 3,
            },
            motivation: {
                fontSize: 16,
                textAlign: 'center',
                color: colours.text,
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
                color: colours.darkBlue,
                fontFamily: 'Graduate',
            },
            chartStyle: {
                marginVertical: 8,
                borderRadius: 16,
            },
            listContainer: {
                marginTop: 20,
                width: "100%",
            },
            listView:{
                height: 150,
            },
            sectionHeading: {
                fontSize: 18,
                fontFamily: 'Graduate',
                color: colours.text,
                marginBottom: 10,
            },
            taskItem: {
                padding: 15,
                marginVertical: 5,
                borderRadius: 8,
                backgroundColor: colours.lightPink,
            },
            taskTitle: {
                fontSize: 16,
                fontFamily: 'Graduate',
                color: colours.text,
            },
            taskDueDate: {
                fontSize: 14,
                color: colours.text,
            },
            button: {
                backgroundColor: colours.paleBlue,
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 30,
                alignItems: "center",
                width: "50%",
            },
            buttonText: {
                color: "black", // Set text color here
                fontSize: 20,
                //fontWeight: "bold",
            },
            
            containerLogin: {
                //top: -50,
                flex: 1,
                justifyContent: "center",
                //padding: 20,
                //alignContent: "center",
                //width: "80%",
                //left: 40,
                alignItems: "center",
            },
            inputContainer: {
                flexDirection: "column",
                width: "70%",
                alignSelf: "center",
                position: "relative",
            },
            header: { top: 40, width: "100%", padding: 5 },
            title: {
                fontSize: 34,
                textAlign: "center",
                fontWeight: "",
            },
            input: {
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                marginBottom: 10,
                paddingHorizontal: 10,
                width: "100%",
                borderRadius: 8,
                fontSize: 15,
            },
            eyeIcon: {
                padding: 5, // Spacing around the eye icon
                left: 205,
                bottom: 48,
            },
            errorText: {
                color: colours.blushPink,
                margin: 10,
                textAlign: "center",
                fontSize: 15,
            },
            linkContainer: {
                flexDirection: "row",
                justifyContent: "center",
                margin: 10,
            },
            linkText: {
                color: colours.blushPink,
                textDecorationLine: "underline",
                fontSize: 15,
            },
            forgotPassword: {
                margin: 10,
                color: colours.text,
                textAlign: "center",
                textDecorationLine: "underline",
                fontSize: 15,
            },
            modalBackground: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
            },
            modalContainer: {
                width: 300,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
            },
            modalTitle: {
                fontSize: 20,
                marginBottom: 20,
            },
            button: {
                backgroundColor: colours.paleBlue,
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 30,
                alignItems: "center",
                width: "50%",
            },
            buttonText: {
                color: "black", // Set text color here
                fontSize: 20,
                //fontWeight: "bold",
            },
            containerLogin: {
                //top: -50,
                flex: 1,
                justifyContent: "center",
                //padding: 20,
                //alignContent: "center",
                //width: "80%",
                //left: 40,
                alignItems: "center",
            },
            inputContainer: {
                flexDirection: "column",
                width: "70%",
                alignSelf: "center",
                position: "relative",
            },
            header: { top: 40, width: "100%", padding: 5 },
            title: {
                fontSize: 34,
                textAlign: "center",
                fontWeight: "",
            },
            input: {
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                marginBottom: 10,
                paddingHorizontal: 10,
                width: "100%",
                borderRadius: 8,
                fontSize: 15,
            },
            eyeIcon: {
                padding: 5, // Spacing around the eye icon
                left: 205,
                bottom: 48,
            },
            errorText: {
                color: colours.blushPink,
                margin: 10,
                textAlign: "center",
                fontSize: 15,
            },
            linkContainer: {
                flexDirection: "row",
                justifyContent: "center",
                margin: 10,
            },
            linkText: {
                color: colours.blushPink,
                textDecorationLine: "underline",
                fontSize: 15,
            },
            forgotPassword: {
                margin: 10,
                color: colours.text,
                textAlign: "center",
                textDecorationLine: "underline",
                fontSize: 15,
            },
            modalBackground: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
            },
            modalContainer: {
                width: 300,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
            },
            modalTitle: {
                fontSize: 20,
                marginBottom: 20,
            },
            button: {
                backgroundColor: colours.lightPink,
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 30,
                alignItems: "center",
                width: "50%",
                alignSelf: "center",
            },
            buttonText: {
                color: "black", // Set text color here
                fontSize: 20,
                //fontWeight: "bold",
            },
            title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
            heading: {
                fontSize: 37,
                marginBottom: 20,
                textAlign: "center",
                color: colours.blushPink,
            },
            header: { top: -20, width: "100%", padding: 5 },
            inputContainer: {
                flexDirection: "column",
                position: "relative",
                width: "70%",
                alignSelf: "center",
            },
            input: {
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                marginBottom: 20,
                paddingHorizontal: 10,
                width: "100%",
                borderRadius: 8,
                fontSize: 15,
            },
            infoIcon: {
                fontSize: 18,
                right: -235,
                color: "blue",
                bottom: 77,
            },
            eyeIcon: {
                //padding: 5, // Spacing around the eye icon
                right: -205,
                bottom: 53,
            },
            errorText: {
                color: "red",
                marginBottom: 10,
                textAlign: "center",
            },
            linkContainer: {
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
            },
            linkText: {
                color: colours.paleBlue,
                textDecorationLine: "underline",
                fontSize: 15,
            },
            containerFlashcards: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: colours.background },
            navbarContainer: {
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 10,
                borderTopWidth: 1,
                borderColor: "#ddd",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: colours.background
              },
              navButton: {
                flex: 1,
                alignItems: "center",
              },
    }
    );
}

export default createStyles