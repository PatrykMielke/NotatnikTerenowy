// app/modal.tsx
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Button, Image, StyleSheet, View } from "react-native";

export default function ModalScreen() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Prośba o uprawnienia do galerii
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Brak uprawnień",
        "Potrzebujemy dostępu do Twojej galerii, aby dodać zdjęcie."
      );
      return;
    }

    // Otwarcie galerii
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Prośba o uprawnienia do aparatu
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Brak uprawnień",
        "Potrzebujemy dostępu do aparatu, aby zrobić zdjęcie."
      );
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
  };

  return (
    <View style={styles.container}>
      {/* Wyświetl obraz, jeśli został wybrany */}
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.placeholderIcon}
          />
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Button title="Wybierz zdjęcie z galerii" onPress={pickImage} />
        <View style={{ marginVertical: 10 }} />
        <Button title="Zrób zdjęcie" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 225,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePlaceholder: {
    width: 300,
    height: 225,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    opacity: 0.5,
  },
});
