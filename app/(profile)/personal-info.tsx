"use client";

import { profileService } from "@/src/services/api/profile";
import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PersonalInformationScreen() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (field: string) => {
    console.log("Editing field:", field);
    setIsEditing(field);
    setEditValues({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  };

  const handleCancel = () => {
    console.log("Cancel edit");
    setIsEditing(null);
    setEditValues({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  };

  const handleSave = async (field: string) => {
    if (!user?._id) {
      console.warn("No user ID found, cannot save");
      return;
    }

    console.log(
      "Saving field:",
      field,
      "value:",
      editValues[field as keyof typeof editValues]
    );

    setIsLoading(true);
    try {
      let response;
      if (field === "name") {
        response = await profileService.editName(editValues.name, user._id);
        console.log("Name update response:", response);
        updateUser({ name: response.name });
      } else if (field === "phone") {
        response = await profileService.editPhone(editValues.phone, user._id);
        console.log("Phone update response:", response);
        updateUser({ phone: response.phone });
      } else {
        console.warn("Unsupported field for save:", field);
        return;
      }

      Alert.alert("Success", "Information updated successfully");
      setIsEditing(null);
    } catch (error: any) {
      console.error("Save error:", error);
      Alert.alert("Error", error.message || "Failed to update information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSupport = () => {
    Alert.alert(
      "Contact Support",
      "To delete or change your email address, please contact our support team at support@gobusly.com",
      [{ text: "OK" }]
    );
  };

  const InfoField = ({
    label,
    value,
    field,
    editable = true,
    placeholder,
  }: {
    label: string;
    value: string;
    field: string;
    editable?: boolean;
    placeholder?: string;
  }) => {
    const isCurrentlyEditing = isEditing === field;

    return (
      <View className="bg-white px-6 py-4 border-b border-gray-50">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {label}
          </Text>
          {editable && !isCurrentlyEditing && (
            <TouchableOpacity
              onPress={() => handleEdit(field)}
              className="flex-row items-center"
            >
              <Ionicons name="pencil" size={16} color="#EC4899" />
              <Text className="text-pink-600 font-medium ml-1">Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {isCurrentlyEditing ? (
          <View>
            <TextInput
              value={editValues[field as keyof typeof editValues]}
              onChangeText={(text) =>
                setEditValues((prev) => ({ ...prev, [field]: text }))
              }
              placeholder={placeholder}
              className="text-base text-gray-900 border border-gray-200 rounded-lg px-3 pb-3 h-14 mb-3"
              autoFocus
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-200"
                disabled={isLoading}
              >
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSave(field)}
                className="px-4 py-2 bg-pink-600 rounded-lg"
                disabled={isLoading}
              >
                <Text className="text-white font-medium">
                  {isLoading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-gray-900 flex-1">
              {value || placeholder}
            </Text>
            {!editable && (
              <TouchableOpacity
                onPress={handleEmailSupport}
                className="flex-row items-center"
              >
                <Ionicons name="help-circle" size={16} color="#6B7280" />
                <Text className="text-gray-500 text-sm ml-1">
                  Contact Support
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white px-6 py-8 mb-6">
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-pink-600 rounded-full items-center justify-center mr-4">
              <Text className="text-white font-bold text-2xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                Personal Information
              </Text>
              <Text className="text-gray-600 text-base mt-1">
                Manage your account details
              </Text>
            </View>
          </View>
        </View>

        {/* Information Fields */}
        <View className="mb-6">
          <View className="px-6 py-3 bg-gray-50">
            <Text className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Account Details
            </Text>
          </View>

          <InfoField
            label="Full Name"
            value={user?.name || ""}
            field="name"
            placeholder="Enter your full name"
          />

          <InfoField
            label="Phone Number"
            value={user?.phone || ""}
            field="phone"
            placeholder="Enter your phone number"
          />

          <InfoField
            label="Email Address"
            value={user?.email || ""}
            field="email"
            editable={false}
            placeholder="No email provided"
          />
        </View>

        {/* Information Notice */}
        <View className="mx-6 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <View className="ml-3 flex-1">
              <Text className="text-blue-900 font-medium mb-1">
                Account Information
              </Text>
              <Text className="text-blue-800 text-sm leading-5">
                You can edit your name and phone number directly. To change or
                delete your email address, please contact our support team.
              </Text>
            </View>
          </View>
        </View>

        {/* Support Contact */}
        <View className="mx-6 mb-6">
          <TouchableOpacity
            onPress={handleEmailSupport}
            className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center"
          >
            <View className="w-10 h-10 bg-pink-50 rounded-full items-center justify-center mr-3">
              <Ionicons name="mail" size={20} color="#EC4899" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                Contact Support
              </Text>
              <Text className="text-gray-600 text-sm">
                Need help with your account? Get in touch with us
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
