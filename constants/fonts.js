// fonts.js
import { useFonts, Graduate_400Regular } from "@expo-google-fonts/graduate";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import colours from "./Colours";

// Custom hook to load fonts
export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    Graduate_400Regular,
  });

  if (!fontsLoaded) return null;
  return fontsLoaded;
};

// Style object for titles
export const titleFont = {
  fontFamily: "Graduate_400Regular",
  fontSize: 24,
  fontWeight: "normal",
  color: colours.darkBlue, // Change this color to suit your app
};
