// Navigation.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import FlashcardScreen from "./screens/FlashcardScreen";
import AccountScreen from "./screens/AccountScreen";
import AltCalendarScreen from "./screens/altCalendarScreen";

const Stack = createStackNavigator();

function AppNavigator({ user }) {
  return (
    <Stack.Navigator
      initialRouteName={user ? "Home" : "Login"} // Redirect to Home if user is logged in
      screenOptions={{ headerShown: false }}    // Hide the header for all screens
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="altCalendar">
            {props => <AltCalendarScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="Flashcards">
            {props => <FlashcardScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="Account">
            {props => <AccountScreen {...props} user={user} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
