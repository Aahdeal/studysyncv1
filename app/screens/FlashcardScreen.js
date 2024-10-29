import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function FlashcardScreen({ navigation }) {
  const [decks, setDecks] = useState([]);

  const renderDeck = ({ item }) => (
    <TouchableOpacity
      style={styles.deckButton}
      onPress={() => navigation.navigate('Flashcardcreator', { deckId: item.id })}
    >
      <Text style={styles.deckTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flash Cards</Text>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={renderDeck}
        ListEmptyComponent={<Text style={styles.emptyText}>No decks available. Add one!</Text>}
      />
      <Button title="Add Set" onPress={() => navigation.navigate('Flashcardcreator')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f7f7' },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  deckButton: { backgroundColor: '#D2B48C', padding: 15, borderRadius: 10, marginVertical: 8 },
  deckTitle: { fontSize: 18, color: '#333' },
  emptyText: { textAlign: 'center', marginVertical: 20, color: '#666' },
});
