import { UserNotifications, UserPrivacySettings } from "@/src/types/auth";
import { apiClient } from "./client";

export interface ProfileUpdateResponse {
  _id: string; // Changed from 'id' to '_id' to match your structure
  name?: string;
  phone?: string;
  email?: string;
  notifications?: UserNotifications;
  privacySettings?: UserPrivacySettings; // Added privacy settings
  message?: string;
}

export interface UserNotificationsDTO {
  booking_confirmations: boolean;
  departure_reminders: boolean;
  promotions: boolean;
  account_updates: boolean;
  security_alerts: boolean;
  sms?: {
    booking_confirmations: boolean;
    departure_reminders: boolean;
    promotions: boolean;
    account_updates: boolean;
  };
}

class ProfileService {
  async editName(name: string, userId: string): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(`/auth/name/edit/${userId}`, {
      name,
    });
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to update name");
    }
    return response.data;
  }

  async editPhone(
    phone: string,
    userId: string
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(`/auth/phone/edit/${userId}`, {
      phone,
    });
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to update phone");
    }
    return response.data;
  }

  async getProfile(userId: string): Promise<ProfileUpdateResponse> {
    const response = await apiClient.get(`/profile/${userId}`);
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to fetch profile");
    }
    return response.data;
  }

  async editNotifications(
    userId: string,
    notifications: Partial<UserNotificationsDTO>
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(
      `/auth/notifications/update/${userId}`,
      {
        notifications,
      }
    );
    if (!response.data?._id) {
      throw new Error(
        response.data?.message || "Failed to update notifications"
      );
    }
    console.log({ response });
    return response.data;
  }

  async editPrivacySettings(
    userId: string,
    privacySettings: UserPrivacySettings
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(`/auth/privacy/update/${userId}`, {
      privacySettings,
    });
    if (!response.data?._id) {
      throw new Error(
        response.data?.message || "Failed to update privacy settings"
      );
    }
    return response.data;
  }

  async updateProfile(
    userId: string,
    profileData: {
      name?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    }
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.put(`/profile/${userId}`, profileData);
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to update profile");
    }
    return response.data;
  }

  async uploadAvatar(
    userId: string,
    avatarFile: FormData
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(
      `/profile/${userId}/avatar`,
      avatarFile,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to upload avatar");
    }
    return response.data;
  }

  async deleteAccount(
    userId: string,
    reason: string,
    feedback?: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(`/profile/${userId}`, {
      data: { reason, feedback },
    });
    return response.data;
  }

  // Export user data for GDPR compliance
  async exportUserData(userId: string): Promise<Blob> {
    const response = await apiClient.get(`/profile/${userId}/export`, {
      responseType: "blob",
    });
    return response.data;
  }
}

export const profileService = new ProfileService();
