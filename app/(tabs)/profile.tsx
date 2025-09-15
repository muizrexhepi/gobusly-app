import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogin = () => router.push("/(modals)/login");

  const handleHelp = async () =>
    await WebBrowser.openBrowserAsync("https://support.gobusly.com");

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: logout,
      },
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
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear AsyncStorage except auth data
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

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    destructive = false,
    disabled = false,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-between p-4 bg-white border-b border-gray-100 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
            destructive ? "bg-red-50" : "bg-gray-50"
          }`}
        >
          {icon}
        </View>
        <View>
          <Text
            className={`text-base font-medium ${
              destructive ? "text-red-500" : "text-gray-900"
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500">{subtitle}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-8">
        {isAuthenticated ? (
          <>
            <Text className="text-xl font-bold">{user?.name}</Text>
            <Text className="text-gray-500 mt-1">{user?.email}</Text>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-pink-600 py-3 px-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              Sign In / Create Account
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isAuthenticated && (
        <View className="mt-6">
          <Text className="px-6 py-2 text-gray-500 uppercase font-semibold text-sm">
            Account & Profile
          </Text>
          <MenuItem
            icon={<Ionicons name="person-outline" size={18} color="#6B7280" />}
            title="Personal Information"
            subtitle="Manage your account details"
            onPress={() => router.push("/personal-info")}
          />
          <MenuItem
            icon={<Ionicons name="time-outline" size={18} color="#6B7280" />}
            title="Booking History"
            subtitle="View your past and upcoming trips"
            onPress={() => router.push("/(tabs)/bookings")}
          />
          <MenuItem
            icon={<Ionicons name="mail-outline" size={18} color="#6B7280" />}
            title="Inbox"
            subtitle="Messages and updates"
            onPress={() => router.push("/inbox")}
          />
        </View>
      )}

      {/* Settings & Preferences */}
      <View className="mt-6">
        <Text className="px-6 py-2 text-gray-500 uppercase font-semibold text-sm">
          Settings & Preferences
        </Text>
        <MenuItem
          icon={
            <Ionicons name="notifications-outline" size={18} color="#6B7280" />
          }
          title="Notifications"
          subtitle={
            isAuthenticated
              ? "Manage your notification preferences"
              : "Configure notifications"
          }
          onPress={() => router.push("/notifications")}
        />
        <MenuItem
          icon={<Ionicons name="globe-outline" size={18} color="#6B7280" />}
          title="Language & Currency"
          subtitle="Change display language and currency"
          onPress={() => router.push("/language-currency")}
        />
        <MenuItem
          icon={
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
          }
          title="Privacy Settings"
          subtitle="Control your privacy and data sharing"
          onPress={() => router.push("/privacy-settings")}
        />
        <MenuItem
          icon={<Ionicons name="trash-outline" size={18} color="#EF4444" />}
          title="Clear Local Data"
          subtitle={
            isAuthenticated
              ? "Data is synced to cloud"
              : "Remove cached data and preferences"
          }
          destructive={!isAuthenticated}
          disabled={isAuthenticated}
          onPress={handleClearLocalData}
        />
      </View>

      {/* Services */}
      <View className="mt-6">
        <Text className="px-6 py-2 text-gray-500 uppercase font-semibold text-sm">
          Services
        </Text>
        <MenuItem
          icon={
            <Ionicons name="help-circle-outline" size={18} color="#6B7280" />
          }
          title="Need Help?"
          subtitle="Get support and contact us"
          onPress={handleHelp}
        />
        <MenuItem
          icon={<Ionicons name="map-outline" size={18} color="#6B7280" />}
          title="Station Locations"
          subtitle="Find bus stations and stops"
          onPress={() => router.push("/station-locations")}
        />
      </View>

      {/* Legal & App Info */}
      <View className="mt-6">
        <Text className="px-6 py-2 text-gray-500 uppercase font-semibold text-sm">
          Legal & Info
        </Text>
        <MenuItem
          icon={
            <Ionicons name="document-text-outline" size={18} color="#6B7280" />
          }
          title="Terms & Conditions"
          subtitle="Read our terms of service"
          onPress={handleTermsConditions}
        />
        <MenuItem
          icon={
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#6B7280"
            />
          }
          title="Privacy Policy"
          subtitle="Learn how we protect your data"
          onPress={handlePrivacyPolicy}
        />
      </View>

      {/* Sign Out */}
      {isAuthenticated && (
        <View className="mt-6 mb-6">
          <MenuItem
            icon={<Ionicons name="log-out-outline" size={18} color="#EF4444" />}
            title="Sign Out"
            subtitle="Sign out of your account"
            destructive
            onPress={handleSignOut}
          />
        </View>
      )}

      <View className="px-6 py-4">
        <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
        <Text className="text-gray-400 text-xs mt-1">
          {isAuthenticated
            ? `Signed in as ${user?.email}`
            : "Using app in guest mode"}
        </Text>
      </View>
    </ScrollView>
  );
}
