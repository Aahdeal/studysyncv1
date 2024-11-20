import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import colours from "../constants/Colours";

const useUserTheme = (userId) => {
  const [themeColours, setThemeColours] = useState(colours[0]); // Default theme is colours[0]

  useEffect(() => {
    if (!userId) {
      console.warn("No userId provided. Defaulting to colours[0].");
      return;
    }

    const db = getDatabase();
    const themeRef = ref(db, `users/${userId}/Preferences/themePreference`);

    const listener = onValue(
      themeRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const themePreference = snapshot.val();
          if (themePreference >= 0 && themePreference <= 1) {
            setThemeColours(colours[themePreference]);
          } else {
            console.warn("Invalid theme preference value. Defaulting to colours[0].");
            setThemeColours(colours[0]);
          }
        } else {
          //console.warn("No theme preference found. Defaulting to colours[0].");
          setThemeColours(colours[1]);
        }
      },
      (error) => {
        console.error("Error reading theme preference:", error);
        setThemeColours(colours[0]);
      }
    );

    // Cleanup the listener
    return () => off(themeRef, "value", listener);
  }, [userId]);

  return themeColours;
};

export default useUserTheme;
