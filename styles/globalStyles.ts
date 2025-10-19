import { Colors } from "@/constants/theme";
import { ColorSchemeName, StyleSheet } from "react-native";

export const createGlobalStyles = (colorScheme: ColorSchemeName) => {
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    item: {
      backgroundColor: theme.secondaryBackground,
      borderRadius: 10,
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      elevation: 2,
      shadowColor: theme.text,
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
    title: {
      fontSize: 20,
      fontWeight: "500",
      color: theme.text,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    text: {
      fontSize: 16,
      color: theme.text,
      marginTop: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.secondaryBackground,
      color: theme.icon,
      width: "100%",
      marginTop: 15,
    },
    info: {
      fontSize: 12,
      color: "gray",
      marginTop: 5,
    },
    buttonContainer: {
      marginTop: 30,
      width: "100%",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    image: {
      width: "100%",
      aspectRatio: 4 / 3,
    },
    contentContainer: {
      padding: 20,
    },

    date: {
      fontSize: 14,
      color: "gray",
      marginBottom: 20,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    noteDetailsContainer: {
      marginTop: 10,
      padding: 15,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 8,
      color: theme.text,
      borderColor: theme.borderColor,
      borderWidth: 1,
      elevation: 2,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    locationContainer: {
      marginTop: 15,
      padding: 10,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 8,
      alignItems: "center",
    },
    locationText: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.text,
    },
    actionsContainer: {
      marginTop: 25,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: "#eee",
    },
    newImage: {
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
    containerNote: {
      flexGrow: 1,
      alignItems: "center",
      padding: 20,
      paddingBottom: 50,
    },
  });
};
