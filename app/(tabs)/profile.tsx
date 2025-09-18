import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogin = () => router.push("/(modals)/login");
  const handleHelp = async () =>
    await WebBrowser.openBrowserAsync("https://support.gobusly.com");

  const handleSignOut = () => {
    Alert.alert(
      t("profileTab.signOutConfirmTitle"),
      t("profileTab.signOutConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profileTab.signOut"),
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const handleClearLocalData = () => {
    if (isAuthenticated) {
      Alert.alert(
        t("profileTab.dataSyncedTitle"),
        t("profileTab.dataSyncedMessage"),
        [{ text: t("profileTab.ok") }]
      );
      return;
    }
    Alert.alert(
      t("profileTab.clearDataTitle"),
      t("profileTab.clearDataMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profileTab.clearData"),
          style: "destructive",
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const nonAuthKeys = keys.filter(
                (key) => !key.includes("auth") && !key.includes("token")
              );
              if (nonAuthKeys.length > 0) {
                await AsyncStorage.multiRemove(nonAuthKeys);
              }
              Alert.alert(
                t("profileTab.dataCleared"),
                t("profileTab.dataClearedMessage"),
                [{ text: t("profileTab.ok") }]
              );
            } catch (error) {
              Alert.alert(t("common.error"), t("profileTab.clearDataError"), [
                { text: t("profileTab.ok") },
              ]);
            }
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = async () =>
    await WebBrowser.openBrowserAsync(
      "https://gobusly.com/legal/privacy-policy"
    );

  const handleTermsConditions = async () =>
    await WebBrowser.openBrowserAsync(
      "https://gobusly.com/legal/terms-of-service"
    );

  // Generate initials from name for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Reusable component for each list item
  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    destructive = false,
    disabled = false,
    isLastItem = false,
  }: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    subtitle?: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
    isLastItem?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center p-4 ${disabled ? "opacity-50" : ""} ${
        !isLastItem ? "border-b border-gray-100" : ""
      }`}
      activeOpacity={0.7}
    >
      <View
        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 ${
          destructive ? "bg-red-50" : "bg-gray-100"
        }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? "#EF4444" : "#4B5563"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-medium ${
            destructive ? "text-red-500" : "text-gray-900"
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  const Section = ({ children }: { children: React.ReactNode }) => (
    <View className="mb-6 rounded-2xl overflow-hidden bg-white mx-4">
      {children}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-100 py-4">
      {/* Apple-style Header */}
      <Section>
        {isAuthenticated ? (
          <TouchableOpacity
            onPress={() => router.push("/personal-info")}
            className="flex-row items-center p-4"
            activeOpacity={0.7}
          >
            {/* Avatar */}
            <View className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mr-4">
              <Text className="text-white text-xl font-semibold">
                {getInitials(user?.name || "U")}
              </Text>
            </View>

            {/* User Info */}
            <View className="flex-1">
              <Text className="text-xl font-semibold text-gray-900">
                {user?.name || "User"}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">{user?.email}</Text>
              <Text className="text-sm text-blue-500 mt-1">
                {t("profileTab.personalInformation")}
              </Text>
            </View>

            {/* Chevron */}
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-primary py-3 px-4 rounded-2xl mt-2"
          >
            <Text className="text-white text-center font-semibold text-base">
              {t("profileTab.signInCreateAccount")}
            </Text>
          </TouchableOpacity>
        )}
      </Section>

      <Section>
        <MenuItem
          icon="notifications-outline"
          title={t("profileTab.notifications")}
          onPress={() => router.push("/notifications")}
        />
        <MenuItem
          icon="globe-outline"
          title={t("profileTab.language")}
          onPress={() => router.push("/language")}
        />
        <MenuItem
          icon="lock-closed-outline"
          title={t("profileTab.privacySettings")}
          onPress={() => router.push("/privacy-settings")}
        />
        {isAuthenticated && (
          <MenuItem
            icon="mail-outline"
            title={t("profileTab.inbox")}
            onPress={() => router.push("/inbox")}
          />
        )}
        <MenuItem
          icon="trash-outline"
          title={t("profileTab.clearLocalData")}
          subtitle={
            isAuthenticated
              ? t("profileTab.dataSyncedToCloud")
              : t("profileTab.removeCachedData")
          }
          destructive={!isAuthenticated}
          disabled={isAuthenticated}
          onPress={handleClearLocalData}
          isLastItem={!isAuthenticated}
        />
      </Section>

      {/* Support & Legal Section */}
      <Section>
        <MenuItem
          icon="help-circle-outline"
          title={t("profileTab.needHelp")}
          onPress={handleHelp}
        />
        <MenuItem
          icon="map-outline"
          title={t("profileTab.stationLocations")}
          onPress={() => router.push("/station-locations")}
        />
        <MenuItem
          icon="document-text-outline"
          title={t("profileTab.termsConditions")}
          onPress={handleTermsConditions}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          title={t("profileTab.privacyPolicy")}
          onPress={handlePrivacyPolicy}
          isLastItem
        />
      </Section>

      {/* Sign Out Button (for authenticated users only) */}
      {isAuthenticated && (
        <Section>
          <MenuItem
            icon="log-out-outline"
            title={t("profileTab.signOut")}
            destructive
            onPress={handleSignOut}
            isLastItem
          />
        </Section>
      )}

      {/* Version Info */}
      <View className="px-6 pb-32 flex-col items-center justify-center">
        <Text className="text-gray-400 text-sm">{t("profileTab.version")}</Text>
        <Text className="text-gray-400 text-xs mt-1 text-center">
          {isAuthenticated
            ? t("profileTab.signedInAs", { email: user?.email })
            : t("profileTab.guestMode")}
        </Text>
      </View>
    </ScrollView>
  );
}
