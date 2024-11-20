import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useCustomFonts, titleFont } from "../../constants/fonts";
import colours from "../../constants/Colours";
import useUserTheme from "../../hooks/useuserTheme";
import createStyles from "../style/styles";

export default function LoginScreen({ navigation }) {
  const themeColours = useUserTheme(""); // Get the dynamic colours based on theme preference
  const styles = createStyles(themeColours); // Pass colours into styles
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const fontsLoaded = useCustomFonts();

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

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
  };

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
      Alert.alert(
        "Success",
        "A password reset link has been sent to your email."
      );
      setModalVisible(false); // Close the modal on success
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Function to handle email/password login
  const handleLogin = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      // Firebase login with email/password
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error) {
      var eMessage = "Please check your credentials and try again";
      Alert.alert("Failed to login", eMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View>
      <View style={style.container}>
        <View style={styles.header}>
          <Text style={titleFont}>
            Welcome Back {"\n"}to {"\n"}STUDYSYNC
          </Text>
        </View>

        <Text
          style={{
            textAlign: "center",
            color: colours.blushPink,
            fontSize: 35,
            paddingBottom: 15,
          }}
        >
          Login
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on state
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"} // Change icon based on password visibility
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={{ color: colours.paleBlue }}>
            Don't Have An Account?{" "}
          </Text>
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

const style = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
});
