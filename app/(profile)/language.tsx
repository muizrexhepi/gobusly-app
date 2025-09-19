import { LANGUAGES } from "@/src/constants/languages";
import i18n from "@/src/i18n";
import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isSelected = false,
  disabled = false,
  flag = null,
  isLastItem = false,
  isLoading = false,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  flag?: string | null;
  isLastItem?: boolean;
  isLoading?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`flex-row items-center p-4 ${
      disabled ? "opacity-60" : ""
    } ${!isLastItem ? "border-b border-gray-100" : ""}`}
    activeOpacity={0.7}
  >
    <View className="w-8 h-8 rounded-lg flex items-center justify-center mr-4 bg-gray-100">
      {flag ? (
        <Text className="text-xl">{flag}</Text>
      ) : (
        icon && <Ionicons name={icon} size={18} color="#4B5563" />
      )}
    </View>
    <View className="flex-1">
      <Text className="text-base font-medium text-gray-900">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
      )}
    </View>
    <View className="flex-row items-center">
      {isLoading && (
        <ActivityIndicator size="small" color="#15203e" className="mr-2" />
      )}
      {isSelected && !isLoading && (
        <Ionicons name="checkmark-circle" size={24} color="#15203e" />
      )}
    </View>
  </TouchableOpacity>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <View className="mb-6 rounded-2xl overflow-hidden bg-white mx-4">
    {children}
  </View>
);

const LANGUAGE_STORAGE_KEY = "@user_language";

export default function LanguageScreen() {
  const { t } = useTranslation();
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [updatingLanguage, setUpdatingLanguage] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        let savedLanguage = i18n.language || "en";

        if (isAuthenticated && user?.language) {
          savedLanguage = user.language;
        } else if (!i18n.language || i18n.language === "cimode") {
          const localLanguage =
            await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
          if (localLanguage !== null) {
            savedLanguage = localLanguage;
          }
        }

        setSelectedLanguage(savedLanguage);

        if (i18n.language !== savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Failed to load language from storage", error);
        Alert.alert(t("common.error"), "Failed to load language preferences");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadLanguage();
  }, [isAuthenticated, user, t]);

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === selectedLanguage || updatingLanguage) return;

    setUpdatingLanguage(languageCode);

    try {
      setSelectedLanguage(languageCode);
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);

      if (isAuthenticated && user) {
        try {
          await profileService.updateLanguage(user._id, languageCode);
          updateUser({ language: languageCode });
          console.log(
            "Language updated in user profile (API + local):",
            languageCode
          );
        } catch (err) {
          console.error("Failed to update language in backend:", err);
        }
      }

      const languageName = t(`languages.${languageCode}`);
      Alert.alert(
        t("settings.languageUpdated"),
        t("settings.languageChangedTo", { language: languageName }) +
          " " +
          (isAuthenticated
            ? t("settings.accountSynced")
            : t("settings.signInToSync"))
      );
    } catch (error) {
      console.error("Failed to save language", error);
      Alert.alert(t("common.error"), "Failed to update language");

      await i18n.changeLanguage(selectedLanguage);
      setSelectedLanguage(selectedLanguage);
    } finally {
      setUpdatingLanguage(null);
    }
  };

  if (isInitialLoading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#15203e" />
        <Text className="mt-2 text-sm text-gray-600">
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 py-4">
      <Section>
        {LANGUAGES.map((language, index) => (
          <MenuItem
            key={language.code}
            title={t(`languages.${language.code}`)}
            subtitle={language.nativeName}
            flag={language.flag}
            isSelected={selectedLanguage === language.code && !updatingLanguage}
            isLoading={updatingLanguage === language.code}
            onPress={() => handleLanguageSelect(language.code)}
            disabled={!!updatingLanguage}
            isLastItem={index === LANGUAGES.length - 1}
          />
        ))}
      </Section>

      <View className="px-4 mt-2 mb-6">
        <Text className="text-xs text-gray-500 text-center leading-5">
          {isAuthenticated
            ? t("settings.syncMessage")
            : t("settings.signInToSync")}
        </Text>
      </View>
    </ScrollView>
  );
}
