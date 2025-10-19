import { createGlobalStyles } from "@/styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const styles = createGlobalStyles(colorScheme);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsNumber, setSMSNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  // Wczytaj zapisane ustawienia za każdym razem, gdy ekran jest aktywny
  useFocusEffect(
    React.useCallback(() => {
      const loadSettings = async () => {
        const savedPhoneNumber = await AsyncStorage.getItem(
          "settings_phone_number"
        );
        const savedSMSNumber = await AsyncStorage.getItem(
          "settings_sms_number"
        );
        const savedMessage = await AsyncStorage.getItem("settings_sms_message");

        if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
        if (savedSMSNumber) setSMSNumber(savedSMSNumber);
        if (savedMessage) setSmsMessage(savedMessage);
      };
      loadSettings();
    }, [])
  );

  const handleSaveSettings = async () => {
    try {
      await AsyncStorage.setItem("settings_phone_number", phoneNumber);
      await AsyncStorage.setItem("settings_sms_number", smsNumber);
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
      style={styles.container}
    >
      <View
        style={{ flex: 1, width: "100%", paddingLeft: 16, paddingRight: 16 }}
      >
        <Text style={styles.label}>Domyślny numer telefonu do SMS:</Text>
        <TextInput
          style={styles.input}
          value={smsNumber}
          onChangeText={setSMSNumber}
          placeholder="np. 112"
          keyboardType="phone-pad"
          placeholderTextColor={styles.input.color}
        />

        <Text style={styles.label}>Domyślny numer telefonu do rozmów:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="np. 112"
          placeholderTextColor={styles.input.color}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Domyślna treść wiadomości:</Text>
        <TextInput
          style={styles.input}
          value={smsMessage}
          onChangeText={setSmsMessage}
          placeholder="np. Zgłaszam problem odnośnie..."
          placeholderTextColor={styles.input.color}
          multiline
        />
        <View style={styles.buttonContainer}>
          <Button title="Zapisz ustawienia" onPress={handleSaveSettings} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
