import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Using Ionicons for icons
import { useNavigation, useNavigationState } from "@react-navigation/native";

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
          name={currentRoute === "Home" ? "pie-chart" : "pie-chart-outline"} // Filled if active
          size={30}
          color="#1f2c8f" // Always blue
        />
      </TouchableOpacity>

      {/* Calendar Icon */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Calendar")}
      >
        <Icon
          name={currentRoute === "Calendar" ? "calendar" : "calendar-outline"} // Filled if active
          size={30}
          color="#1f2c8f"
        />
      </TouchableOpacity>

      {/* Flashcards Icon */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Flashcards")}
      >
        <Icon
          name={currentRoute === "Flashcards" ? "albums" : "albums-outline"} // Filled if active
          size={30}
          color="#1f2c8f"
        />
      </TouchableOpacity>

      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Account")}
      >
        <Icon
          name={currentRoute === "Account" ? "settings" : "settings-outline"} // Filled if active
          size={30}
          color="#1f2c8f"
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
  },
  navButton: {
    flex: 1,
    alignItems: "center",
  },
});
