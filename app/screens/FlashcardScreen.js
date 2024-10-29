import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // Import icons from expo/vector-icons
import NavBar from "../../components/NavBar";

export default function FlashcardsScreen({ navigation, user }) {
  const [decks, setDecks] = useState([]); // State for managing flashcard decks
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility for creating/editing deck
  const [newDeckTitle, setNewDeckTitle] = useState(""); // Title of the new or edited deck
  const [isEditing, setIsEditing] = useState(false); // Flag for editing mode
  const [editingDeckId, setEditingDeckId] = useState(null); // Track which deck is being edited
  const [selectedDeckId, setSelectedDeckId] = useState(null); // Track which deck's menu is open

/* --------------------------DATA ACCESSOR METHODS----------------------------- */

//get

//set

//update

/* --------------------------SAVING----------------------------- */

// flashcardManagerModal

// save deck

// save question list

/* --------------------------UPDATING----------------------------- */

// flashcardManagerModal

// update deck

// update question list

// delete deck

/* -------------------------LOADING----------------------------- */

// load Items same as on calendar or use the display method from dashboard

/* --------------------------TESTING----------------------------- */

//testingModal

//load specific deck

//test functionality

//ending screen and button to retry or return

/* --------------------------UserInterface----------------------------- */

//main page
  //display decks
  //flashcardManagerModal
  //testingModal

  // Function to add a new deck or update an existing one
  const saveDeck = () => {
    if (newDeckTitle.trim()) {
      if (isEditing) {
        // Update the existing deck
        const updatedDecks = decks.map((deck) =>
          deck.id === editingDeckId ? { ...deck, title: newDeckTitle } : deck
        );
        setDecks(updatedDecks);
        setIsEditing(false);
        setEditingDeckId(null);
      } else {
        // Add a new deck with a unique id using Date.now()
        setDecks([...decks, { id: Date.now(), title: newDeckTitle }]);
      }
      setNewDeckTitle(""); // Clear the input after saving
      setModalVisible(false); // Close the modal
    }
  };

  // Function to start editing a deck
  const editDeck = (deckId) => {
    const deckToEdit = decks.find((deck) => deck.id === deckId);
    if (deckToEdit) {
      setNewDeckTitle(deckToEdit.title);
      setIsEditing(true);
      setEditingDeckId(deckId);
      setModalVisible(true);
    }
  };

  // Function to delete a deck
  const deleteDeck = (deckId) => {
    Alert.alert(
      "Delete Deck",
      "Are you sure you want to delete this deck?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            const updatedDecks = decks.filter((deck) => deck.id !== deckId);
            setDecks(updatedDecks);
          },
        },
      ]
    );
  };

  // Render the options (Edit, Delete) under the three dots
  const renderOptions = (deckId) => {
    if (selectedDeckId === deckId) {
      return (
        <View style={styles.optionsMenu}>
          <TouchableOpacity onPress={() => { editDeck(deckId); setSelectedDeckId(null); }}>
            <Text style={styles.optionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { deleteDeck(deckId); setSelectedDeckId(null); }}>
            <Text style={[styles.optionText, { color: 'red' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  // Render each deck with the three-dots menu
  const renderDeck = ({ item }) => (
    <View style={styles.deckContainer}>
      <Text style={styles.deckTitle}>{item.title}</Text>
      <TouchableOpacity onPress={() => setSelectedDeckId(item.id === selectedDeckId ? null : item.id)}>
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>
      {renderOptions(item.id)}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>

      {/* Button to open the modal to add a deck */}
      <Button title="Add Deck" onPress={() => navigation.navigate("FlashCardCreator")}/>

      {/* List of flashcard decks */}
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDeck}
        ListEmptyComponent={<Text style={styles.emptyText}>No decks available. Add one!</Text>}
      />

      {/* Modal for creating/editing a deck */}
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? "Edit Deck" : "Create New Deck"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Deck Title"
              value={newDeckTitle}
              onChangeText={(text) => setNewDeckTitle(text)}
            />
            <TouchableOpacity style={styles.addButton} onPress={saveDeck}>
              <Text style={styles.addButtonText}>{isEditing ? "Update Deck" : "Add Deck"}</Text>
            </TouchableOpacity>
            <Button title="Close" onPress={() => setModalVisible(false)} />
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
  container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  deckContainer: {
    backgroundColor: "#D2B48C",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deckTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  emptyText: { textAlign: "center", marginVertical: 20, color: "#666" },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  optionsMenu: {
    position: 'absolute',
    top: 50, // Adjusted to provide space below the icon
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 4,
    zIndex: 10, // Ensure it appears above other components
    width: 100, // Optional: Set a fixed width to avoid resizing issues
  },
  
  optionText: { paddingVertical: 5, fontSize: 16, textAlign: 'center' },
});
