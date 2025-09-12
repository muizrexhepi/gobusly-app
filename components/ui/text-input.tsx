// components/ui/text-input.tsx
import React from "react";
import {
  TextInput as RNTextInput,
  Text,
  TextInputProps,
  View,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <View className={`mb-6 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      )}
      <RNTextInput
        className={`w-full px-4 py-4 border rounded-xl text-base text-gray-900 bg-white ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};
