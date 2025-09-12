// components/ui/button.tsx
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline" | "danger";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  className = "",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return disabled || loading
          ? "bg-gray-300"
          : "bg-pink-600 active:bg-pink-700";
      case "outline":
        return disabled || loading
          ? "bg-gray-100 border border-gray-300"
          : "bg-white border border-gray-300 active:bg-gray-50";
      case "danger":
        return disabled || loading
          ? "bg-gray-300"
          : "bg-red-600 active:bg-red-700";
      default:
        return disabled || loading
          ? "bg-gray-300"
          : "bg-pink-600 active:bg-pink-700";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "outline":
        return "text-gray-900";
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-xl flex-row items-center justify-center ${getVariantStyles()} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#6B7280" : "#FFFFFF"}
          size="small"
        />
      ) : (
        <Text className={`font-semibold text-lg ${getTextColor()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
