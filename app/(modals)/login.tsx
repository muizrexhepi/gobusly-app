"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
  const { t } = useTranslation();
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
      Alert.alert(
        t("auth.authenticationError", "Authentication Error"),
        error,
        [{ text: t("auth.tryAgain", "Try Again"), onPress: clearError }]
      );
    }
  }, [error, clearError, t]);

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
        t("auth.emailRequired", "Email Required"),
        t(
          "auth.emailRequiredMessage",
          "Please enter your email address to continue."
        )
      );
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(
        t("auth.invalidEmail", "Invalid Email"),
        t("auth.invalidEmailMessage", "Please enter a valid email address.")
      );
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
          t("auth.verificationFailed", "Verification Failed"),
          result.error ||
            t(
              "auth.verificationFailedMessage",
              "We couldn't send a verification code. Please check your email and try again."
            ),
          [{ text: t("common.retry", "Retry"), style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert(
        t("auth.connectionError", "Connection Error"),
        t(
          "auth.connectionErrorMessage",
          "Please check your internet connection and try again."
        ),
        [{ text: t("common.retry", "Retry"), style: "default" }]
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        Alert.alert(
          t("auth.googleSignInFailed", "Google Sign-In Failed"),
          result.error ||
            t(
              "auth.googleSignInFailedMessage",
              "We couldn't sign you in with Google. Please try again."
            ),
          [{ text: t("common.retry", "Retry"), style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert(
        t("auth.connectionError", "Connection Error"),
        t(
          "auth.connectionErrorMessage",
          "Please check your internet connection and try again."
        ),
        [{ text: t("common.retry", "Retry"), style: "default" }]
      );
    }
  };

  const handleAppleLogin = async () => {
    if (!isAppleAvailable) {
      Alert.alert(
        t("auth.appleSignInUnavailable", "Apple Sign-In Unavailable"),
        t(
          "auth.appleSignInUnavailableMessage",
          "Apple Sign-In is not available on this device. Please use email or Google instead."
        ),
        [{ text: t("common.ok", "OK"), style: "default" }]
      );
      return;
    }

    try {
      const result = await loginWithApple();
      if (!result.success) {
        Alert.alert(
          t("auth.appleSignInFailed", "Apple Sign-In Failed"),
          result.error ||
            t(
              "auth.appleSignInFailedMessage",
              "We couldn't sign you in with Apple. Please try again."
            ),
          [{ text: t("common.retry", "Retry"), style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert(
        t("auth.connectionError", "Connection Error"),
        t(
          "auth.connectionErrorMessage",
          "Please check your internet connection and try again."
        ),
        [{ text: t("common.retry", "Retry"), style: "default" }]
      );
    }
  };

  const isValidEmail = email.trim() && validateEmail(email);

  const SocialButton = ({
    onPress,
    icon,
    iconColor,
    text,
    disabled = false,
  }: {
    onPress: () => void;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    iconColor: string;
    text: string;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      className={`w-full h-14 border-2 border-border-light rounded-xl flex-row items-center justify-center ${
        disabled || isLoading ? "bg-bg-dark" : "bg-bg-light"
      }`}
    >
      <View className="w-5 h-5 items-center justify-center mr-3">
        <Ionicons
          name={icon}
          size={20}
          color={disabled || isLoading ? "#9CA3AF" : iconColor}
        />
      </View>
      <Text
        className={`font-semibold text-base ${
          disabled || isLoading ? "text-text-placeholder" : "text-text-dark"
        }`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-bg-light">
        <SafeAreaView className="flex-1 bg-bg-light">
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-light">
              <TouchableOpacity
                onPress={handleClose}
                className="w-10 h-10 items-center justify-center rounded-full bg-bg-dark"
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-text-dark">
                {t("auth.loginSignupTitle", "Log in or sign up")}
              </Text>
              <View className="w-10 h-10" />
            </View>

            <View className="flex-1 px-6">
              {/* Welcome Section */}
              <View className="py-8">
                <Text className="text-3xl font-bold text-text-dark mb-3">
                  {t("auth.welcomeTitle", "Welcome to GoBusly")}
                </Text>
                <Text className="text-base text-text-gray leading-6">
                  {t(
                    "auth.welcomeSubtitle",
                    "Create an account or sign in to continue"
                  )}
                </Text>
              </View>

              {/* Email Input Section */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-text-dark mb-3">
                  {t("auth.email", "Email")}
                </Text>
                <View
                  className={`border-2 rounded-xl bg-bg-light ${
                    emailFocused ? "border-accent" : "border-border-light"
                  }`}
                >
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder={t(
                      "auth.emailPlaceholder",
                      "Enter your email address"
                    )}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    importantForAutofill="yes"
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!isLoading}
                    className="px-4 py-4 text-base text-text-dark font-medium h-14"
                  />
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={handleEmailContinue}
                disabled={!isValidEmail || isLoading}
                activeOpacity={0.8}
                className={`w-full h-14 rounded-xl mb-8 items-center justify-center ${
                  !isValidEmail || isLoading ? "bg-bg-dark" : "bg-accent"
                }`}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                      className="mr-2"
                    />
                    <Text className="font-semibold text-center text-base text-text-light">
                      {t("auth.sendingCode", "Sending verification code...")}
                    </Text>
                  </View>
                ) : (
                  <Text
                    className={`font-semibold text-center text-base ${
                      !isValidEmail
                        ? "text-text-placeholder"
                        : "text-text-light"
                    }`}
                  >
                    {t("auth.continue", "Continue")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-8">
                <View className="flex-1 h-px bg-border-light" />
                <Text className="px-6 text-text-gray text-sm font-medium">
                  {t("auth.or", "or")}
                </Text>
                <View className="flex-1 h-px bg-border-light" />
              </View>

              {/* Social Login Buttons */}
              <View className="gap-4 mb-8">
                {/* Apple Login */}
                {isAppleAvailable && (
                  <SocialButton
                    onPress={handleAppleLogin}
                    icon="logo-apple"
                    iconColor="#000000"
                    text={t("auth.continueWithApple", "Continue with Apple")}
                    disabled={isLoading}
                  />
                )}

                {/* Google Login */}
                <SocialButton
                  onPress={handleGoogleLogin}
                  icon="logo-google"
                  iconColor="#4285F4"
                  text={t("auth.continueWithGoogle", "Continue with Google")}
                  disabled={isLoading}
                />
              </View>

              {/* Terms and Privacy */}
              {!keyboardVisible && (
                <View className="mt-auto pb-6">
                  <Text className="text-xs text-text-gray text-center leading-5">
                    {t("auth.termsMessage", "By continuing, you agree to our")}{" "}
                    <Text className="text-link font-medium">
                      {t("auth.termsOfService", "Terms of Service")}
                    </Text>{" "}
                    {t("auth.and", "and")}{" "}
                    <Text className="text-link font-medium">
                      {t("auth.privacyPolicy", "Privacy Policy")}
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
