import { Note } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SMS from "expo-sms";

import { Alert } from "react-native";

const sendSms = async (note: Note) => {
  if (!note) return;

  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) {
    Alert.alert("Błąd", "Usługa SMS nie jest dostępna na tym urządzeniu.");
    return;
  }

  try {
    const phoneNumber = await AsyncStorage.getItem("settings_phone");
    const messageTemplate = await AsyncStorage.getItem("settings_sms_message");

    if (!phoneNumber) {
      Alert.alert(
        "Brak numeru",
        "Najpierw skonfiguruj domyślny numer telefonu w ustawieniach."
      );
      return;
    }

    let message = messageTemplate || "Zgłaszam problem.";
    if (note.location) {
      const locationString = `${note.location.latitude.toFixed(
        5
      )}, ${note.location.longitude.toFixed(5)}`;
      message = `${message}\n\nLokalizacja:${locationString}")`;
    }

    const { result } = await SMS.sendSMSAsync([phoneNumber], message);
    console.log("Wynik wysłania SMS:", result);
  } catch (e) {
    Alert.alert("Błąd", "Nie udało się przygotować wiadomości SMS.");
    console.error(e);
  }
};
export default sendSms;
