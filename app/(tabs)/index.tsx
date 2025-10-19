import { createGlobalStyles } from "@/styles/globalStyles";
import { NotePreview } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const styles = createGlobalStyles(colorScheme);
  const [notes, setNotes] = useState<NotePreview[]>([]);

  const loadNotes = async () => {
    try {
      const notesJson = await AsyncStorage.getItem("notes");
      if (notesJson) {
        setNotes(JSON.parse(notesJson));
      }
    } catch (e) {
      console.error("Failed to load notes.", e);
    }
  };

  // Używamy useFocusEffect, aby dane odświeżały się za każdym razem, gdy wracamy na ten ekran (np. po zapisaniu nowej notatki).
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Konfiguracja nagłówka pozostaje bez zmian */}
      <Stack.Screen options={{ title: "Notatnik Terenowy" }} />

      {notes.length > 0 ? (
        <FlatList
          data={notes.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )} // Sortowanie od najnowszych
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/note/[id]", params: { id: item.id } }}
              asChild
            >
              <Pressable style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.noteImage} />
                <Text style={styles.title}>{item.title}</Text>
              </Pressable>
            </Link>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Brak notatek</Text>
          <Text style={styles.info}>
            Naciśnij +, aby dodać pierwszą notatkę.
          </Text>
        </View>
      )}
    </View>
  );
}
