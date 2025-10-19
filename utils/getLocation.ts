import * as Location from "expo-location";
import { Alert } from "react-native";

export default async function getLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Brak uprawnień",
      "Potrzebujemy dostępu do lokalizacji, aby zapisać pozycję notatki."
    );
    return;
  }

  try {
    let currentLocation = await Location.getCurrentPositionAsync({});
    return currentLocation.coords;
  } catch (error) {
    Alert.alert(
      "Błąd lokalizacji",
      "Nie udało się pobrać lokalizacji. Spróbuj ponownie."
    );
    console.log(error);
  }
}
