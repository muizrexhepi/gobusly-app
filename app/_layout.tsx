import "@/src/i18n";
import "@/src/types/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { AppInitializer } from "@/components/providers/app-initializer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <AppInitializer>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(booking)" />
              <Stack.Screen name="(profile)" />
              <Stack.Screen name="(search)" />
              <Stack.Screen
                name="(modals)"
                options={{ presentation: "modal" }}
              />
            </Stack>
            <StatusBar style="dark" />
          </AppInitializer>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
