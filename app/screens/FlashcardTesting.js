import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import colours from "../../constants/Colours";
import { Ionicons } from "@expo/vector-icons";

export default function FlashcardTesting({ route }) {
  const { item } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0); // Track current flashcard
  const [showAnswer, setShowAnswer] = useState(false); // Toggle between question and answer
  const [showInstructions, setShowInstructions] = useState(true);
  const [quizEnd, setQuizEnd] = useState(false);
  const [showCard, setShowCard] = useState(false); // Control card visibility
  const [score, setScore] = useState(0); // Track the number of correct answers

  const handleCardPress = () => {
    setShowAnswer(!showAnswer); // Flip the card
  };

  const handleNextCard = (isCorrect) => {
    // Update score if the answer is correct
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentIndex < item.questionList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false); // Reset to question side
    } else {
      setQuizEnd(true);
      setShowCard(false);
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

  const currentCard = item.questionList[currentIndex];
  //const progress = (currentIndex + 1) / item.questionList.length; // Calculate progress
  const progress = currentIndex / item.questionList.length;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      {showCard && (
        <Progress.Bar
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progress}
          color="#4B4B4B"
          style={styles.progressBar}
          width={null}
          height={"100%"}
          colour={colours.paleBlue}
          animated={true}
        />
      )}
      <View style={styles.calendarContainer}>
        {showInstructions && (
          <View>
            <Text>Instructions</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCardVisibility}
            >
              <Text style={styles.buttonText}>start quiz</Text>
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
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", padding: 5 }}>
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
  },
  card: {
    backgroundColor: "#D2B48C", // Light tan/beige color
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 20,
    color: "#4B4B4B", // Darker gray for text
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4B4B4B", // Darker gray button
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
    backgroundColor: "#8B0000", // Dark red for reset button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
