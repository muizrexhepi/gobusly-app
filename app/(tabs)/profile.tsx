import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// The core logic remains the same, but the UI components are refactored
export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogin = () => router.push("/(modals)/login");
  const handleHelp = async () =>
    await WebBrowser.openBrowserAsync("https://support.gobusly.com");
  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };
  const handleClearLocalData = () => {
    if (isAuthenticated) {
      Alert.alert(
        "Data is Cloud Synced",
        "Your data is safely stored in the cloud and synced across devices. Local data clearing is not available for authenticated users.",
        [{ text: "OK" }]
      );
      return;
    }
    Alert.alert(
      "Clear Local Data",
      "This will remove all locally stored data including search history, preferences, and cached information. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
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
                "Data Cleared",
                "Local data has been successfully cleared.",
                [{ text: "OK" }]
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to clear local data. Please try again.",
                [{ text: "OK" }]
              );
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

  // Reusable component for each list item
  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    destructive = false,
    disabled = false,
  }: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    subtitle?: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center border-b border-gray-100 p-4 ${disabled ? "opacity-50" : ""}`}
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

  // Reusable component to group menu items
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="mb-6 rounded-xl overflow-hidden bg-white mx-4">
      <Text className="text-sm font-semibold text-gray-500 uppercase px-4 pt-4 pb-2">
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900">
          {isAuthenticated ? user?.name : "Profile"}
        </Text>
        {isAuthenticated ? (
          <Text className="text-gray-500 mt-1">{user?.email}</Text>
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
            className="mt-4 bg-pink-600 py-3 px-4 rounded-full"
          >
            <Text className="text-white text-center font-semibold text-base">
              Sign In / Create Account
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isAuthenticated && (
        <Section title="Account & Profile">
          <MenuItem
            icon="person-outline"
            title="Personal Information"
            onPress={() => router.push("/personal-info")}
          />
          <MenuItem
            icon="time-outline"
            title="Booking History"
            onPress={() => router.push("/(tabs)/bookings")}
          />
          <MenuItem
            icon="mail-outline"
            title="Inbox"
            onPress={() => router.push("/inbox")}
          />
        </Section>
      )}

      <Section title="Settings">
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          onPress={() => router.push("/notifications")}
        />
        <MenuItem
          icon="globe-outline"
          title="Langauge"
          onPress={() => router.push("/language")}
        />
        <MenuItem
          icon="lock-closed-outline"
          title="Privacy Settings"
          onPress={() => router.push("/privacy-settings")}
        />
        <MenuItem
          icon="trash-outline"
          title="Clear Local Data"
          subtitle={
            isAuthenticated ? "Data is synced to cloud" : "Remove cached data"
          }
          destructive={!isAuthenticated}
          disabled={isAuthenticated}
          onPress={handleClearLocalData}
        />
      </Section>

      <Section title="Support & Legal">
        <MenuItem
          icon="help-circle-outline"
          title="Need Help?"
          onPress={handleHelp}
        />
        <MenuItem
          icon="map-outline"
          title="Station Locations"
          onPress={() => router.push("/station-locations")}
        />
        <MenuItem
          icon="document-text-outline"
          title="Terms & Conditions"
          onPress={handleTermsConditions}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={handlePrivacyPolicy}
        />
      </Section>

      {isAuthenticated && (
        <View className="mx-4 mt-2 mb-6 rounded-xl overflow-hidden">
          <MenuItem
            icon="log-out-outline"
            title="Sign Out"
            destructive
            onPress={handleSignOut}
          />
        </View>
      )}

      {/* Version Info */}
      <View className="px-6 pb-32 flex-col items-center justify-center">
        <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
        <Text className="text-gray-400 text-xs mt-1 text-center">
          {isAuthenticated
            ? `Signed in as ${user?.email}`
            : "Using app in guest mode"}
        </Text>
      </View>
    </ScrollView>
  );
}
