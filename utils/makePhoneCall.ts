import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, Linking } from "react-native";

const makePhoneCall = async () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const savedPhone = await AsyncStorage.getItem("settings_phone");
  if (savedPhone) setPhoneNumber(savedPhone);

  const url = `tel:${phoneNumber}`;

  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert(
      "Błąd",
      "Nie można otworzyć aplikacji do wykonywania połączeń."
    );
    console.error("Błąd podczas próby otwarcia dialera:", error);
  }
};

export default makePhoneCall;
