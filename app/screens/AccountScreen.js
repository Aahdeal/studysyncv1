// screens/AccountScreen.js
import React, {useState, useEffect} from "react";
import { View, Text, Button, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import NavBar from "../../components/NavBar";
import { ScrollView } from "react-native-gesture-handler";
import { auth, database } from "../firebase"; // Import auth from firebase
import { signOut } from "firebase/auth"; // Import signOut function
import { ref, get, update} from "firebase/database";
import useUserTheme from "../../hooks/useuserTheme";
import createStyles from "../style/styles";

export default function AccountScreen({ navigation, user }) {
  const [userInfo, setUserInfo] = useState(null)
  const themeColours = useUserTheme(user.uid); // Get the dynamic colours based on theme preference
  const styles = createStyles(themeColours); // Pass colours into styles
  const [themePreference, setThemePreference] = useState(null); // Temporary local state for button feedback

  const handleThemeChange = (preference) => {
    const themeRef = ref(database, `users/${user.uid}/Preferences`); // Reference to the themePreference node

    update(themeRef, { themePreference: preference })
      .then(() => {
        setThemePreference(preference); // Update local state temporarily
        console.log(`Theme preference updated to: ${preference === 0 ? "Light" : "Dark"}`);
        themeColours = useUserTheme(user.uid);
        styles = createStyles(themeColours);
      })
      .catch((error) => {
        console.error("Error updating theme preference:", error);
      });
  };


  //function to get user info from db
  const fetchUserInfo = async () => {
    let userId = user.uid;
    const snapshot = await get(ref(database, `users/${userId}/userDetails`));
    if (snapshot.exists){
      setUserInfo(snapshot.val());
    }
    else {
      console.log("No user details found.");
    }
    console.log("user details found.", userInfo);
  }


  useEffect(()=>{
    fetchUserInfo();
  },[])
  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigation.navigate("Login"); // Navigate to the Login screen
    } catch (error) {
      console.error("Logout error:", error);
      // You might want to show an alert here to inform the user of the error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleFont}>SETTINGS</Text>
      <Image
        
        style={styles.profileImage}
      />
      <TextInput
        style={styles.usernameInput}
        placeholder="Username"
        value={userInfo ? `${userInfo.name} ${userInfo.surname}` : ""}
        editable={false}
      />
      <View style={styles.options}>
      <Text style={styles.optionText}>Theme</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              themePreference === 0 ? styles.selectedButton : null,
            ]}
            onPress={() => handleThemeChange(0)} // Light theme
          >
            <Text style={styles.buttonText}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              themePreference === 1 ? styles.selectedButton : null,
            ]}
            onPress={() => handleThemeChange(1)} // Dark theme
          >
            <Text style={styles.buttonText}>Dark</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.optionText}>Accessibility</Text>
        <Text style={styles.optionText}>Notifications</Text>
      </View>
      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="#333" />
      </View>
      <NavBar />
    </View>
  );
}