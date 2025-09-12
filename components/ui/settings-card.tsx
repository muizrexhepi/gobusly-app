// components/ui/SettingsCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  showChevron?: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  subtitle,
  iconName,
  onPress,
  showChevron = true,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 active:bg-gray-50"
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
        <Ionicons name={iconName} size={20} color="#3B82F6" />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>

      {/* Chevron */}
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
};
