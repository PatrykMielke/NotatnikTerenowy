import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AddNoteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj nową notatkę</Text>
      <Text>Wkrótce pojawi się tu formularz z aparatem i lokalizacją.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
