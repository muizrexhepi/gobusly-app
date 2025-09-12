import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4 px-6 bg-white border-b border-gray-50"
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-9 h-9 bg-gray-50 rounded-full items-center justify-center mr-4">
          <Ionicons name={icon as any} size={18} color="#6B7280" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900">{title}</Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center">
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View className="px-6 py-3 bg-gray-50">
      <Text className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        {title}
      </Text>
    </View>
  );

  const handleLanguage = () => {
    Alert.alert(
      "Language Settings",
      "Language selection will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleCurrency = () => {
    Alert.alert(
      "Currency Settings",
      "Currency selection will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      "Privacy Settings",
      "Advanced privacy settings will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deletion",
              "Please contact support to delete your account.",
              [{ text: "OK" }]
            );
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View className="mt-6">
          <SectionHeader title="Notifications" />
          <View className="bg-white">
            <MenuItem
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Get updates about your trips and offers"
              showArrow={false}
              rightComponent={
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: "#F3F4F6", true: "#EC4899" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <MenuItem
              icon="mail-outline"
              title="Email Notifications"
              subtitle="Receive booking confirmations and updates"
              showArrow={false}
              rightComponent={
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: "#F3F4F6", true: "#EC4899" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        {/* Preferences */}
        <View className="mt-6">
          <SectionHeader title="Preferences" />
          <View className="bg-white">
            <MenuItem
              icon="language-outline"
              title="Language"
              subtitle="English"
              onPress={handleLanguage}
            />
            <MenuItem
              icon="card-outline"
              title="Currency"
              subtitle="USD ($)"
              onPress={handleCurrency}
            />
            <MenuItem
              icon="location-outline"
              title="Location Services"
              subtitle="Help us find nearby bus stations"
              showArrow={false}
              rightComponent={
                <Switch
                  value={locationServices}
                  onValueChange={setLocationServices}
                  trackColor={{ false: "#F3F4F6", true: "#EC4899" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View className="mt-6">
          <SectionHeader title="Privacy & Security" />
          <View className="bg-white">
            <MenuItem
              icon="shield-outline"
              title="Privacy Settings"
              subtitle="Manage your data and privacy preferences"
              onPress={handlePrivacy}
            />
            <MenuItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => {
                // You can implement WebBrowser here too
                Alert.alert("Terms of Service", "Terms will open in browser");
              }}
            />
            <MenuItem
              icon="document-outline"
              title="Privacy Policy"
              onPress={() => {
                // You can implement WebBrowser here too
                Alert.alert(
                  "Privacy Policy",
                  "Privacy policy will open in browser"
                );
              }}
            />
          </View>
        </View>

        {/* App Info */}
        <View className="mt-6">
          <SectionHeader title="About" />
          <View className="bg-white">
            <MenuItem
              icon="information-circle-outline"
              title="App Version"
              subtitle="1.0.0"
              showArrow={false}
            />
            <MenuItem
              icon="star-outline"
              title="Rate the App"
              subtitle="Help us improve Gobusly"
              onPress={() => {
                Alert.alert(
                  "Rate App",
                  "App Store rating will be available soon"
                );
              }}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View className="mt-6 mb-6">
          <SectionHeader title="Account" />
          <View className="bg-white">
            <TouchableOpacity
              className="flex-row items-center justify-between py-4 px-6 bg-white"
              onPress={handleDeleteAccount}
              activeOpacity={0.6}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 bg-red-50 rounded-full items-center justify-center mr-4">
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-red-500">
                    Delete Account
                  </Text>
                  <Text className="text-gray-500 text-sm mt-0.5">
                    Permanently delete your account and data
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
