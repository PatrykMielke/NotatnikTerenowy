import { Note } from "@/types";
import { Alert, Share } from "react-native";
const shareNote = async (note: Note) => {
  if (!note) return;
  try {
    const formattedDate = new Date(note.date).toLocaleString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    let message = `Sprawdź moją notatkę: "${note.title}" z dnia ${formattedDate}`;

    if (note.description) {
      message += `\n\n${note.description}`;
    }
    if (note.location) {
      message += `\n\nLokalizacja: https://www.google.com/maps?q=${note.location.latitude},${note.location.longitude}`;
    }
    await Share.share({
      message: message,
      title: note.title,
    });
  } catch (error) {
    Alert.alert("Błąd", "Nie udało się udostępnić notatki.");
  }
};

export default shareNote;
