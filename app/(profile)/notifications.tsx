"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { UserNotifications } from "@/src/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import {
  Bell,
  CheckCircle,
  ChevronLeft,
  Clock,
  Settings,
  Shield,
  Tag,
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

const GUEST_NOTIFICATIONS_KEY = "guest_notification_preferences";

interface NotificationItem {
  key: keyof UserNotifications;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}

const notificationItems: NotificationItem[] = [
  {
    key: "booking_confirmations",
    label: "Booking Confirmations",
    description: "Get notified when your bookings are confirmed or updated",
    icon: CheckCircle,
    iconColor: "#10b981",
  },
  {
    key: "departure_reminders",
    label: "Departure Reminders",
    description: "Receive reminders before your scheduled departures",
    icon: Clock,
    iconColor: "#f59e0b",
  },
  {
    key: "promotions",
    label: "Promotions & Offers",
    description: "Stay updated with special deals and promotional offers",
    icon: Tag,
    iconColor: "#ef4444",
  },
  {
    key: "account_updates",
    label: "Account Updates",
    description: "Important updates about your account and profile changes",
    icon: Settings,
    iconColor: "#6366f1",
  },
  {
    key: "security_alerts",
    label: "Security Alerts",
    description: "Critical security notifications and login alerts",
    icon: Shield,
    iconColor: "#dc2626",
  },
];

const defaultNotifications: UserNotifications = {
  booking_confirmations: true,
  departure_reminders: true,
  promotions: false,
  account_updates: true,
  security_alerts: true,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [guestNotifications, setGuestNotifications] =
    useState<UserNotifications>(defaultNotifications);

  // Load guest notifications from AsyncStorage
  useEffect(() => {
    if (!isAuthenticated) {
      loadGuestNotifications();
    }
  }, [isAuthenticated]);

  const loadGuestNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem(GUEST_NOTIFICATIONS_KEY);
      if (saved) {
        setGuestNotifications(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load guest notification preferences:", error);
    }
  };

  const saveGuestNotifications = async (notifications: UserNotifications) => {
    try {
      await AsyncStorage.setItem(
        GUEST_NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
      );
      setGuestNotifications(notifications);
    } catch (error) {
      console.error("Failed to save guest notification preferences:", error);
      Alert.alert("Error", "Failed to save notification preferences");
    }
  };

  // Get current notifications based on user state
  const getCurrentNotifications = (): UserNotifications => {
    return isAuthenticated
      ? user?.notifications || defaultNotifications
      : guestNotifications;
  };

  const handleToggle = async (key: keyof UserNotifications) => {
    setIsLoading(true);

    try {
      const currentNotifications = getCurrentNotifications();
      const updatedNotifications: UserNotifications = {
        ...currentNotifications,
        [key]: !currentNotifications[key],
      };

      if (isAuthenticated && user) {
        // Save to backend for authenticated users
        await profileService.editNotifications(user._id, updatedNotifications);
        updateUser({ notifications: updatedNotifications });
      } else {
        // Save to AsyncStorage for guest users
        await saveGuestNotifications(updatedNotifications);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAll = async () => {
    setIsLoading(true);

    try {
      const currentNotifications = getCurrentNotifications();
      // Check if any notification is currently enabled
      const isAnyEnabled = Object.values(currentNotifications).some(
        (value) => value === true
      );

      // Toggle all notifications to the opposite state
      const newState = !isAnyEnabled;

      const updatedNotifications: UserNotifications = {
        booking_confirmations: newState,
        departure_reminders: newState,
        promotions: newState,
        account_updates: newState,
        security_alerts: newState,
      };

      if (isAuthenticated && user) {
        // Save to backend for authenticated users
        await profileService.editNotifications(user._id, updatedNotifications);
        updateUser({ notifications: updatedNotifications });
      } else {
        // Save to AsyncStorage for guest users
        await saveGuestNotifications(updatedNotifications);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft color="#fff" size={24} />
    </TouchableOpacity>
  );

  const NotificationSwitch = ({
    item,
    value,
    onChange,
  }: {
    item: NotificationItem;
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

  const currentNotifications = getCurrentNotifications();

  // Check if all notifications are enabled
  const allEnabled = Object.values(currentNotifications).every(
    (value) => value === true
  );
  const anyEnabled = Object.values(currentNotifications).some(
    (value) => value === true
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Notifications",
          headerStyle: { backgroundColor: "#db2777" },
          headerTitleStyle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
          headerTintColor: "#fff",
          headerLeft: backButton,
        }}
      />

      <ScrollView className="bg-gray-50 flex-1">
        <View className="px-6 py-6">
          {/* Header Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-full bg-pink-100 items-center justify-center mr-4">
                <Bell color="#db2777" size={24} />
              </View>
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  Notification Settings
                </Text>
                <Text className="text-gray-600">
                  {isAuthenticated
                    ? "Manage how you receive updates"
                    : "Configure your notification preferences"}
                </Text>
              </View>
            </View>
          </View>

          {/* Guest User Info */}
          {!isAuthenticated && (
            <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <Text className="text-blue-900 font-medium mb-1">Guest Mode</Text>
              <Text className="text-blue-800 text-sm leading-5">
                Your notification preferences are saved locally. Sign in to sync
                across devices and receive personalized updates.
              </Text>
            </View>
          )}

          {/* Master Toggle */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  All Notifications
                </Text>
                <Text className="text-sm text-gray-600">
                  {allEnabled
                    ? "Disable all notifications"
                    : anyEnabled
                      ? "Enable remaining notifications"
                      : "Enable all notifications"}
                </Text>
              </View>
              {isLoading ? (
                <ActivityIndicator color="#db2777" size="small" />
              ) : (
                <Switch
                  value={anyEnabled}
                  onValueChange={handleToggleAll}
                  trackColor={{ true: "#db2777", false: "#e5e7eb" }}
                  thumbColor="#fff"
                  disabled={isLoading}
                />
              )}
            </View>
          </View>

          {/* Individual Notification Settings */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Individual Settings
            </Text>
            {notificationItems.map((item) => (
              <NotificationSwitch
                key={item.key}
                item={item}
                value={currentNotifications[item.key]}
                onChange={() => handleToggle(item.key)}
              />
            ))}
          </View>

          {/* Footer Info */}
          <View className="mt-6 p-4 bg-blue-50 rounded-xl">
            <Text className="text-sm text-blue-700 text-center">
              {isAuthenticated
                ? "You can change these settings anytime. Critical security alerts will always be sent for account protection."
                : "These preferences will be applied when you receive push notifications. Sign in to sync your settings across devices."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
