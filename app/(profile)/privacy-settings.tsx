"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { UserPrivacySettings } from "@/src/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import {
  ChevronLeft,
  Eye,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  UserCheck,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GUEST_PRIVACY_KEY = "guest_privacy_preferences";

interface PrivacyItem {
  key: keyof UserPrivacySettings;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  critical?: boolean;
}

const privacyItems: PrivacyItem[] = [
  {
    key: "share_contact_with_operators",
    label: "Contact Sharing with Operators",
    description:
      "Allow bus operators to contact you directly for trip updates and important information",
    icon: Phone,
    iconColor: "#10b981",
  },
  {
    key: "location_based_recommendations",
    label: "Location-Based Suggestions",
    description:
      "Use your location to suggest nearby stations and popular routes",
    icon: MapPin,
    iconColor: "#ef4444",
  },
  {
    key: "travel_history_analytics",
    label: "Personalized Recommendations",
    description:
      "Use your booking history to suggest routes and operators you might like",
    icon: Eye,
    iconColor: "#f59e0b",
  },
  {
    key: "marketing_communications",
    label: "Promotional Offers",
    description:
      "Receive special deals and offers from GoBusly and partner operators",
    icon: MessageCircle,
    iconColor: "#8b5cf6",
  },
  {
    key: "data_analytics",
    label: "Service Improvement",
    description:
      "Help us improve GoBusly by sharing anonymous usage and performance data",
    icon: Shield,
    iconColor: "#06b6d4",
  },
  {
    key: "emergency_contact_sharing",
    label: "Emergency Contact Sharing",
    description:
      "Share your emergency contact with operators for safety and security purposes",
    icon: UserCheck,
    iconColor: "#dc2626",
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

  // Load guest privacy settings from AsyncStorage
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

  // Get current privacy settings based on user state
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
        // Save to backend for authenticated users
        await profileService.editPrivacySettings(user._id, updatedSettings);
        updateUser({ privacySettings: updatedSettings });
      } else {
        // Save to AsyncStorage for guest users
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

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft color="#fff" size={24} />
    </TouchableOpacity>
  );

  const PrivacySwitch = ({
    item,
    value,
    onChange,
  }: {
    item: PrivacyItem;
    value: boolean;
    onChange: () => void;
  }) => {
    const IconComponent = item.icon;

    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center mr-4">
              <IconComponent color={item.iconColor} size={24} />
            </View>
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold text-gray-900 mb-1">
                {item.label}
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {item.description}
              </Text>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator color="#db2777" size="small" />
          ) : (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ true: "#db2777", false: "#e5e7eb" }}
              thumbColor="#fff"
              disabled={isLoading}
            />
          )}
        </View>
      </View>
    );
  };

  const currentSettings = getCurrentPrivacySettings();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Privacy Settings",
          headerStyle: { backgroundColor: "#db2777" },
          headerTitleStyle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
          headerTintColor: "#fff",
          headerLeft: backButton,
        }}
      />

      <ScrollView className="bg-gray-50 flex-1">
        <View className="px-6 py-6">
          {!isAuthenticated && (
            <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <Text className="text-blue-900 font-medium mb-1">Guest Mode</Text>
              <Text className="text-blue-800 text-sm leading-5">
                Your privacy preferences are saved locally. Sign in to sync
                across devices and enjoy enhanced privacy controls.
              </Text>
            </View>
          )}

          {/* Privacy Overview */}
          <View className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6 border border-pink-100">
            <View className="flex-row items-center mb-2">
              <Shield color="#db2777" size={24} />
              <Text className="text-pink-900 font-semibold text-lg ml-3">
                Your Privacy Matters
              </Text>
            </View>
            <Text className="text-pink-800 text-sm leading-5">
              Control how your data is used and shared. You can change these
              settings anytime to suit your comfort level.
            </Text>
          </View>

          {/* Privacy Settings */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Privacy Controls
            </Text>
            {privacyItems.map((item) => (
              <PrivacySwitch
                key={item.key}
                item={item}
                value={currentSettings[item.key]}
                onChange={() => handleToggle(item.key)}
              />
            ))}
          </View>

          {/* Data Management */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Data Management
            </Text>

            <TouchableOpacity
              onPress={handleResetToDefaults}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center mr-4">
                    <Shield color="#6b7280" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      Reset to Defaults
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Restore all privacy settings to recommended defaults
                    </Text>
                  </View>
                </View>
                <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center">
                  <Text className="text-gray-600 text-xs font-bold">R</Text>
                </View>
              </View>
            </TouchableOpacity>

            {isAuthenticated && (
              <TouchableOpacity
                onPress={() => router.push("/data-export")}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center mr-4">
                      <Eye color="#10b981" size={24} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        Export My Data
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Download a copy of your personal data
                      </Text>
                    </View>
                  </View>
                  <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center">
                    <Text className="text-green-600 text-xs font-bold">↓</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Info */}
          <View className="mt-6 p-4 bg-gray-100 rounded-xl">
            <Text className="text-xs text-gray-600 text-center leading-5">
              {isAuthenticated
                ? "These settings control how GoBusly and partner bus operators can interact with you and use your data. We never sell your personal information to third parties. Some settings may be required for essential trip communications."
                : "Privacy settings in guest mode are stored locally. For full privacy controls and data portability, consider creating an account with us."}
            </Text>
          </View>

          <View className="mt-4 flex-row justify-center space-x-4">
            <TouchableOpacity
              onPress={() => router.push("/privacy-policy")}
              className="flex-1"
            >
              <Text className="text-pink-600 text-sm font-medium text-center">
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/data-policy")}
              className="flex-1"
            >
              <Text className="text-pink-600 text-sm font-medium text-center">
                Data Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
