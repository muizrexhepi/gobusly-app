import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { UserNotifications } from "@/src/types/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GUEST_NOTIFICATIONS_KEY = "guest_notification_preferences";

const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isSwitch = false,
  value = false,
  disabled = false,
  isLoading = false,
  isLastItem = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  isSwitch?: boolean;
  value?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isLastItem?: boolean;
}) => {
  if (isSwitch) {
    return (
      <View
        className={`flex-row items-center p-4 ${disabled || isLoading ? "opacity-60" : ""} ${
          !isLastItem ? "border-b border-gray-100" : ""
        }`}
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
        <View className="w-fit items-end">
          {isLoading ? (
            <ActivityIndicator size="small" color="#15203e" />
          ) : (
            <Switch
              value={value}
              onValueChange={onPress}
              trackColor={{ true: "#15203e", false: "#e5e7eb" }}
              thumbColor="#fff"
              disabled={disabled}
            />
          )}
        </View>
      </View>
    );
  }

  // For non-switch items (like "Manage Device Notifications"), the whole row is touchable
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`flex-row items-center p-4 ${disabled || isLoading ? "opacity-60" : ""} ${
        !isLastItem ? "border-b border-gray-100" : ""
      }`}
      activeOpacity={0.7}
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
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
};

const Section = ({ children }: { children: React.ReactNode }) => (
  <View className="mb-6 rounded-2xl overflow-hidden bg-white mx-4">
    {children}
  </View>
);

const defaultNotifications: UserNotifications = {
  booking_confirmations: true,
  departure_reminders: true,
  promotions: false,
  account_updates: true,
  security_alerts: true,
};

// Icon mapping for notification types
const getNotificationIcon = (
  key: string
): React.ComponentProps<typeof Ionicons>["name"] => {
  const iconMap: Record<string, React.ComponentProps<typeof Ionicons>["name"]> =
    {
      booking_confirmations: "checkmark-circle-outline",
      departure_reminders: "alarm-outline",
      promotions: "pricetag-outline",
      account_updates: "settings-outline",
      security_alerts: "shield-checkmark-outline",
    };
  return iconMap[key] || "notifications-outline";
};

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [guestNotifications, setGuestNotifications] =
    useState<UserNotifications>(defaultNotifications);

  console.log({ user });

  useEffect(() => {
    if (!isAuthenticated) loadGuestNotifications();
  }, [isAuthenticated]);

  const loadGuestNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem(GUEST_NOTIFICATIONS_KEY);
      if (saved) setGuestNotifications(JSON.parse(saved));
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
    }
  };

  const getCurrentNotifications = (): UserNotifications => {
    return isAuthenticated
      ? user?.notifications || defaultNotifications
      : guestNotifications;
  };

  const handleToggle = async (key: keyof UserNotifications) => {
    // Prevent multiple simultaneous updates
    if (loadingKey) return;

    setLoadingKey(key);

    try {
      const currentNotifications = getCurrentNotifications();
      const newValue = !currentNotifications[key];

      console.log(
        `Toggling ${key} from ${currentNotifications[key]} to ${newValue}`
      );

      if (isAuthenticated && user?._id) {
        // Optimistic update - update UI immediately for better UX
        const updatedNotifications = {
          ...currentNotifications,
          [key]: newValue,
        };
        updateUser({ notifications: updatedNotifications });

        try {
          // Call API to sync with backend
          const response = await profileService.editNotifications(
            user._id,
            key,
            newValue
          );
          console.log("API response:", response);

          // If the API returns updated notifications, use those
          if (response.notifications) {
            updateUser({ notifications: response.notifications });
          }
        } catch (apiError: any) {
          console.error(`API call failed for ${key}:`, apiError);

          // Revert optimistic update on API failure
          updateUser({ notifications: currentNotifications });

          // Only show error if it's not a success message being treated as error
          if (!apiError.message?.includes("successfully")) {
            throw apiError;
          }
        }
      } else {
        // For guest mode
        const updatedNotifications: UserNotifications = {
          ...currentNotifications,
          [key]: newValue,
        };
        await saveGuestNotifications(updatedNotifications);
      }
    } catch (error: any) {
      console.error(`Failed to update ${key}:`, error);

      Alert.alert(
        t("notificationsScreen.updateErrorTitle", "Update Failed"),
        error.message ||
          t(
            "notificationsScreen.updateErrorMessage",
            "Failed to update notification settings. Please try again."
          )
      );
    } finally {
      setLoadingKey(null);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert(
        "Unable to Open Settings",
        "Please manually open your device settings to manage notifications for this app."
      );
    });
  };

  const currentNotifications = getCurrentNotifications();

  const notificationKeys = Object.keys(currentNotifications).filter(
    (key) =>
      key !== "sms" &&
      typeof currentNotifications[key as keyof UserNotifications] === "boolean"
  ) as (keyof UserNotifications)[];

  return (
    <ScrollView className="flex-1 bg-gray-100 py-4">
      {!isAuthenticated && (
        <View className="mx-4 mb-6 rounded-2xl overflow-hidden bg-white p-4">
          <Text className="text-sm font-semibold text-blue-900 mb-1">
            {t("notificationsScreen.guestModeTitle", "Guest Mode")}
          </Text>
          <Text className="text-xs text-blue-800 leading-5">
            {t(
              "notificationsScreen.guestModeMessage",
              "Your notification preferences are saved locally. Sign in to sync across devices and receive personalized updates."
            )}
          </Text>
        </View>
      )}

      <Section>
        <MenuItem
          icon="phone-portrait-outline"
          title={t(
            "notificationsScreen.manageDeviceNotifications",
            "Manage Device Notifications"
          )}
          subtitle={t(
            "notificationsScreen.manageDeviceNotificationsSubtitle",
            "Open device settings to enable or disable all push notifications for this app"
          )}
          onPress={openAppSettings}
        />
      </Section>

      <Section>
        {notificationKeys.map((key, index) => (
          <MenuItem
            key={key}
            icon={getNotificationIcon(key)}
            title={t(
              `notificationsScreen.${key}Label`,
              key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            )}
            subtitle={t(
              `notificationsScreen.${key}Description`,
              `Manage ${key.replace(/_/g, " ")} notifications`
            )}
            onPress={() => handleToggle(key)}
            isSwitch
            value={currentNotifications[key]}
            isLoading={loadingKey === key}
            isLastItem={index === notificationKeys.length - 1}
          />
        ))}
      </Section>

      <View className="mx-4 mt-2 mb-6 p-4 bg-gray-200 rounded-xl">
        <Text className="text-xs text-gray-600 text-center leading-5">
          {t(
            "notificationsScreen.footerInfo",
            "You can change these settings anytime. Critical security alerts will always be sent for account protection."
          )}
        </Text>
      </View>
    </ScrollView>
  );
}
