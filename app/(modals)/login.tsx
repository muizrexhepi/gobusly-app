"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const {
    loginWithGoogle,
    loginWithApple,
    loginWithEmail,
    isLoading,
    error,
    clearError,
    checkAppleAuthAvailability,
    isAuthenticated,
  } = useAuth();

  // Check Apple availability
  useEffect(() => {
    checkAppleAuthAvailability().then(setIsAppleAvailable);
  }, [checkAppleAuthAvailability]);

  // Handle authentication success
  useEffect(() => {
    if (isAuthenticated) {
      router.back();
    }
  }, [isAuthenticated]);

  // Handle keyboard visibility
  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Error handling
  useEffect(() => {
    if (error) {
      Alert.alert("Authentication Error", error, [
        { text: "Try Again", onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const handleClose = () => {
    clearError();
    router.back();
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleEmailContinue = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your email address to continue."
      );
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      const result = await loginWithEmail(email);
      if (result.success) {
        router.push({
          pathname: "/(auth)/verify-otp",
          params: { email },
        });
      } else {
        Alert.alert(
          "Verification Failed",
          result.error ||
            "We couldn't send a verification code. Please check your email and try again.",
          [{ text: "Retry", style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Please check your internet connection and try again.",
        [{ text: "Retry", style: "default" }]
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        Alert.alert(
          "Google Sign-In Failed",
          result.error ||
            "We couldn't sign you in with Google. Please try again.",
          [{ text: "Retry", style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Please check your internet connection and try again.",
        [{ text: "Retry", style: "default" }]
      );
    }
  };

  const handleAppleLogin = async () => {
    if (!isAppleAvailable) {
      Alert.alert(
        "Apple Sign-In Unavailable",
        "Apple Sign-In is not available on this device. Please use email or Google instead.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    try {
      const result = await loginWithApple();
      if (!result.success) {
        Alert.alert(
          "Apple Sign-In Failed",
          result.error ||
            "We couldn't sign you in with Apple. Please try again.",
          [{ text: "Retry", style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Please check your internet connection and try again.",
        [{ text: "Retry", style: "default" }]
      );
    }
  };

  const isValidEmail = email.trim() && validateEmail(email);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar barStyle="dark-content" backgroundColor="white" />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 items-center justify-center"
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-900">
                Log in or sign up
              </Text>
              <View className="w-8 h-8" />
            </View>

            <View className="flex-1 px-6">
              {/* Welcome Section */}
              <View className="py-8">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Gobusly
                </Text>
                <Text className="text-base text-gray-600">
                  Create an account or sign in to continue
                </Text>
              </View>

              {/* Email Input Section */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-3">
                  Email
                </Text>
                <View
                  className={`border-2 rounded-xl bg-white ${
                    emailFocused ? "border-pink-500" : "border-gray-200"
                  }`}
                >
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="Enter your email address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    importantForAutofill="yes"
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!isLoading}
                    className="px-4 py-4 text-base text-gray-900 font-medium"
                    style={{ minHeight: 56 }}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleEmailContinue}
                disabled={!isValidEmail || isLoading}
                activeOpacity={0.8}
                className={`w-full py-4 rounded-xl mb-8 ${
                  !isValidEmail || isLoading
                    ? "bg-gray-200"
                    : "bg-pink-600 active:bg-pink-700"
                }`}
                style={
                  !isValidEmail || isLoading
                    ? {}
                    : {
                        shadowColor: "#FF385C",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 4,
                      }
                }
              >
                <Text
                  className={`font-semibold text-center text-base ${
                    !isValidEmail || isLoading ? "text-gray-400" : "text-white"
                  }`}
                >
                  {isLoading ? "Sending verification code..." : "Continue"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-8">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="px-6 text-gray-500 text-sm font-medium">
                  or
                </Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Social Login Buttons */}
              <View className="gap-4 mb-8">
                {/* Apple Login */}
                {isAppleAvailable && (
                  <TouchableOpacity
                    onPress={handleAppleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className={`w-full py-4 px-6 border-2 border-gray-200 rounded-xl flex-row items-center justify-center ${
                      isLoading ? "bg-gray-50" : "bg-white active:bg-gray-50"
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 3,
                      elevation: 1,
                    }}
                  >
                    <Ionicons
                      name="logo-apple"
                      size={20}
                      color={isLoading ? "#9CA3AF" : "#000"}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      className={`font-semibold text-base ${
                        isLoading ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      Continue with Apple
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Google Login */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  className={`w-full py-4 px-6 border-2 border-gray-200 rounded-xl flex-row items-center justify-center ${
                    isLoading ? "bg-gray-50" : "bg-white active:bg-gray-50"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                >
                  <Ionicons
                    name="logo-google"
                    size={20}
                    color={isLoading ? "#9CA3AF" : "#4285F4"}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    className={`font-semibold text-base ${
                      isLoading ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Terms and Privacy */}
              {!keyboardVisible && (
                <View className="mt-auto pb-6">
                  <Text className="text-xs text-gray-500 text-center leading-5">
                    By continuing, you agree to our{" "}
                    <Text className="text-gray-700 font-medium">
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text className="text-gray-700 font-medium">
                      Privacy Policy
                    </Text>
                    .
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
