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
import { ScrollView } from "react-native-gesture-handler";
import Icon from "../../components/Icon";
import { ref, get, set, remove, update } from "firebase/database";
import { database } from "../firebase";
import useUserTheme from "../../hooks/useuserTheme";
import createStyles from "../style/styles";

export default function FlashcardsScreen({ navigation, user }) {
  const themeColours = useUserTheme(user.uid); // Get the dynamic colours based on theme preference
  const styles = createStyles(themeColours); // Pass colours into styles
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility for creating/editing deck
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [startTestModalVisible, setStartTestModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Flag for editing mode
  const [editingDeckId, setEditingDeckId] = useState(null); // Track which deck is being edited
  const [selectedDeckId, setSelectedDeckId] = useState(null); // Track which deck's menu is open
  
  /*--------------------------- OBJECTS ----------------------------------------- */
  const [decks, setDecks] = useState([]); // State for managing flashcard decks
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

  /* --------------------------DATA ACCESSOR METHODS----------------------------- */

  //get
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

  //set
  const handleDeckUpload = async (deck) => {
    let userId = user.uid;
    let deckID = deck["deckId"].replace(".", "");
    console.log(deckID);
    console.log("deckID: " + deckID + " contents: " + deck);

    await set(
      ref(database, "users/" + userId + "/flashcards/decks/" + deckID),
      deck
    )
      .then(() => {
        console.log("deck added successfully");
      })
      .catch((error) => {
        console.error("error uploading class");
      });
  };

  //update
  const handleUpdateDeck = async (updatedDeck) => {
    const userId = user.uid;
    const deckId = updatedDeck.deckId.replace(".", ""); // Ensure valid Firebase path
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

  //delete
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

  /* --------------------------SAVING----------------------------- */

  // Function to add a new deck or update an existing one
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
        // Update the deck in Firebase
        handleUpdateDeck(newDeckEntry);
        // Update locally
        const updatedDecks = decks.map((deck) =>
          deck.deckId === editingDeckId ? newDeckEntry : deck
        );
        setDecks(updatedDecks);
        setIsEditing(false);
        setEditingDeckId(null);
      } else {
        // Add new deck to Firebase
        handleDeckUpload(newDeckEntry);
        // Add locally
        setDecks([...decks, newDeckEntry]);
      }
      setQuestionList([]);
      setModalVisible(false); // Close the modal
    }
  };

  const saveQuestion = () => {
    const newQuestionEntry = {
      qNum: questionList.length,
      List: newQuestion.List,
      answer: newQuestion.answer,
    };
    //console.log("list before:", questionList);
    setQuestionList([...questionList, newQuestionEntry]);
    setModalVisible(true);
    setQuestionModalVisible(false);
  };

  /* --------------------------UPDATING----------------------------- */

  // Function to start editing a deck
  const editDeck = (deckId) => {
    //console.log(deckId);
    const deckToEdit = decks.find((deck) => deck.deckId === deckId);
    if (deckToEdit) {
      setQuestionList(deckToEdit.questionList);
      setQuestionList(deckToEdit.questionList); // Set the question list for editing
      setNewDeck({
        deckId: deckToEdit.deckId,
        title: deckToEdit.title,
        description: deckToEdit.description,
        category: deckToEdit.category,
        questionList: deckToEdit.questionList,
        lastScore: deckToEdit.lastScore || 0, // Preserves lastScore if it exists
      });
      setIsEditing(true);
      setEditingDeckId(deckId);
      setModalVisible(true);
    }
  };

  // Function to delete a deck
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

  /* -------------------------LOADING----------------------------- */

  useEffect(() => {
    handleDeckDownload();
  }, []);


  /* --------------------------UserInterface----------------------------- */

  //main page
  //display decks
  //flashcardManagerModal
  //testingModal

  const openModel = () => {
    setModalVisible(true);
  };

  // Render the options (Edit, Delete) under the three dots
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
            <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  // Render each deck with the three-dots menu
  {
    /* ... is icon to edit */
  }
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
      {renderOptions(item.deckId)}
    </View>
  );

  return (
    <View style={styles.containerFlashcards}>
      <Text style={styles.titleFont}>Flashcards</Text>

      {/* add deck button */}
      <TouchableOpacity style={styles.viewTask} onPress={openModel}>
        <Icon name="plus" size={30} color="white" family="FontAwesome" />
      </TouchableOpacity>

      {/* List of flashcard decks */}

      <FlatList
        data={decks}
        keyExtractor={(item) => item.deckId.toString()}
        renderItem={renderDeck}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No decks available. Add one by click the plus on the bottom right!
          </Text>
        }
      />

      {/* Modal for creating/editing a deck */}
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
              onChangeText={(text) =>
                setNewDeck({ ...newDeck, category: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Deck Description"
              value={newDeck.description}
              onChangeText={(text) =>
                setNewDeck({ ...newDeck, description: text })
              }
            />

            <FlatList
              data={questionList}
              keyExtractor={(item) => item.qNum.toString()}
              renderItem={renderQuestions}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No questions yet</Text>
              }
            />

            <TouchableOpacity
              style={styles.addQuestionButton}
              onPress={() => setQuestionModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add Question</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={saveDeck}>
              <Text style={styles.addButtonText}>
                {isEditing ? "Update Deck" : "Save Deck"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
      style={styles.closeButton}
      onPress={() => {
        setModalVisible(false);
        setIsEditing(false);
      }}
    >
      <Text style={styles.buttonText}>Close</Text>
    </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

      {/* Modal for creating questions */}
      <Modal
        animationType="slide"
        visible={questionModalVisible}
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Deck" : "Create New Deck"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Question"
              value={newQuestion.List}
              onChangeText={(text) =>
                setNewQuestion({ ...newQuestion, List: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Answer"
              value={newQuestion.answer}
              onChangeText={(text) =>
                setNewQuestion({ ...newQuestion, answer: text })
              }
            />
            <TouchableOpacity style={styles.addButton} onPress={saveQuestion}>
              <Text style={styles.addButtonText}>Save Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fixed navigation bar at the bottom */}
      <View style={styles.navbarContainer}>
        <NavBar />
      </View>
    </View>
  );
}
