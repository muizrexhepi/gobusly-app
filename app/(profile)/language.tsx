"use client";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Reusable component for each list item
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isSelected = false,
  disabled = false,
  flag = null,
  isLastItem = false,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  flag?: string | null;
  isLastItem?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`flex-row items-center p-4 ${disabled ? "opacity-50" : ""} ${
      !isLastItem ? "border-b border-gray-100" : ""
    }`}
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
    {isSelected ? (
      <Ionicons name="checkmark-circle" size={24} color="#15203e" />
    ) : null}
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

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === selectedLanguage) return;

    setIsLoading(true);
    try {
      // Here you would typically save to your backend/storage
      // await settingsService.updateLanguage(languageCode);

      setSelectedLanguage(languageCode);

      // Show success message
      const language = languages.find((l) => l.code === languageCode);
      Alert.alert(
        "Language Updated",
        `Language changed to ${language?.name}. Some changes may require restarting the app.`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update language. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 py-4">
      {/* Language Section */}
      <Section title="Display Language">
        {isLoading && (
          <View className="absolute inset-0 z-10 bg-white bg-opacity-70 flex items-center justify-center">
            <ActivityIndicator size="large" color="#15203e" />
          </View>
        )}
        {languages.map((language, index) => (
          <MenuItem
            key={language.code}
            title={language.name}
            subtitle={language.nativeName}
            flag={language.flag}
            isSelected={selectedLanguage === language.code}
            onPress={() => handleLanguageSelect(language.code)}
            disabled={isLoading}
            isLastItem={index === languages.length - 1}
          />
        ))}
      </Section>

      {/* Info Footer */}
      <View className="px-4 mt-2 mb-6">
        <Text className="text-xs text-gray-500 text-center leading-5">
          Changes to the display language will be applied immediately.
        </Text>
      </View>
    </ScrollView>
  );
}
