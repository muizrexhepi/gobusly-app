"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
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

export default function PersonalInformationScreen() {
  const { user, updateUser } = useAuthStore();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrimaryPassenger, setIsPrimaryPassenger] = useState(false);

  // Load primary passenger setting
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

  // Save primary passenger setting
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
    if (field === "name") {
      setTempName(user?.name || "");
    } else if (field === "phone") {
      setTempPhone(user?.phone || "");
    }
  };

  const handleCancelEdit = () => {
    Keyboard.dismiss();
    setEditingField(null);
    setTempName("");
    setTempPhone("");
  };

  const handleSave = async () => {
    if (!user?._id || !editingField) return;

    const value = editingField === "name" ? tempName : tempPhone;

    if (!value.trim()) {
      Alert.alert("Error", "This field cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (editingField === "name") {
        response = await profileService.editName(value.trim(), user._id);
        updateUser({ name: response.name || value.trim() });
      } else if (editingField === "phone") {
        response = await profileService.editPhone(value.trim(), user._id);
        updateUser({ phone: response.phone || value.trim() });
      }

      Keyboard.dismiss();
      setEditingField(null);
      setTempName("");
      setTempPhone("");
      Alert.alert(
        "Success",
        `${editingField === "name" ? "Name" : "Phone number"} updated successfully`
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

  const InfoField = ({
    icon: IconComponent,
    label,
    value,
    field,
    editable = true,
    iconColor = "#6B7280",
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    field: string;
    editable?: boolean;
    iconColor?: string;
  }) => {
    const isEditing = editingField === field;

    return (
      <View className="bg-white p-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
              <IconComponent size={16} color={iconColor} />
            </View>
            <Text className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {label}
            </Text>
          </View>

          {editable && !isEditing && (
            <TouchableOpacity
              onPress={() => handleStartEdit(field)}
              className="px-3 py-1 bg-pink-50 rounded-md"
            >
              <Text className="text-pink-600 font-medium text-sm">Edit</Text>
            </TouchableOpacity>
          )}

          {!editable && (
            <TouchableOpacity
              onPress={handleEmailSupport}
              className="px-3 py-1 bg-gray-50 rounded-md"
            >
              <Text className="text-gray-500 font-medium text-sm">Help</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View>
            <TextInput
              key={`${field}-input`}
              value={field === "name" ? tempName : tempPhone}
              onChangeText={field === "name" ? setTempName : setTempPhone}
              placeholder={`Enter your ${label.toLowerCase()}`}
              className="text-base text-gray-900 border border-gray-200 rounded-lg px-3 py-2 mb-3"
              keyboardType={field === "phone" ? "phone-pad" : "default"}
              returnKeyType="done"
              onSubmitEditing={handleSave}
              autoFocus={true}
            />

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={handleCancelEdit}
                className="px-3 py-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              >
                <Text className="text-gray-600 font-medium text-sm">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                className="px-3 py-2 bg-pink-600 rounded-md flex-row items-center min-w-[60px] justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-medium text-sm">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text className="text-base text-gray-900 ml-11">
            {value || `No ${label.toLowerCase()} provided`}
          </Text>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-gray-50">
        <Stack.Screen options={{ headerTitle: "Personal Information" }} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Account Information */}
          <View className="mt-6 mb-6">
            <InfoField
              icon={User}
              label="Full Name"
              value={user?.name || ""}
              field="name"
              iconColor="#3B82F6"
            />

            <InfoField
              icon={Phone}
              label="Phone Number"
              value={user?.phone || ""}
              field="phone"
              iconColor="#10B981"
            />

            <InfoField
              icon={Mail}
              label="Email Address"
              value={user?.email || ""}
              field="email"
              editable={false}
              iconColor="#F59E0B"
            />
          </View>

          {/* Primary Passenger Setting */}
          <View className="mx-4 mb-6">
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-base font-medium text-gray-900 mb-1">
                    Use as Primary Passenger
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Auto-fill these details during checkout for faster booking
                  </Text>
                </View>
                <Switch
                  value={isPrimaryPassenger}
                  onValueChange={savePrimaryPassengerSetting}
                  trackColor={{ true: "#db2777", false: "#e5e7eb" }}
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
