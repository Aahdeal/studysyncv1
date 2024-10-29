import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { v4 as uuidv4 } from 'react-native-uuid';

export default function Flashcardcreator({ route, navigation }) {
  const { deckId } = route.params || {};
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [questionList, setQuestionList] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const addQuestion = () => {
    if (question && answer) { 
      setQuestionList([...questionList, { question, answer }]);
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flash Card Creator</Text>
      <TextInput 
        placeholder="Title" 
        value={title} 
        onChangeText={setTitle} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Category" 
        value={category} 
        onChangeText={setCategory} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Description" 
        value={description} 
        onChangeText={setDescription} 
        style={styles.input} 
      />
      <View style={styles.questionInput}>
        <TextInput 
          placeholder="Question" 
          value={question} 
          onChangeText={setQuestion} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Answer" 
          value={answer} 
          onChangeText={setAnswer} 
          style={styles.input} 
        />
        <Button title="Add Question" onPress={addQuestion} />
      </View>
      <FlatList
        data={questionList}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => <Text>{`${item.question} - ${item.answer}`}</Text>}
      />
      <Button 
        title="Complete Set" 
        onPress={() => navigation.navigate('FlashcardScreen')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f7f7' },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  questionInput: { marginVertical: 20 },
});