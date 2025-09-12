import { CustomButton } from "@/components/ui/custom-button";
import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EmailLoginScreen() {
  const [email, setEmail] = useState("");
  const { loginWithEmailOTP, isLoading } = useAuthStore();

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await loginWithEmailOTP(email);
      // Navigate to OTP verification screen
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { email },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send verification code. Please try again."
      );
    }
  };

  const isValidEmail = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-4"
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Log in or sign up
          </Text>
        </View>

        <View className="flex-1 px-6 py-8">
          {/* Title */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Enter your email
            </Text>
            <Text className="text-gray-600">
              We'll send you a verification code to confirm your email address.
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-base text-gray-900 bg-white focus:border-pink-500"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            />
          </View>

          {/* Continue Button */}
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            disabled={!isValidEmail || isLoading}
            isLoading={isLoading}
            className="mb-6"
          />

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="px-4 text-gray-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Alternative Login Options */}
          <View className="space-y-3">
            <CustomButton
              title="Continue with Apple"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Apple login will be available soon."
                )
              }
              variant="outline"
              iconName="logo-apple"
              iconPosition="left"
              disabled={isLoading}
            />

            <CustomButton
              title="Continue with Google"
              onPress={() => {
                // Handle Google login
                router.back();
                setTimeout(() => {
                  router.push("/(modals)/login");
                }, 100);
              }}
              variant="outline"
              iconName="logo-google"
              iconPosition="left"
              disabled={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
