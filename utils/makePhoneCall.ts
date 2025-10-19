import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking } from "react-native";

const makePhoneCall = async () => {
  try {
    const phoneNumber = await AsyncStorage.getItem("settings_phone_number");
    const url = `tel:${phoneNumber}`;
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
