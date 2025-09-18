"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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

const MenuItem = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  isEditing = false,
  disabled = false,
  isLastItem = false,
  isLoading = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  isEditing?: boolean;
  disabled?: boolean;
  isLastItem?: boolean;
  isLoading?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || isEditing || !onPress}
    className={`flex-row items-center p-4 ${
      disabled ? "opacity-60" : ""
    } ${!isLastItem ? "border-b border-gray-100" : ""}`}
    activeOpacity={0.7}
  >
    <View className="w-8 h-8 rounded-lg flex items-center justify-center mr-4 bg-gray-100">
      <Ionicons name={icon} size={18} color="#4B5563" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-medium text-gray-900">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
      )}
      {value && !isEditing && (
        <Text className="text-sm text-gray-700 mt-1">{value}</Text>
      )}
    </View>
    <View className="flex-row items-center">
      {isLoading && (
        <ActivityIndicator size="small" color="#15203e" className="mr-2" />
      )}
      {onPress && !isEditing && !isLoading && (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </View>
  </TouchableOpacity>
);

const EditableMenuItem = ({
  icon,
  title,
  value,
  onStartEdit,
  isEditing,
  onCancel,
  onSave,
  inputValue,
  onInputChange,
  keyboardType = "default",
  isSaving = false,
  isLastItem = false,
  isPhoneField = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  value: string;
  onStartEdit: () => void;
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
  inputValue: string;
  onInputChange: (text: string) => void;
  keyboardType?: any;
  isSaving?: boolean;
  isLastItem?: boolean;
  isPhoneField?: boolean;
}) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isEditing) {
      // Focus input after a short delay to ensure it's rendered
      setTimeout(() => {
        inputRef.current?.focus();
        // For phone field, set cursor after the "+"
        if (isPhoneField && inputRef.current) {
          inputRef.current.setSelection(inputValue.length, inputValue.length);
        }
      }, 100);
    }
  }, [isEditing, isPhoneField, inputValue.length]);

  const handlePhoneChange = (text: string) => {
    if (isPhoneField) {
      // Always ensure phone starts with "+"
      if (!text.startsWith("+")) {
        text = "+" + text.replace(/^\+*/, "");
      }
      // Prevent deletion of the "+"
      if (text === "") {
        text = "+";
      }
    }
    onInputChange(text);
  };

  if (isEditing) {
    return (
      <View className={`p-4 ${!isLastItem ? "border-b border-gray-100" : ""}`}>
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 rounded-lg flex items-center justify-center mr-4 bg-gray-100">
            <Ionicons name={icon} size={18} color="#4B5563" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">{title}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={onCancel} disabled={isSaving}>
              <Text className="text-sm font-medium text-gray-500 mr-3">
                Cancel
              </Text>
            </TouchableOpacity>
            {isSaving ? (
              <ActivityIndicator size="small" color="#15203e" />
            ) : (
              <TouchableOpacity onPress={onSave}>
                <Text className="text-sm font-medium text-blue-500">Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {isPhoneField ? (
          <View className="flex-row items-center h-12 border border-gray-200 rounded-lg">
            <Text className="text-base text-gray-900 pl-3 pr-1">+</Text>
            <TextInput
              ref={inputRef}
              value={inputValue.substring(1)} // Remove the "+" from display
              onChangeText={(text) => handlePhoneChange("+" + text)}
              className="flex-1 h-full text-base text-gray-900 pr-3"
              keyboardType={keyboardType}
              returnKeyType="done"
              onSubmitEditing={onSave}
              editable={!isSaving}
              placeholder="1234567890"
            />
          </View>
        ) : (
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={onInputChange}
            className="h-12 text-base text-gray-900 border border-gray-200 rounded-lg px-3"
            keyboardType={keyboardType}
            returnKeyType="done"
            onSubmitEditing={onSave}
            editable={!isSaving}
          />
        )}
      </View>
    );
  }

  return (
    <MenuItem
      icon={icon}
      title={title}
      value={value}
      onPress={onStartEdit}
      isLastItem={isLastItem}
    />
  );
};

const Section = ({ children }: { children: React.ReactNode }) => (
  <View className="mb-6 rounded-2xl overflow-hidden bg-white mx-4">
    {children}
  </View>
);

export default function PersonalInformationScreen() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempName, setTempName] = useState(user?.name || "");
  const [tempPhone, setTempPhone] = useState(user?.phone || "");
  const [originalName, setOriginalName] = useState(user?.name || "");
  const [originalPhone, setOriginalPhone] = useState(user?.phone || "");
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

  // Update temp values when user data changes
  useEffect(() => {
    setTempName(user?.name || "");
    // Ensure phone always starts with "+" when editing
    const phoneValue = user?.phone || "";
    setTempPhone(
      phoneValue.startsWith("+")
        ? phoneValue
        : phoneValue
          ? `+${phoneValue}`
          : "+"
    );
    setOriginalName(user?.name || "");
    setOriginalPhone(user?.phone || "");
  }, [user]);

  const savePrimaryPassengerSetting = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(PRIMARY_PASSENGER_KEY, JSON.stringify(value));
      setIsPrimaryPassenger(value);
    } catch (error) {
      console.error("Failed to save primary passenger setting:", error);
      Alert.alert(
        t("common.error", "Error"),
        t("personalInfo.savePreferenceError", "Failed to save preference")
      );
    }
  };

  const hasUnsavedChanges = () => {
    if (editingField === "name") {
      return tempName.trim() !== originalName;
    }
    if (editingField === "phone") {
      // For phone, compare without the "+" to handle cases where original might not have "+"
      const currentPhone = tempPhone.replace(/^\+/, "");
      const originalPhoneClean = originalPhone.replace(/^\+/, "");
      return currentPhone !== originalPhoneClean;
    }
    return false;
  };

  const handleStartEdit = (field: string) => {
    // Initialize phone with "+" if starting to edit phone
    if (field === "phone") {
      const phoneValue = user?.phone || "";
      setTempPhone(
        phoneValue.startsWith("+")
          ? phoneValue
          : phoneValue
            ? `+${phoneValue}`
            : "+"
      );
    }

    if (editingField && hasUnsavedChanges()) {
      Alert.alert(
        t("personalInfo.unsavedChangesTitle", "Unsaved Changes"),
        t(
          "personalInfo.unsavedChangesMessage",
          "You have unsaved changes. What would you like to do?"
        ),
        [
          {
            text: t("personalInfo.discardChanges", "Discard"),
            style: "destructive",
            onPress: () => {
              handleCancelEdit();
              setEditingField(field);
            },
          },
          {
            text: t("personalInfo.saveChanges", "Save"),
            onPress: async () => {
              await handleSave(editingField);
              setEditingField(field);
            },
          },
          {
            text: t("common.cancel", "Cancel"),
            style: "cancel",
          },
        ]
      );
    } else {
      setEditingField(field);
    }
  };

  const handleCancelEdit = () => {
    Keyboard.dismiss();
    setEditingField(null);
    setTempName(originalName);
    // Reset phone to original value
    const phoneValue = originalPhone || "";
    setTempPhone(
      phoneValue.startsWith("+")
        ? phoneValue
        : phoneValue
          ? `+${phoneValue}`
          : "+"
    );
  };

  const handleBackgroundTap = () => {
    if (editingField && hasUnsavedChanges()) {
      Alert.alert(
        t("personalInfo.unsavedChangesTitle", "Unsaved Changes"),
        t(
          "personalInfo.unsavedChangesMessage",
          "You have unsaved changes. What would you like to do?"
        ),
        [
          {
            text: t("personalInfo.discardChanges", "Discard"),
            style: "destructive",
            onPress: handleCancelEdit,
          },
          {
            text: t("personalInfo.saveChanges", "Save"),
            onPress: () => handleSave(editingField),
          },
          {
            text: t("common.cancel", "Cancel"),
            style: "cancel",
          },
        ]
      );
    } else {
      Keyboard.dismiss();
      setEditingField(null);
    }
  };

  const handleSave = async (field: string | null) => {
    if (!field || !user?._id) return;

    const value = field === "name" ? tempName : tempPhone;
    if (field === "phone") {
      // For phone, check if it's just "+" or empty after removing "+"
      const phoneDigits = tempPhone.replace(/^\+/, "").trim();
      if (!phoneDigits) {
        Alert.alert(
          t("common.error", "Error"),
          t(
            "personalInfo.phoneRequiredError",
            "Please enter a valid phone number"
          )
        );
        return;
      }
    } else if (!value.trim()) {
      Alert.alert(
        t("common.error", "Error"),
        t("personalInfo.fieldRequiredError", "This field cannot be empty")
      );
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (field === "name") {
        response = await profileService.editName(value.trim(), user._id);
        updateUser({ name: response.name || value.trim() });
        setOriginalName(response.name || value.trim());
      } else if (field === "phone") {
        // Send the phone with "+" to the API
        response = await profileService.editPhone(tempPhone.trim(), user._id);
        updateUser({ phone: response.phone || tempPhone.trim() });
        setOriginalPhone(response.phone || tempPhone.trim());
      }

      Keyboard.dismiss();
      setEditingField(null);

      Alert.alert(
        t("common.success", "Success"),
        t(
          "personalInfo.updateSuccess",
          `${field === "name" ? "Name" : "Phone number"} updated successfully`
        )
      );
    } catch (error: any) {
      Alert.alert(
        t("common.error", "Error"),
        error.message ||
          t("personalInfo.updateError", "Failed to update information")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSupport = () => {
    Alert.alert(
      t("personalInfo.contactSupportTitle", "Contact Support"),
      t(
        "personalInfo.contactSupportMessage",
        "To change or delete your email address, please contact our support team at support@gobusly.com"
      ),
      [{ text: t("personalInfo.gotIt", "Got it") }]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundTap}>
      <View className="flex-1 bg-gray-100">
        <Stack.Screen
          options={{
            headerTitle: t("personalInfo.title", "Personal Information"),
          }}
        />
        <ScrollView
          className="py-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Account Information Section */}
          <Section>
            <EditableMenuItem
              icon="person-outline"
              title={t("personalInfo.fullName", "Full Name")}
              value={user?.name || t("personalInfo.notSet", "Not set")}
              onStartEdit={() => handleStartEdit("name")}
              isEditing={editingField === "name"}
              onCancel={handleCancelEdit}
              onSave={() => handleSave("name")}
              inputValue={tempName}
              onInputChange={setTempName}
              isSaving={isLoading && editingField === "name"}
            />

            <EditableMenuItem
              icon="call-outline"
              title={t("personalInfo.phoneNumber", "Phone Number")}
              value={user?.phone || t("personalInfo.notSet", "Not set")}
              onStartEdit={() => handleStartEdit("phone")}
              isEditing={editingField === "phone"}
              onCancel={handleCancelEdit}
              onSave={() => handleSave("phone")}
              inputValue={tempPhone}
              onInputChange={setTempPhone}
              keyboardType="phone-pad"
              isSaving={isLoading && editingField === "phone"}
              isPhoneField={true}
            />

            <MenuItem
              icon="mail-outline"
              title={t("personalInfo.emailAddress", "Email Address")}
              value={user?.email || t("personalInfo.notSet", "Not set")}
              onPress={handleEmailSupport}
              isLastItem
            />
          </Section>

          {/* Primary Passenger Setting */}
          <Section>
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <View className="flex-row items-center mb-1">
                    <View className="w-8 h-8 rounded-lg flex items-center justify-center mr-4 bg-gray-100">
                      <Ionicons
                        name="person-circle-outline"
                        size={18}
                        color="#4B5563"
                      />
                    </View>
                    <Text className="text-base font-medium text-gray-900">
                      {t(
                        "personalInfo.primaryPassengerTitle",
                        "Use as Primary Passenger"
                      )}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500 ml-12">
                    {t(
                      "personalInfo.primaryPassengerDescription",
                      "Auto-fill these details during checkout."
                    )}
                  </Text>
                </View>
                <Switch
                  value={isPrimaryPassenger}
                  onValueChange={savePrimaryPassengerSetting}
                  trackColor={{ true: "#15203e", false: "#E5E7EB" }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </Section>

          {/* Add some bottom padding for better scrolling */}
          <View className="h-6" />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
