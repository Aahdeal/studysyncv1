// screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "../firebase";
import * as Google from 'expo-auth-session/providers/google';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "87162489858-krejaovpf7o38clp2dlrjljs0dnqj38t.apps.googleusercontent.com",
  });

  // Function to handle email/password login
  const handleLogin = async () => {
    try {
      // Firebase login with email/password
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Successful!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  // Function to handle Google login
  const handleGoogleLogin = () => {
    promptAsync();
  };
  
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Handle successful authentication and navigate to Home
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Login with Google" onPress={handleGoogleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
