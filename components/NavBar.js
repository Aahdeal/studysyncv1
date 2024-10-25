import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Using Ionicons for icons
import { useNavigation, useNavigationState } from "@react-navigation/native";
import Colours from "../constants/Colours";

export default function NavBar() {
  const navigation = useNavigation();

  // Get the current route name
  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name
  );

  return (
    <View style={styles.navbarContainer}>
      {/* Dashboard Icon */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Icon
          name={currentRoute === "Home" ? "pie-chart-outline" : "pie-chart"} // Filled if active
          size={30}
          color={Colours.darkBlue} // Always blue
        />
      </TouchableOpacity>

      {/* Calendar Icon */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Calendar")}
      >
        <Icon
          name={currentRoute === "Calendar" ? "calendar-outline" : "calendar"} // Filled if active
          size={30}
          color={Colours.darkBlue}
        />
      </TouchableOpacity>

      {/* Flashcards Icon */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Flashcards")}
      >
        <Icon
          name={currentRoute === "Flashcards" ? "albums-outline" : "albums"} // Filled if active
          size={30}
          color={Colours.darkBlue}
        />
      </TouchableOpacity>

      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Account")}
      >
        <Icon
          name={currentRoute === "Account" ? "settings-outline" : "settings"} // Filled if active
          size={30}
          color={Colours.darkBlue}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff'
  },
  navButton: {
    flex: 1,
    alignItems: "center",
  },
});
