import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
export default async function takePhoto(setImage: (uri: string) => void) {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do aparatu.");
    return;
  }
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
}
