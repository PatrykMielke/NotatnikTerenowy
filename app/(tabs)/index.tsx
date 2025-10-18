import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Note {
  id: string;
  title: string;
  image: string;
  date: string;
}

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);

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
              <Pressable style={styles.noteItem}>
                <Image source={{ uri: item.image }} style={styles.noteImage} />
                <Text style={styles.noteTitle}>{item.title}</Text>
              </Pressable>
            </Link>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Brak notatek</Text>
          <Text style={styles.emptySubText}>
            Naciśnij +, aby dodać pierwszą notatkę.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noteItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2, // Cień na Androidzie
    shadowColor: "#000", // Cień na iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  noteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emptySubText: {
    fontSize: 16,
    color: "gray",
    marginTop: 8,
  },
});
