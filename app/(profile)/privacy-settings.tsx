import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { UserPrivacySettings } from "@/src/types/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  disabled = false,
  isSwitch = false,
  value = false,
  isLoading = false,
  isLastItem = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  isSwitch?: boolean;
  value?: boolean;
  isLoading?: boolean;
  isLastItem?: boolean;
}) => {
  if (isSwitch) {
    return (
      <View
        className={`flex-row items-center p-4 ${disabled ? "opacity-60" : ""} ${
          !isLastItem ? "border-b border-gray-100" : ""
        }`}
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

  // For non-switch items (buttons), the whole row is touchable
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center p-4 ${disabled ? "opacity-60" : ""} ${
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
      {isLoading ? (
        <ActivityIndicator size="small" color="#15203e" className="mr-2" />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );
};

const Section = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <View className="mb-6 rounded-2xl overflow-hidden bg-white mx-4">
    {/* {title && (
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      </View>
    )} */}
    {children}
  </View>
);

interface PrivacyItem {
  key: keyof UserPrivacySettings;
  labelKey: string;
  descriptionKey: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}

const privacyItems: PrivacyItem[] = [
  {
    key: "share_contact_with_operators",
    labelKey: "contactSharingLabel",
    descriptionKey: "contactSharingDescription",
    icon: "phone-portrait-outline",
  },
  {
    key: "location_based_recommendations",
    labelKey: "locationSuggestionsLabel",
    descriptionKey: "locationSuggestionsDescription",
    icon: "location-outline",
  },
  {
    key: "travel_history_analytics",
    labelKey: "personalizedRecommendationsLabel",
    descriptionKey: "personalizedRecommendationsDescription",
    icon: "analytics-outline",
  },
  {
    key: "marketing_communications",
    labelKey: "promotionalOffersLabel",
    descriptionKey: "promotionalOffersDescription",
    icon: "mail-outline",
  },
  {
    key: "data_analytics",
    labelKey: "serviceImprovementLabel",
    descriptionKey: "serviceImprovementDescription",
    icon: "bar-chart-outline",
  },
  {
    key: "emergency_contact_sharing",
    labelKey: "emergencyContactSharingLabel",
    descriptionKey: "emergencyContactSharingDescription",
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
  const { t } = useTranslation();
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
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
      Alert.alert(
        t("common.error", "Error"),
        t("privacyScreen.saveError", "Failed to save privacy preferences")
      );
    }
  };

  const getCurrentPrivacySettings = (): UserPrivacySettings => {
    return isAuthenticated
      ? user?.privacySettings || defaultPrivacySettings
      : guestPrivacySettings;
  };

  const handleToggle = async (key: keyof UserPrivacySettings) => {
    if (loadingKey) return;

    setLoadingKey(key);

    try {
      const currentSettings = getCurrentPrivacySettings();
      const newValue = !currentSettings[key];

      console.log(
        `Toggling privacy ${key} from ${currentSettings[key]} to ${newValue}`
      );

      if (isAuthenticated && user?._id) {
        const updatedSettings: UserPrivacySettings = {
          ...currentSettings,
          [key]: newValue,
        };
        updateUser({ privacySettings: updatedSettings });

        try {
          const response = await profileService.editPrivacySettings(
            user._id,
            updatedSettings
          );
          console.log("Privacy API response:", response);

          if (response.privacySettings) {
            updateUser({ privacySettings: response.privacySettings });
          }
        } catch (apiError: any) {
          console.error(`Privacy API call failed for ${key}:`, apiError);

          updateUser({ privacySettings: currentSettings });

          if (!apiError.message?.includes("successfully")) {
            throw apiError;
          }
        }
      } else {
        const updatedSettings: UserPrivacySettings = {
          ...currentSettings,
          [key]: newValue,
        };
        await saveGuestPrivacySettings(updatedSettings);
      }
    } catch (error: any) {
      console.error(`Failed to update privacy ${key}:`, error);

      Alert.alert(
        t("privacyScreen.updateErrorTitle", "Update Failed"),
        error.message ||
          t(
            "privacyScreen.updateErrorMessage",
            "Failed to update privacy settings. Please try again."
          )
      );
    } finally {
      setLoadingKey(null);
    }
  };

  const handleExportData = async () => {
    if (!user?._id) return;

    try {
      const blob = await profileService.exportUserData(user._id);
      console.log({ blob });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "user-data.json";
      link.click();

      window.URL.revokeObjectURL(url);

      console.log("User data exported successfully");
    } catch (error) {
      console.error("Failed to export user data:", error);
      Alert.alert("Error", "Could not export user data.");
    }
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      t("privacyScreen.resetTitle", "Reset Privacy Settings"),
      t(
        "privacyScreen.resetMessage",
        "This will reset all privacy settings to their default values. Are you sure?"
      ),
      [
        {
          text: t("common.cancel", "Cancel"),
          style: "cancel",
        },
        {
          text: t("privacyScreen.resetButton", "Reset"),
          style: "destructive",
          onPress: async () => {
            setLoadingKey("reset");
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

              Alert.alert(
                t("common.success", "Success"),
                t(
                  "privacyScreen.resetSuccess",
                  "Privacy settings have been reset to defaults"
                )
              );
            } catch (error: any) {
              Alert.alert(
                t("common.error", "Error"),
                error.message ||
                  t(
                    "privacyScreen.resetError",
                    "Failed to reset privacy settings"
                  )
              );
            } finally {
              setLoadingKey(null);
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
        <View className="mx-4 mb-6 rounded-2xl overflow-hidden bg-white p-4">
          <Text className="text-sm font-semibold text-blue-900 mb-1">
            {t("privacyScreen.guestModeTitle", "Guest Mode")}
          </Text>
          <Text className="text-xs text-blue-800 leading-5">
            {t(
              "privacyScreen.guestModeMessage",
              "Your privacy preferences are saved locally. Sign in to sync across devices and enjoy enhanced privacy controls."
            )}
          </Text>
        </View>
      )}

      {/* Privacy Controls Section */}
      <Section
        title={t("privacyScreen.privacyControlsTitle", "Privacy Controls")}
      >
        {privacyItems.map((item, index) => (
          <MenuItem
            key={item.key}
            icon={item.icon}
            title={t(`privacyScreen.${item.labelKey}`, item.labelKey)}
            subtitle={t(
              `privacyScreen.${item.descriptionKey}`,
              item.descriptionKey
            )}
            isSwitch
            value={currentSettings[item.key]}
            onPress={() => handleToggle(item.key)}
            disabled={!!loadingKey}
            isLoading={loadingKey === item.key}
            isLastItem={index === privacyItems.length - 1}
          />
        ))}
      </Section>

      {/* Data Management Section */}
      <Section
        title={t("privacyScreen.dataManagementTitle", "Data Management")}
      >
        <MenuItem
          icon="reload-outline"
          title={t("privacyScreen.resetToDefaultsLabel", "Reset to Defaults")}
          subtitle={t(
            "privacyScreen.resetToDefaultsDescription",
            "Restore all privacy settings to recommended defaults"
          )}
          onPress={handleResetToDefaults}
          destructive
          disabled={!!loadingKey}
          isLoading={loadingKey === "reset"}
        />
        {isAuthenticated && (
          <MenuItem
            icon="download-outline"
            title={t("privacyScreen.exportDataLabel", "Export My Data")}
            subtitle={t(
              "privacyScreen.exportDataDescription",
              "Download a copy of your personal data"
            )}
            onPress={handleExportData}
            isLastItem
          />
        )}
      </Section>

      {/* Footer & Legal Links */}
      <View className="px-4 mt-2 mb-6">
        <Text className="text-xs text-gray-500 text-center leading-5">
          {t(
            "privacyScreen.footerInfo",
            "These settings control how GoBusly and partner bus operators can interact with you and use your data. We never sell your personal information to third parties. Some settings may be required for essential trip communications."
          )}
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
            {t("privacyScreen.privacyPolicyLink", "Privacy Policy")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            WebBrowser.openBrowserAsync("https://gobusly.com/legal/data-policy")
          }
        >
          <Text className="text-pink-600 text-sm font-medium">
            {t("privacyScreen.dataPolicyLink", "Data Policy")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
