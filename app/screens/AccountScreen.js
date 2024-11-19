// screens/AccountScreen.js
import React, {useState, useEffect} from "react";
import { View, Text, Button, StyleSheet, Image, TextInput } from "react-native";
import NavBar from "../../components/NavBar";
import { ScrollView } from "react-native-gesture-handler";
import { auth, database } from "../firebase"; // Import auth from firebase
import { signOut } from "firebase/auth"; // Import signOut function
import { ref, get, set} from "firebase/database";
import useUserTheme from "../../hooks/useuserTheme";
import createStyles from "../style/styles";

export default function AccountScreen({ navigation, user }) {
  const [userInfo, setUserInfo] = useState(null)
  const themeColours = useUserTheme(user.uid); // Get the dynamic colours based on theme preference
  const styles = createStyles(themeColours); // Pass colours into styles


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
      <Text style={styles.settingsTitle}>SETTINGS</Text>
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