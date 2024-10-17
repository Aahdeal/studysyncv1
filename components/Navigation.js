// Navigation.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import your screens
import Dashboard from "../Screens/Dashboard";
import Calendar from "../Screens/Calendar";
import Flashcards from "../Screens/Flashcards";
import Settings from "../Screens/Settings";
import Register from "../Screens/signup";
import CreateFlashcards from "../Screens/CreateFlashcards";

// Create Stack Navigator for Register and Create Flashcards
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function FlashcardsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Flashcards" component={Flashcards} />
      <Stack.Screen name="CreateFlashcards" component={CreateFlashcards} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator for the main navigation
function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Flashcards" component={FlashcardsStack} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
