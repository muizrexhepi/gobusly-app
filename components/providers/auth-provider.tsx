// src/components/providers/AuthProvider.tsx
import i18n from "@/src/i18n";
import { useAuthStore } from "@/src/stores/authStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, user, isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initialize();
      } catch (err) {
        console.warn("Auth init failed:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, [initialize]);

  // Sync language with user preferences
  useEffect(() => {
    const syncLanguage = async () => {
      if (
        isAuthenticated &&
        user?.language &&
        user.language !== i18n.language
      ) {
        await i18n.changeLanguage(user.language);
      }
    };
    syncLanguage();
  }, [isAuthenticated, user?.language]);

  if (isInitializing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#15203e" />
      </View>
    );
  }

  return <>{children}</>;
}
