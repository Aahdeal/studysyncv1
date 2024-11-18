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

export default function FlashcardsScreen({ navigation, user }) {
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
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>

      {/* add deck button */}
      <TouchableOpacity style={styles.addDeckModal} onPress={openModel}>
        <Icon name="plus" size={30} color="white" family="FontAwesome" />
      </TouchableOpacity>

      {/* List of flashcard decks */}
      <ScrollView style={styles.listView} contentContainerStyle={justifyContent = "space-around"}>
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
      </ScrollView>

      {/* Modal for creating/editing a deck */}
      <Modal animationType="slide" visible={modalVisible} transparent={false} style={styles.modalBox}>
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
            <ScrollView style={styles.qListSV}>
            <FlatList
              data={questionList}
              keyExtractor={(item) => item.qNum.toString()}
              renderItem={renderQuestions}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No questions yet</Text>
              }
            />
            </ScrollView>

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

const styles = StyleSheet.create({
  optionsIcon: 
  {
    fontSize: 20,
    color: "#4B4B4B",
    position: "relative",
    left: 330,
    bottom: 35,
  },
  listView:{
    height: "70%",
  },
  qListSV:{
    height: 300,
  },
  addDeckModal: {
    position: "absolute",
    bottom: 90,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: "#1f2c8f",
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
  modalBox:{
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { 
    top: 40,
    backgroundColor: "#ccbe89",
    borderRadius: 15,       // Adds rounded corners
    padding: 15,            // Adds internal padding for spacing
    shadowColor: "#000",    // Adds shadow for a more polished look
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,  
    width: "90%",               // Sets modal width to 80% of the screen
    position: "absolute",         // Positions the modal absolutely                  // Moves the modal to the vertical center
    alignSelf: "center",        // Centers the modal horizontally
   },
   modalTitle:{
    fontSize: 26,                 // Large font size for emphasis
    fontWeight: "bold",
    textAlign: "center",
    color: "#4B4B4B",             // Dark gray text color for contrast
    marginBottom: 20,             // Space below the title
    letterSpacing: 1,             // Adds slight spacing between letters
    textTransform: "uppercase",   // Converts text to uppercase for a clean look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,          // Soft shadow for subtle depth
    shadowRadius: 1,
   },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { 
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000", 
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
    color: "#4B4B4B", // Darker gray for text
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
    color: "#fff",
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
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  addQuestionButton: {
    backgroundColor: "#ccbe89",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  addQuestionButtonText: {
    color: "#fff",
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
  }

});
