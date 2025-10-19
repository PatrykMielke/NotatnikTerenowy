import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  // Wczytaj zapisane ustawienia za każdym razem, gdy ekran jest aktywny
  useFocusEffect(
    React.useCallback(() => {
      const loadSettings = async () => {
        const savedPhone = await AsyncStorage.getItem("settings_phone");
        const savedMessage = await AsyncStorage.getItem("settings_sms_message");
        if (savedPhone) setPhoneNumber(savedPhone);
        if (savedMessage) setSmsMessage(savedMessage);
      };
      loadSettings();
    }, [])
  );

  const handleSaveSettings = async () => {
    try {
      await AsyncStorage.setItem("settings_phone", phoneNumber);
      await AsyncStorage.setItem("settings_sms_message", smsMessage);
      Alert.alert("Sukces", "Ustawienia zostały zapisane.");
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się zapisać ustawień.");
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Text style={styles.title}>Ustawienia SMS</Text>
      <Text style={styles.label}>Domyślny numer telefonu</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="np. 112"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Domyślna treść wiadomości</Text>
      <TextInput
        style={styles.input}
        value={smsMessage}
        onChangeText={setSmsMessage}
        placeholder="np. Zgłaszam problem w lokalizacji: {lokalizacja}"
        multiline
      />
      <Text style={styles.info}>
        Możesz użyć zmiennej {"{lokalizacja}"}, która zostanie automatycznie
        podmieniona na współrzędne z notatki.
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Zapisz ustawienia" onPress={handleSaveSettings} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  info: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
