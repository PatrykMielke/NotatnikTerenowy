import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FontAwesome } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(xd)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* nowej notatki */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            title: "Notatnik terenowy",
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="plus-square"
                      size={25}
                      color={Colors[colorScheme ?? "light"].tint}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        {/* modal nowej notatki */}
        <Stack.Screen
          name="modal"
          options={{
            title: "Nowa notatka",
            presentation: "modal",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
