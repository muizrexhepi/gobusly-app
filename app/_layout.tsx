import { useAuthStore } from "@/src/stores/authStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(booking)" />
        <Stack.Screen name="(profile)" />
        <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
