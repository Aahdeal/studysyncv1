import axios from "axios";

async function getCalendarEvents(accessToken) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.items; // Return event data
  } catch (error) {
    console.error(error);
  }
}
