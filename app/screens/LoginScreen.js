import React, { useState } from "react";
import { View, Text, Button, TextInput, Modal, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const validateInput = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (password == "") {
      setErrorMessage("Please enter a password.");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert("Success", "A password reset link has been sent to your email.");
      setModalVisible(false); // Close the modal on success
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Function to handle email/password login
  const handleLogin = async () => {
    if(!validateInput()){
      return;
    }
    try {
      // Firebase login with email/password
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error) {
      var eMessage = "Please check your credentials and try again"
      Alert.alert("Failed to login",eMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>STUDYSYNC{"\n"}YOUR MOBILE STUDYING PARTNER</Text>
      </View>

      <View style={styles.containerLogin}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on state
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"} // Change icon based on password visibility
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
        <Button title="Login" onPress={handleLogin} />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text>Don't Have An Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reset Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
            />

            <Button title="Send Reset Email" onPress={handleForgotPassword} />

            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20},
  containerLogin: { top: -50, flex: 1, justifyContent: "center", padding: 20},
  inputContainer: {flexDirection: 'row', position: 'relative', width: '100%'},
  header: {top: 0, width: '100%', padding: 5},
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },  // Text styling
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%'
  },
  eyeIcon: {
    padding: 5, // Spacing around the eye icon
    right: 35,
    top: 3,
  },
  errorText: {
    color: "red",
    margin: 10,
    textAlign: "center",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  forgotPassword: {
    margin: 10,
    color: "blue",
    textAlign: "center",
    textDecorationLine: "underline",
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
});
