"use client";

import { Stack, useRouter } from "expo-router";
import { Check, ChevronLeft, DollarSign, Globe } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
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

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", country: "United States" },
  { code: "EUR", name: "Euro", symbol: "€", country: "European Union" },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    country: "United Kingdom",
  },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", country: "Japan" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", country: "Canada" },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    country: "Australia",
  },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", country: "Switzerland" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", country: "China" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", country: "Sweden" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", country: "Norway" },
];

export default function LanguageCurrencyScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
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

  const handleCurrencySelect = async (currencyCode: string) => {
    if (currencyCode === selectedCurrency) return;

    setIsLoading(true);
    try {
      // Here you would typically save to your backend/storage
      // await settingsService.updateCurrency(currencyCode);

      setSelectedCurrency(currencyCode);

      // Show success message
      const currency = currencies.find((c) => c.code === currencyCode);
      Alert.alert(
        "Currency Updated",
        `Currency changed to ${currency?.name} (${currency?.symbol})`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update currency. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft color="#fff" size={24} />
    </TouchableOpacity>
  );

  const SelectionItem = ({
    title,
    subtitle,
    leftContent,
    isSelected,
    onPress,
    disabled = false,
  }: {
    title: string;
    subtitle?: string;
    leftContent: React.ReactNode;
    isSelected: boolean;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`bg-white p-4 border-b border-gray-100 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {leftContent}
          <View className="ml-4 flex-1">
            <Text className="text-base font-medium text-gray-900">{title}</Text>
            {subtitle && (
              <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
            )}
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator color="#db2777" size="small" />
        ) : isSelected ? (
          <View className="w-6 h-6 rounded-full bg-pink-600 items-center justify-center">
            <Check color="#fff" size={16} />
          </View>
        ) : (
          <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Language & Currency",
          headerStyle: { backgroundColor: "#db2777" },
          headerTitleStyle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
          headerTintColor: "#fff",
          headerLeft: backButton,
        }}
      />

      <ScrollView className="bg-gray-50 flex-1">
        {/* Language Section */}
        <View className="mt-6">
          <View className="px-6 py-3 bg-gray-50">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                <Globe color="#3b82f6" size={20} />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-900">
                  Display Language
                </Text>
                <Text className="text-sm text-gray-600">
                  Choose your preferred language for the app
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white">
            {languages.map((language) => (
              <SelectionItem
                key={language.code}
                title={language.name}
                subtitle={language.nativeName}
                leftContent={
                  <View className="w-8 h-8 items-center justify-center">
                    <Text className="text-2xl">{language.flag}</Text>
                  </View>
                }
                isSelected={selectedLanguage === language.code}
                onPress={() => handleLanguageSelect(language.code)}
              />
            ))}
          </View>
        </View>

        {/* Currency Section */}
        <View className="mt-8 mb-6">
          <View className="px-6 py-3 bg-gray-50">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                <DollarSign color="#10b981" size={20} />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-900">
                  Currency
                </Text>
                <Text className="text-sm text-gray-600">
                  Select your preferred currency for pricing
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white">
            {currencies.map((currency) => (
              <SelectionItem
                key={currency.code}
                title={`${currency.name} (${currency.code})`}
                subtitle={currency.country}
                leftContent={
                  <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                    <Text className="text-sm font-semibold text-gray-700">
                      {currency.symbol}
                    </Text>
                  </View>
                }
                isSelected={selectedCurrency === currency.code}
                onPress={() => handleCurrencySelect(currency.code)}
              />
            ))}
          </View>
        </View>

        {/* Info Footer */}
        <View className="px-6 py-4 bg-blue-50 mx-6 rounded-xl mb-6">
          <Text className="text-sm text-blue-700 text-center leading-5">
            💡 Language and currency changes will be applied immediately. Prices
            will be converted using current exchange rates.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
