// components/ui/CustomButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  iconName,
  iconPosition = "left",
  fullWidth = true,
  className = "",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 active:bg-blue-700";
      case "secondary":
        return "bg-gray-100 active:bg-gray-200";
      case "outline":
        return "bg-transparent border border-blue-600 active:bg-blue-50";
      case "danger":
        return "bg-red-600 active:bg-red-700";
      default:
        return "bg-blue-600 active:bg-blue-700";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "py-2 px-4";
      case "md":
        return "py-3 px-6";
      case "lg":
        return "py-4 px-8";
      default:
        return "py-3 px-6";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return "text-gray-700";
      case "outline":
        return "text-blue-600";
      default:
        return "text-white";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "secondary":
        return "#374151";
      case "outline":
        return "#2563EB";
      default:
        return "#FFFFFF";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? "w-full" : ""}
        rounded-xl
        flex-row items-center justify-center
        ${disabled || isLoading ? "opacity-50" : ""}
        ${className}
      `}
    >
      {isLoading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <View className="flex-row items-center">
          {iconName && iconPosition === "left" && (
            <Ionicons
              name={iconName}
              size={20}
              color={getIconColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className={`
              font-semibold
              ${getTextColor()}
              ${size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"}
            `}
          >
            {title}
          </Text>
          {iconName && iconPosition === "right" && (
            <Ionicons
              name={iconName}
              size={20}
              color={getIconColor()}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
