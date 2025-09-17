"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { UserPrivacySettings } from "@/src/types/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GUEST_PRIVACY_KEY = "guest_privacy_preferences";

// Reusable component for each list item
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  disabled = false,
  isSwitch = false,
  value = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  isSwitch?: boolean;
  value?: boolean;
}) => (
  <TouchableOpacity
    onPress={isSwitch ? onPress : undefined}
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
    {isSwitch ? (
      <Switch
        value={value}
        onValueChange={onPress}
        trackColor={{ true: "#15203e", false: "#e5e7eb" }}
        thumbColor="#fff"
        disabled={disabled}
      />
    ) : (
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    )}
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

interface PrivacyItem {
  key: keyof UserPrivacySettings;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}

const privacyItems: PrivacyItem[] = [
  {
    key: "share_contact_with_operators",
    label: "Contact Sharing with Operators",
    description:
      "Allow bus operators to contact you directly for trip updates and important information",
    icon: "phone-portrait-outline",
  },
  {
    key: "location_based_recommendations",
    label: "Location-Based Suggestions",
    description:
      "Use your location to suggest nearby stations and popular routes",
    icon: "location-outline",
  },
  {
    key: "travel_history_analytics",
    label: "Personalized Recommendations",
    description:
      "Use your booking history to suggest routes and operators you might like",
    icon: "analytics-outline",
  },
  {
    key: "marketing_communications",
    label: "Promotional Offers",
    description:
      "Receive special deals and offers from GoBusly and partner operators",
    icon: "mail-outline",
  },
  {
    key: "data_analytics",
    label: "Service Improvement",
    description:
      "Help us improve GoBusly by sharing anonymous usage and performance data",
    icon: "bar-chart-outline",
  },
  {
    key: "emergency_contact_sharing",
    label: "Emergency Contact Sharing",
    description:
      "Share your emergency contact with operators for safety and security purposes",
    icon: "person-outline",
  },
];

const defaultPrivacySettings: UserPrivacySettings = {
  share_contact_with_operators: true,
  location_based_recommendations: true,
  travel_history_analytics: true,
  marketing_communications: false,
  data_analytics: true,
  emergency_contact_sharing: false,
};

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [guestPrivacySettings, setGuestPrivacySettings] =
    useState<UserPrivacySettings>(defaultPrivacySettings);

  useEffect(() => {
    if (!isAuthenticated) {
      loadGuestPrivacySettings();
    }
  }, [isAuthenticated]);

  const loadGuestPrivacySettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(GUEST_PRIVACY_KEY);
      if (saved) {
        setGuestPrivacySettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load guest privacy preferences:", error);
    }
  };

  const saveGuestPrivacySettings = async (settings: UserPrivacySettings) => {
    try {
      await AsyncStorage.setItem(GUEST_PRIVACY_KEY, JSON.stringify(settings));
      setGuestPrivacySettings(settings);
    } catch (error) {
      console.error("Failed to save guest privacy preferences:", error);
      Alert.alert("Error", "Failed to save privacy preferences");
    }
  };

  const getCurrentPrivacySettings = (): UserPrivacySettings => {
    return isAuthenticated
      ? user?.privacySettings || defaultPrivacySettings
      : guestPrivacySettings;
  };

  const handleToggle = async (key: keyof UserPrivacySettings) => {
    setIsLoading(true);

    try {
      const currentSettings = getCurrentPrivacySettings();
      const updatedSettings: UserPrivacySettings = {
        ...currentSettings,
        [key]: !currentSettings[key],
      };

      if (isAuthenticated && user) {
        await profileService.editPrivacySettings(user._id, updatedSettings);
        updateUser({ privacySettings: updatedSettings });
      } else {
        await saveGuestPrivacySettings(updatedSettings);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to update privacy settings"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      "Reset Privacy Settings",
      "This will reset all privacy settings to their default values. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              if (isAuthenticated && user) {
                await profileService.editPrivacySettings(
                  user._id,
                  defaultPrivacySettings
                );
                updateUser({ privacySettings: defaultPrivacySettings });
              } else {
                await saveGuestPrivacySettings(defaultPrivacySettings);
              }
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "Failed to reset privacy settings"
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const currentSettings = getCurrentPrivacySettings();

  return (
    <ScrollView className="flex-1 bg-gray-100 py-4">
      {!isAuthenticated && (
        <View className="mx-4 mb-6 rounded-xl overflow-hidden bg-white p-4">
          <Text className="text-sm font-semibold text-blue-900 mb-1">
            Guest Mode
          </Text>
          <Text className="text-xs text-blue-800 leading-5">
            Your privacy preferences are saved locally. Sign in to sync across
            devices and enjoy enhanced privacy controls.
          </Text>
        </View>
      )}

      {/* Privacy Controls Section */}
      <Section title="Privacy Controls">
        {privacyItems.map((item) => (
          <MenuItem
            key={item.key}
            icon={item.icon}
            title={item.label}
            subtitle={item.description}
            isSwitch
            value={currentSettings[item.key]}
            onPress={() => handleToggle(item.key)}
            disabled={isLoading}
          />
        ))}
      </Section>

      {/* Data Management Section */}
      <Section title="Data Management">
        <MenuItem
          icon="reload-outline"
          title="Reset to Defaults"
          subtitle="Restore all privacy settings to recommended defaults"
          onPress={handleResetToDefaults}
          destructive
          disabled={isLoading}
        />
        {isAuthenticated && (
          <MenuItem
            icon="download-outline"
            title="Export My Data"
            subtitle="Download a copy of your personal data"
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://gobusly.com/user/data-export"
              )
            }
          />
        )}
      </Section>

      {/* Footer & Legal Links */}
      <View className="px-4 mt-2 mb-6">
        <Text className="text-xs text-gray-500 text-center leading-5">
          These settings control how GoBusly and partner bus operators can
          interact with you and use your data. We never sell your personal
          information to third parties. Some settings may be required for
          essential trip communications.
        </Text>
      </View>

      <View className="flex-row justify-center gap-4 mb-16">
        <TouchableOpacity
          onPress={() =>
            WebBrowser.openBrowserAsync(
              "https://gobusly.com/legal/privacy-policy"
            )
          }
        >
          <Text className="text-pink-600 text-sm font-medium">
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            WebBrowser.openBrowserAsync("https://gobusly.com/legal/data-policy")
          }
        >
          <Text className="text-pink-600 text-sm font-medium">Data Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
