import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface ExternalLinkProps {
  url: string;
  title: string;
  subtitle?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  showExternalIcon?: boolean;
  onError?: (error: any) => void;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  url,
  title,
  subtitle,
  iconName,
  showExternalIcon = true,
  onError,
}) => {
  const handlePress = async () => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        controlsColor: "#3B82F6",
      });
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        Alert.alert(
          "Error",
          "Could not open the link. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 active:bg-gray-50"
      activeOpacity={0.7}
    >
      {/* Icon */}
      {iconName && (
        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
          <Ionicons name={iconName} size={20} color="#3B82F6" />
        </View>
      )}

      {/* Content */}
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>

      {/* External Icon */}
      {showExternalIcon && (
        <Ionicons name="open-outline" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
};
