"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { Mail, Phone, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const PRIMARY_PASSENGER_KEY = "primary_passenger_enabled";
const PRIMARY_ACCENT_COLOR = "#15203e";
const PINK_ACCENT_COLOR = "#be185d";

const SettingRow = ({
  icon,
  label,
  value,
  onPress,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  isEditing = false,
  onCancel,
  onSave,
  inputValue,
  onInputChange,
  keyboardType = "default",
  isSaving = false,
}: any) => (
  <View className="px-4">
    <View className="flex-row items-center py-4">
      <View className="flex-row items-center flex-1">
        <View className="w-6 items-center justify-center mr-4">{icon}</View>
        <Text className="text-base text-gray-900 font-medium">{label}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ true: PRIMARY_ACCENT_COLOR, false: "#e5e7eb" }}
          thumbColor="#fff"
        />
      ) : isEditing ? (
        <View className="flex-row items-center flex-shrink-0">
          <TouchableOpacity onPress={onCancel}>
            <Text className="text-sm font-medium text-gray-500 ml-3">
              Cancel
            </Text>
          </TouchableOpacity>
          {isSaving ? (
            <ActivityIndicator
              size="small"
              color={PRIMARY_ACCENT_COLOR}
              className="ml-2"
            />
          ) : (
            <TouchableOpacity onPress={onSave}>
              <Text className="text-sm font-medium text-blue-500 ml-2">
                Save
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 font-normal mr-1">
              {value}
            </Text>
            {onPress && (
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>

    {isEditing && (
      <View className="mt-2 mb-4">
        <TextInput
          value={inputValue}
          onChangeText={onInputChange}
          className="h-14 pb-2 text-base text-gray-900 border border-gray-200 rounded-lg px-3"
          keyboardType={keyboardType}
          returnKeyType="done"
          autoFocus
        />
      </View>
    )}
  </View>
);

export default function PersonalInformationScreen() {
  const { user, updateUser } = useAuthStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempName, setTempName] = useState(user?.name || "");
  const [tempPhone, setTempPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrimaryPassenger, setIsPrimaryPassenger] = useState(false);

  useEffect(() => {
    const loadPrimaryPassengerSetting = async () => {
      try {
        const saved = await AsyncStorage.getItem(PRIMARY_PASSENGER_KEY);
        if (saved !== null) {
          setIsPrimaryPassenger(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load primary passenger setting:", error);
      }
    };
    loadPrimaryPassengerSetting();
  }, []);

  const savePrimaryPassengerSetting = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(PRIMARY_PASSENGER_KEY, JSON.stringify(value));
      setIsPrimaryPassenger(value);
    } catch (error) {
      console.error("Failed to save primary passenger setting:", error);
      Alert.alert("Error", "Failed to save preference");
    }
  };

  const handleStartEdit = (field: string) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    Keyboard.dismiss();
    setEditingField(null);
    setTempName(user?.name || "");
    setTempPhone(user?.phone || "");
  };

  const handleSave = async (field: string) => {
    if (!user?._id) return;
    const value = field === "name" ? tempName : tempPhone;
    if (!value.trim()) {
      Alert.alert("Error", "This field cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (field === "name") {
        response = await profileService.editName(value.trim(), user._id);
        updateUser({ name: response.name || value.trim() });
      } else if (field === "phone") {
        response = await profileService.editPhone(value.trim(), user._id);
        updateUser({ phone: response.phone || value.trim() });
      }
      Keyboard.dismiss();
      setEditingField(null);
      Alert.alert(
        "Success",
        `${field === "name" ? "Name" : "Phone number"} updated successfully`
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSupport = () => {
    Alert.alert(
      "Contact Support",
      "To change or delete your email address, please contact our support team at support@gobusly.com",
      [{ text: "Got it" }]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-gray-100">
        <Stack.Screen options={{ headerTitle: "Personal Information" }} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Account Information Section */}
          <View className="mt-6 mb-6 mx-4 rounded-xl overflow-hidden bg-white">
            <SettingRow
              icon={<User size={24} color={PINK_ACCENT_COLOR} />}
              label="Full Name"
              value={user?.name || ""}
              onPress={() => handleStartEdit("name")}
              isEditing={editingField === "name"}
              onCancel={handleCancelEdit}
              onSave={() => handleSave("name")}
              inputValue={tempName}
              onInputChange={setTempName}
              isSaving={isLoading}
            />
            <View className="h-[1px] bg-gray-200 ml-14" />
            <SettingRow
              icon={<Phone size={24} color={PINK_ACCENT_COLOR} />}
              label="Phone Number"
              value={user?.phone || ""}
              onPress={() => handleStartEdit("phone")}
              isEditing={editingField === "phone"}
              onCancel={handleCancelEdit}
              onSave={() => handleSave("phone")}
              inputValue={tempPhone}
              onInputChange={setTempPhone}
              keyboardType="phone-pad"
              isSaving={isLoading}
            />
            <View className="h-[1px] bg-gray-200 ml-14" />
            <SettingRow
              icon={<Mail size={24} color={PINK_ACCENT_COLOR} />}
              label="Email Address"
              value={user?.email || ""}
              onPress={handleEmailSupport}
            />
          </View>

          {/* Primary Passenger Setting */}
          <View className="mx-4 mb-6">
            <View className="bg-white p-4 rounded-xl">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-base font-medium text-gray-900">
                    Use as Primary Passenger
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    Auto-fill these details during checkout.
                  </Text>
                </View>
                <Switch
                  value={isPrimaryPassenger}
                  onValueChange={savePrimaryPassengerSetting}
                  trackColor={{ true: PRIMARY_ACCENT_COLOR, false: "#E5E7EB" }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
