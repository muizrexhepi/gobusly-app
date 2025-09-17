"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { UserNotifications } from "@/src/types/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GUEST_NOTIFICATIONS_KEY = "guest_notification_preferences";

// Reusable component for each list item
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isSwitch = false,
  value = false,
  disabled = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  isSwitch?: boolean;
  value?: boolean;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`flex-row border-b border-gray-100 items-center p-4 ${disabled ? "opacity-50" : ""}`}
  >
    <View className="w-8 h-8 rounded-lg flex items-center justify-center mr-4 bg-gray-100">
      <Ionicons name={icon} size={18} color="#4B5563" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-medium text-gray-900">{title}</Text>
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

interface NotificationItem {
  key: keyof UserNotifications;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}

const notificationItems: NotificationItem[] = [
  {
    key: "booking_confirmations",
    label: "Booking Confirmations",
    description: "Get notified when your bookings are confirmed or updated",
    icon: "checkmark-circle-outline",
  },
  {
    key: "departure_reminders",
    label: "Departure Reminders",
    description: "Receive reminders before your scheduled departures",
    icon: "alarm-outline",
  },
  {
    key: "promotions",
    label: "Promotions & Offers",
    description: "Stay updated with special deals and promotional offers",
    icon: "pricetag-outline",
  },
  {
    key: "account_updates",
    label: "Account Updates",
    description: "Important updates about your account and profile changes",
    icon: "settings-outline",
  },
  {
    key: "security_alerts",
    label: "Security Alerts",
    description: "Critical security notifications and login alerts",
    icon: "shield-checkmark-outline",
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
        await profileService.editNotifications(user._id, updatedNotifications);
        updateUser({ notifications: updatedNotifications });
      } else {
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
      const isAnyEnabled = Object.values(currentNotifications).some(
        (value) => value === true
      );
      const newState = !isAnyEnabled;

      const updatedNotifications: UserNotifications = {
        booking_confirmations: newState,
        departure_reminders: newState,
        promotions: newState,
        account_updates: newState,
        security_alerts: newState,
      };

      if (isAuthenticated && user) {
        await profileService.editNotifications(user._id, updatedNotifications);
        updateUser({ notifications: updatedNotifications });
      } else {
        await saveGuestNotifications(updatedNotifications);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const currentNotifications = getCurrentNotifications();
  const allEnabled = Object.values(currentNotifications).every(
    (value) => value === true
  );
  const anyEnabled = Object.values(currentNotifications).some(
    (value) => value === true
  );

  return (
    <ScrollView className="flex-1 bg-gray-100 py-4">
      {/* Guest Mode Info */}
      {!isAuthenticated && (
        <View className="mx-4 mb-6 rounded-xl overflow-hidden bg-white p-4">
          <Text className="text-sm font-semibold text-blue-900 mb-1">
            Guest Mode
          </Text>
          <Text className="text-xs text-blue-800 leading-5">
            Your notification preferences are saved locally. Sign in to sync
            across devices and receive personalized updates.
          </Text>
        </View>
      )}

      {/* Main Notification Settings */}
      <Section title="Notification Controls">
        <MenuItem
          icon="notifications-outline"
          title="All Notifications"
          subtitle={
            allEnabled
              ? "Disable all notifications"
              : anyEnabled
                ? "Enable remaining notifications"
                : "Enable all notifications"
          }
          onPress={handleToggleAll}
          isSwitch
          value={anyEnabled}
          disabled={isLoading}
        />
        {notificationItems.map((item) => (
          <MenuItem
            key={item.key}
            icon={item.icon}
            title={item.label}
            subtitle={item.description}
            onPress={() => handleToggle(item.key)}
            isSwitch
            value={currentNotifications[item.key]}
            disabled={isLoading}
          />
        ))}
      </Section>

      {/* Footer Info */}
      <View className="mx-4 mt-2 mb-6 p-4 bg-gray-200 rounded-xl">
        <Text className="text-xs text-gray-600 text-center leading-5">
          You can change these settings anytime. Critical security alerts will
          always be sent for account protection.
        </Text>
      </View>
    </ScrollView>
  );
}
