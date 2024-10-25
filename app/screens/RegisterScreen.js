// screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword  } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "../firebase";
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const validateInput = () => {
    // Check if name or surname are empty
    if (!name.trim() || !surname.trim()) {
      setErrorMessage("Name and Surname cannot be empty.");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Check password length and complexity
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage("Password must be at least 8 characters long and include letters and numbers.");
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    setErrorMessage(""); // Clear error message if everything is valid
    return true;
  };

  const handleRegister = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Store user data in Firebase Realtime Database
      const db = getDatabase();
      await set(ref(db, 'users/' + userId + '/userDetails'), {
        name: name,
        surname: surname,
        email: email
      });

      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Registration Error");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.heading}>Create your account</Text>
      
      <View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        
        <View  style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"} // Change icon based on password visibility
              size={24}
              color="gray"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("Password Info", "Password must be at least 8 characters long and contain both letters and numbers.")}>
            <Text style={styles.infoIcon}>ℹ️</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isPasswordVisible}
        />
      </View>
      
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Button title="Register" onPress={handleRegister} />

      <View style={styles.linkContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  heading: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  inputContainer: {flexDirection: 'row', position: 'relative', width: '100%'},
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%'
  },
  infoIcon: {
    fontSize: 18,
    right: 65,
    color: "blue",
    top: 6,
  },
  eyeIcon: {
    padding: 5, // Spacing around the eye icon
    right: 65,
    top: 2,
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
    color: "blue",
    textDecorationLine: "underline",
  },
});
