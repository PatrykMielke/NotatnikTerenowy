import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export default async function pickImage(setImage: (uri: string) => void) {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do Twojej galerii.");
    return;
  }
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
}
