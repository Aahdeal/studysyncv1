import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import colours from "../../constants/Colours";
import { Ionicons } from "@expo/vector-icons";
import { update, ref, get } from "firebase/database";
import { database } from "../firebase";
import {useCustomFonts} from "../../constants/fonts.js"

export default function FlashcardTesting({ navigation, route, user }) {
  const { item } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0); // Track current flashcard
  const [showAnswer, setShowAnswer] = useState(false); // Toggle between question and answer
  const [showInstructions, setShowInstructions] = useState(true);
  const [quizEnd, setQuizEnd] = useState(false);
  const [showCard, setShowCard] = useState(false); // Control card visibility
  const [score, setScore] = useState(0); // Track the number of correct answers
  const [latestScore, setLatestScore] = useState(null);
  const fontsLoaded = useCustomFonts();

  const [randomizedList, setRandomizedList] = useState([]);

useEffect(() => {
  // Randomize the questions only once when the component mounts
  const shuffledList = item.questionList.slice().sort(() => Math.random() - 0.5);
  setRandomizedList(shuffledList); // Initialize progress at 0
}, [item.questionList]);

const currentCard = randomizedList[currentIndex];

  //update
  const handleUpdateScore = async (updatedScore) => {
    const userId = user.uid;
    const deckId = item.deckId.replace(".", ""); // Ensure valid Firebase path
    const deckRef = ref(database, `users/${userId}/flashcards/decks/${deckId}`);

    try {
      await update(deckRef, {
        lastScore: updatedScore,
      });
      console.log("Deck score updated successfully");
    } catch (error) {
      console.error("Error updating deck:", error);
    }
  };

  const handleCardPress = () => {
    setShowAnswer(!showAnswer); // Flip the card
  };

  const handleNextCard = (isCorrect) => {
    let newScore = score; // Local variable to track score changes immediately

    // Update score if the answer is correct
    if (isCorrect) {
      newScore += 1; // Increment the local score variable
      setScore(newScore); // Update the state
      console.log("Current score:", newScore); // Log the updated score immediately
    }

    if (currentIndex < item.questionList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false); // Reset to question side
    } else {
      setQuizEnd(true);
      setShowCard(false);
      console.log("Final score:", newScore);
      handleUpdateScore(newScore);
    }
  };

  const toggleCardVisibility = () => {
    setShowCard(!showCard); // Show/hide the card
    setShowInstructions(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setQuizEnd(false);
    setShowInstructions(true);
    setShowCard(false);
    setScore(0);
  };

  const endQuiz = () => {
    setQuizEnd(true);
    navigation.navigate("Flashcards");
  }

  const quitQuiz = () => {
    navigation.navigate("Flashcards")
  }

  //randomize the questions
  const progress = currentIndex / item.questionList.length;

  return (
    <View style={styles.container}>
      {/* Quit button */}
      <TouchableOpacity style={styles.exitButton} onPress={endQuiz}>
        <Ionicons name="close" size={40} color={colours.darkBlue} />
      </TouchableOpacity>
      {/* Progress bar */}
      {showCard && (
        <Progress.Bar
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progress}
          style={styles.progressBar}
          width={null}
          height={"100%"}
          color={colours.paleBlue}
          animated={true}
        />
      )}
      <View style={styles.calendarContainer}>
        {showInstructions && (
          <View>
            <TouchableOpacity
              style={styles.startQuizButton}
              onPress={toggleCardVisibility}
            >
              <Text style={styles.startQuizButtonText}>start quiz</Text>
            </TouchableOpacity>
          </View>
        )}

        {showCard && (
          <TouchableOpacity style={styles.card} onPress={handleCardPress}>
            <Text style={styles.cardText}>
              {showAnswer ? currentCard.answer : currentCard.List}
            </Text>
          </TouchableOpacity>
        )}
        {/* Display quiz results when the quiz ends */}
        {quizEnd && (
          <View style={styles.card}>
            <Text style={styles.cardText}>Quiz Finished!</Text>
            <Text style={styles.cardText}>
              Score: {score} / {item.questionList.length}
            </Text>
            <TouchableOpacity onPress={() => quitQuiz()}>
              <Text style={styles.buttonText}>Return to Flashcard Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-around", width: "100%" }}>
        <TouchableOpacity
          //   style={styles.button}
          onPress={() => handleNextCard(true)}
        >
          <Ionicons
            name={"checkmark"} // Change icon based on password visibility
            size={40}
            color={colours.lightPink}
          />
          <Text style={styles.buttonText}>I Know</Text>
        </TouchableOpacity>
        <TouchableOpacity
          //   style={styles.button}
          onPress={() => handleNextCard(false)}
        >
          <Ionicons
            name={"close"} // Change icon based on password visibility
            size={40}
            color={colours.lightPink}
            fontSize={"64px"}
          />
          <Text style={styles.buttonText}>I Don't Know</Text>
        </TouchableOpacity>
      </View>
      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Deck</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  calendarContainer: {
    height: "60%",
    width: "90%",
    borderWidth: 1,
    borderColor: "grey",
    margin: 10,
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colours.beige, // Light tan/beige color
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
    color: "#4B4B4B", // Darker gray for text
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
    color: "black",
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
    backgroundColor: colours.lightPink, // Use the light pink color for the button
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
  
});
