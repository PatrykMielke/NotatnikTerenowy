// app/modal.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function ModalScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const router = useRouter(); // Hook do nawigacji, aby zamknąć modal

  const getLocation = async () => {
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
      setLocation(currentLocation.coords);
      Alert.alert(
        "Lokalizacja pobrana!",
        "Twoje współrzędne zostały zapisane."
      );
    } catch (error) {
      Alert.alert(
        "Błąd lokalizacji",
        "Nie udało się pobrać lokalizacji. Spróbuj ponownie."
      );
      console.log(error);
    }
  };

  const pickImage = async () => {
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
      await getLocation();
    }
  };

  const takePhoto = async () => {
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
      await getLocation();
    }
  };

  const handleSaveNote = async () => {
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
      const existingNotes = existingNotesRaw
        ? JSON.parse(existingNotesRaw)
        : [];

      const updatedNotes = [...existingNotes, newNote];

      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));

      Alert.alert("Sukces!", "Notatka została zapisana.");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Błąd", "Nie udało się zapisać notatki.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
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
          <View style={{ marginVertical: 5 }} />
          <Button title="Zrób zdjęcie" onPress={takePhoto} />
        </View>

        {location && (
          <Text style={styles.locationText}>
            Lokalizacja: {location.latitude.toFixed(4)},{" "}
            {location.longitude.toFixed(4)}
          </Text>
        )}

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Wpisz tytuł notatki..."
          style={styles.input}
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Dodaj opis (opcjonalnie)..."
          style={[styles.input, styles.textArea]}
          multiline
        />

        <View style={styles.saveButton}>
          <Button title="Zapisz notatkę" onPress={handleSaveNote} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 4 / 3,
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
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    width: "100%",
    marginTop: 20,
  },
  locationText: {
    fontSize: 14,
    color: "gray",
    marginTop: 15,
    fontStyle: "italic",
  },
});
