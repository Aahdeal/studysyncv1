// screens/FlashcardsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import NavBar from "../../components/NavBar";
import { ref, get, set, remove, update } from "firebase/database";
import { database } from "../firebase";
import Colors from '../../constants/Colours.js';
import { useFonts } from 'expo-font'; // Import useFonts hook from expo-font

export default function FlashcardsScreen({ navigation, user }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [selectedDeckId, setSelectedDeckId] = useState(null);

  const [decks, setDecks] = useState([]);
  const [questionList, setQuestionList] = useState([]);

  const [newDeck, setNewDeck] = useState({
    deckId: "",
    title: "",
    description: "",
    category: "",
    questionList: [],
    lastScore: 0,
  });

  const [newQuestion, setNewQuestion] = useState({
    qNum: 0,
    List: "",
    answer: "",
  });

  const handleDeckDownload = async () => {
    let userId = user.uid;
    const decksRef = ref(database, `users/${userId}/flashcards/decks`);

    try {
      const snapshot = await get(decksRef);
      if (snapshot.exists()) {
        const fetchedDecks = Object.values(snapshot.val());
        setDecks(fetchedDecks);
      } else {
        console.log("No decks found for user.");
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  const handleDeckUpload = async (deck) => {
    let userId = user.uid;
    let deckID = deck["deckId"].replace(".", "");

    await set(ref(database, "users/" + userId + "/flashcards/decks/" + deckID), deck)
      .then(() => {
        console.log("Deck added successfully");
      })
      .catch((error) => {
        console.error("Error uploading deck:", error);
      });
  };

  const handleUpdateDeck = async (updatedDeck) => {
    const userId = user.uid;
    const deckId = updatedDeck.deckId.replace(".", "");
    const deckRef = ref(database, `users/${userId}/flashcards/decks/${deckId}`);

    try {
      await update(deckRef, {
        title: updatedDeck.title,
        description: updatedDeck.description,
        category: updatedDeck.category,
        questionList: updatedDeck.questionList,
        lastScore: updatedDeck.lastScore,
      });
      console.log("Deck updated successfully");
    } catch (error) {
      console.error("Error updating deck:", error);
    }
  };

  const handleDeleteDeck = async (deckId) => {
    const userId = user.uid;
    const deckRef = ref(database, `users/${userId}/flashcards/decks/${deckId}`);

    try {
      await remove(deckRef);
      console.log("Deck deleted successfully");
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const saveDeck = () => {
    const newDeckEntry = {
      deckId: isEditing ? editingDeckId : new Date().toISOString(),
      title: newDeck.title,
      description: newDeck.description,
      category: newDeck.category,
      questionList: questionList,
      lastScore: 0,
    };

    if (newDeckEntry.title.trim()) {
      if (isEditing) {
        handleUpdateDeck(newDeckEntry);
        const updatedDecks = decks.map((deck) =>
          deck.deckId === editingDeckId ? newDeckEntry : deck
        );
        setDecks(updatedDecks);
        setIsEditing(false);
        setEditingDeckId(null);
      } else {
        handleDeckUpload(newDeckEntry);
        setDecks([...decks, newDeckEntry]);
      }
      setQuestionList([]); // Clear questions after saving deck
      setNewDeck({ // Reset the newDeck state
        deckId: "",
        title: "",
        description: "",
        category: "",
        questionList: [],
        lastScore: 0,
      });
      setModalVisible(false); // Close modal
    } else {
      Alert.alert("Error", "Deck title is required.");
    }
  };

  const saveQuestion = () => {
    const newQuestionEntry = {
      qNum: questionList.length,
      List: newQuestion.List,
      answer: newQuestion.answer,
    };
    setQuestionList([...questionList, newQuestionEntry]);
    setNewQuestion({ qNum: 0, List: "", answer: "" }); // Reset newQuestion
    setQuestionModalVisible(false);
  };

  const editDeck = (deckId) => {
    const deckToEdit = decks.find((deck) => deck.deckId === deckId);
    if (deckToEdit) {
      setQuestionList(deckToEdit.questionList);
      setNewDeck(deckToEdit);
      setIsEditing(true);
      setEditingDeckId(deckId);
      setModalVisible(true);
    }
  };

  const deleteDeck = (deckId) => {
    Alert.alert("Delete Deck", "Are you sure you want to delete this deck?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          let id = deckId.replace(".", "");
          const updatedDecks = decks.filter((deck) => deck.deckId !== deckId);
          setDecks(updatedDecks);
          handleDeleteDeck(id);
        },
      },
    ]);
  };

  useEffect(() => {
    handleDeckDownload();
  }, []);

  const openModel = () => {
    setModalVisible(true);
  };

  const renderOptions = (deckId) => {
    if (selectedDeckId === deckId) {
      return (
        <View style={styles.optionsMenu}>
          <TouchableOpacity
            onPress={() => {
              editDeck(deckId);
              setSelectedDeckId(null);
            }}
          >
            <Text style={styles.optionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              deleteDeck(deckId);
              setSelectedDeckId(null);
            }}
          >
            <Text style={[styles.optionText, { color: Colors.red }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderDeck = ({ item }) => (
    <TouchableOpacity
      style={styles.deckContainer}
      onPress={() => navigation.navigate("FlashcardTesting", { item })}
    >
      <Text style={styles.deckTitle}>{item.title}</Text>
      <TouchableOpacity
        onPress={() =>
          setSelectedDeckId(item.deckId === selectedDeckId ? null : item.deckId)
        }
      >
        <Text style={styles.optionsIcon}>⋮</Text>
      </TouchableOpacity>
      {renderOptions(item.deckId)}
    </TouchableOpacity>
  );

  const renderQuestions = ({ item }) => (
    <View style={styles.deckContainer}>
      <Text style={styles.deckTitle}>
        {item.qNum + 1}. Question: {item.List}
      </Text>
      <Text style={styles.deckTitle}> Answer: {item.answer}</Text>
    </View>
  );

  const [fontsLoaded] = useFonts({
    'Graduate': require('../../assets/fonts/Graduate.ttf'), // Load the Graduate font
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Loading state while fonts are loading
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>

      <FlatList
        data={decks}
        keyExtractor={(item) => item.deckId.toString()}
        renderItem={renderDeck}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No decks available. Add one by clicking the plus on the bottom right!
          </Text>
        }
      />

      <Modal animationType="slide" visible={modalVisible} transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Deck" : "Create New Deck"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Deck Title"
              value={newDeck.title}
              onChangeText={(text) => setNewDeck({ ...newDeck, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Deck Category"
              value={newDeck.category}
              onChangeText={(text) => setNewDeck({ ...newDeck, category: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Deck Description"
              value={newDeck.description}
              onChangeText={(text) => setNewDeck({ ...newDeck, description: text })}
            />

            <TouchableOpacity onPress={() => setQuestionModalVisible(true)}>
              <Text style={styles.addQuestionText}>Add Question</Text>
            </TouchableOpacity>

            <FlatList
              data={questionList}
              keyExtractor={(item) => item.qNum.toString()}
              renderItem={renderQuestions}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No questions added yet.</Text>
              }
            />

            <Button title={isEditing ? "Update Deck" : "Create Deck"} onPress={saveDeck} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" visible={questionModalVisible} transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Question"
              value={newQuestion.List}
              onChangeText={(text) => setNewQuestion({ ...newQuestion, List: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Answer"
              value={newQuestion.answer}
              onChangeText={(text) => setNewQuestion({ ...newQuestion, answer: text })}
            />
            <Button title="Save Question" onPress={saveQuestion} />
            <Button title="Close" onPress={() => setQuestionModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.addButton}
        onPress={openModel}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Graduate', // Use the Graduate font for the title
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.beige,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Graduate', // Use the Graduate font for the modal title
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addQuestionText: {
    color: Colors.blue,
    textAlign: "center",
    marginBottom: 10,
  },
  optionsMenu: {
    position: "absolute",
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 10,
  },
  optionText: {
    padding: 5,
  },
  optionsIcon: {
    fontSize: 20,
  },
  deckContainer: {
    padding: 15,
    backgroundColor: Colors.lightPink,
    marginBottom: 10,
    borderRadius: 5,
  },
  deckTitle: {
    fontSize: 20,
    fontFamily: 'Graduate', // Use the Graduate font for deck titles
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.blue,
    borderRadius: 30,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 40,
  },
});
