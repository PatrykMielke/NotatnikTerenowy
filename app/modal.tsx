// app/modal.tsx
import { LocationCoords } from "@/types";
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
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { createGlobalStyles } from "../styles/globalStyles";

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const styles = createGlobalStyles(colorScheme);

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
      <ScrollView contentContainerStyle={styles.containerNote}>
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

        <View style={styles.buttonContainer}>
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
          placeholderTextColor={styles.input.color}
          style={styles.input}
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Dodaj opis (opcjonalnie)..."
          placeholderTextColor={styles.input.color}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <View style={styles.buttonContainer}>
          <Button title="Zapisz notatkę" onPress={handleSaveNote} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
