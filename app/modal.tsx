// app/modal.tsx
import { LocationCoords } from "@/types";
import getLocation from "@/utils/getLocation";
import pickImage from "@/utils/pickImage";
import saveNote from "@/utils/saveNote";
import takePhoto from "@/utils/takePhoto";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const handleGetLocation = async () => {
    const coords = await getLocation();
    if (coords) {
      setLocation(coords);
    }
  };

  const handleClearLocation = () => {
    setLocation(null);
  };

  const handlePickImage = async () => {
    await pickImage(setImage);
    handleGetLocation();
  };

  const handleTakePhoto = async () => {
    await takePhoto(setImage);
    handleGetLocation();
  };

  const handleSaveNote = async () => {
    await saveNote(image, title, description, location);
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
          <Button title="Wybierz zdjęcie z galerii" onPress={handlePickImage} />
          <View style={{ marginVertical: 5 }} />
          <Button title="Zrób zdjęcie" onPress={handleTakePhoto} />
          <View style={{ marginVertical: 5 }} />
          {location ? (
            <>
              <Text style={styles.locationText}>
                Lokalizacja: {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)}
              </Text>
              <Button
                title="Usuń lokalizację"
                onPress={handleClearLocation}
                color="red"
              />
            </>
          ) : (
            <Button title="Dodaj lokalizację" onPress={handleGetLocation} />
          )}
        </View>

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
