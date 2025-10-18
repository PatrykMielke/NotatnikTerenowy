import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Note {
  id: string;
  title: string;
  description?: string;
  image: string;
  date: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Get the 'id' from the URL
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      if (!id) return;
      try {
        const notesJson = await AsyncStorage.getItem("notes");
        const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
        const foundNote = allNotes.find((n) => n.id === id);
        setNote(foundNote || null);
      } catch (e) {
        console.error("Failed to load the note.", e);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (!note) {
    return (
      <View style={styles.centered}>
        <Text>Nie znaleziono notatki.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: note.title }} />
      <Image source={{ uri: note.image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>
          {new Date(note.date).toLocaleString("pl-PL")}
        </Text>
        {note.description ? (
          <Text style={styles.description}>{note.description}</Text>
        ) : null}
        {note.location ? (
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Lokalizacja:</Text>
            <Text style={styles.locationText}>
              Szerokość: {note.location.latitude.toFixed(5)}
            </Text>
            <Text style={styles.locationText}>
              Długość: {note.location.longitude.toFixed(5)}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 20,
  },
  locationContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f4f6f8",
    borderRadius: 8,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 15,
    color: "#333",
  },
});
