"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOTPScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const { verifyOTP, loginWithEmailOTP, isLoading } = useAuthStore();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleBack = () => {
    dismissKeyboard();
    router.back();
  };

  const handleContinue = async () => {
    dismissKeyboard();

    if (otp.length !== 4) {
      Alert.alert("Error", "Please enter the complete 4-digit code");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email not found. Please try again.");
      return;
    }

    try {
      await verifyOTP(email, otp);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Invalid verification code. Please try again.");
      setOtp("");
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || !email) return;

    dismissKeyboard();

    try {
      await loginWithEmailOTP(email);
      setResendTimer(30);
      Alert.alert("Success", "Verification code sent successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to resend code. Please try again.");
    }
  };

  const handleOtpChange = (text: string) => {
    setOtp(text);
    if (text.length === 4) {
      handleAutoSubmit(text);
    }
  };

  const handleAutoSubmit = async (otpText: string) => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please try again.");
      return;
    }

    try {
      await verifyOTP(email, otpText);
      router.replace("/(tabs)/profile");
    } catch (error) {
      Alert.alert("Error", "Invalid verification code. Please try again.");
      setOtp("");
    }
  };

  const isOtpComplete = otp.length === 4;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
              Confirm your email
            </Text>
          </View>

          <View className="flex-1 px-6 py-8">
            {/* Title */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Enter the code we sent
              </Text>
              <Text className="text-gray-600">
                We sent a 4-digit code to{" "}
                <Text className="font-medium text-gray-900">{email}</Text>
              </Text>
            </View>

            {/* OTP Input */}
            <View className="mb-8">
              <OtpInput
                numberOfDigits={4}
                focusColor="#ec4899"
                focusStickBlinkingDuration={500}
                onTextChange={handleOtpChange}
                onFilled={handleOtpChange}
                textInputProps={{
                  accessibilityLabel: "One-Time Password",
                }}
                theme={{
                  containerStyle: {
                    marginVertical: 0,
                  },
                  inputsContainerStyle: {
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                  },
                  pinCodeContainerStyle: {
                    width: 60,
                    height: 64,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                  pinCodeTextStyle: {
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#111827",
                  },
                  focusStickStyle: {
                    backgroundColor: "#ec4899",
                  },
                  focusedPinCodeContainerStyle: {
                    borderColor: "#ec4899",
                    borderWidth: 2,
                  },
                }}
              />
            </View>

            {/* Resend Code */}
            <View className="mb-8">
              {resendTimer > 0 ? (
                <Text className="text-center text-gray-500">
                  Didn't get a code? Resend in {resendTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP}>
                  <Text className="text-center text-pink-600 font-medium">
                    Didn't get a code? Send again
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Continue Button */}
            <View className="mt-auto">
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!isOtpComplete}
                loading={isLoading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
