import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isReady, setIsReady] = useState(false);
  const { t, ready: i18nReady } = useTranslation();

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        if (!i18nReady) return;

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn("App initialization failed:", e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [i18nReady]);

  if (!isReady || !i18nReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#15203e" />
        <Text className="mt-4 text-gray-600">
          {t?.("common.loading") || "Loading..."}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
