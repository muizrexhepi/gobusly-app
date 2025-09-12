// components/ui/Avatar.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showBorder?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = "md",
  showBorder = false,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { width: 40, height: 40 };
      case "md":
        return { width: 56, height: 56 };
      case "lg":
        return { width: 80, height: 80 };
      case "xl":
        return { width: 120, height: 120 };
      default:
        return { width: 56, height: 56 };
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-lg";
      case "lg":
        return "text-2xl";
      case "xl":
        return "text-4xl";
      default:
        return "text-lg";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 24;
      case "lg":
        return 32;
      case "xl":
        return 48;
      default:
        return 24;
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={sizeStyles}
      className={`
        rounded-full
        overflow-hidden
        items-center
        justify-center
        ${showBorder ? "border-4 border-white shadow-lg" : ""}
      `}
    >
      {uri ? (
        <Image source={{ uri }} style={sizeStyles} className="rounded-full" />
      ) : name ? (
        <View
          style={sizeStyles}
          className="bg-blue-500 rounded-full items-center justify-center"
        >
          <Text className={`${getTextSize()} font-bold text-white`}>
            {getInitials(name)}
          </Text>
        </View>
      ) : (
        <View
          style={sizeStyles}
          className="bg-gray-200 rounded-full items-center justify-center"
        >
          <Ionicons name="person" size={getIconSize()} color="#9CA3AF" />
        </View>
      )}
    </View>
  );
};
