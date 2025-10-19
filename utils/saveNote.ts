import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { Alert } from "react-native";

export default async function saveNote(
  image: string | null,
  title: string,
  description: string,
  location: { latitude: number; longitude: number } | null
) {
  if (!image || !title) {
    Alert.alert("Błąd", "Zdjęcie i tytuł są wymagane!");
    return;
  }

  try {
    const newNote = {
      id: Crypto.randomUUID(),
      title,
      description,
      image,
      date: new Date().toISOString(),
      location: location,
    };

    const existingNotesRaw = await AsyncStorage.getItem("notes");
    const existingNotes = existingNotesRaw ? JSON.parse(existingNotesRaw) : [];

    const updatedNotes = [...existingNotes, newNote];

    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));

    Alert.alert("Sukces!", "Notatka została zapisana.");
    router.back();
  } catch (e) {
    console.error(e);
    Alert.alert("Błąd", "Nie udało się zapisać notatki.");
  }
}
