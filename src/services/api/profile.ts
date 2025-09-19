import { UserNotifications, UserPrivacySettings } from "@/src/types/auth";
import { apiClient } from "./client";

export interface ProfileUpdateResponse {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  notifications?: UserNotifications;
  privacySettings?: UserPrivacySettings;
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
    notificationKey: keyof UserNotifications,
    value: boolean
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(
      `/auth/notifications/update/${userId}`,
      {
        notification_key: notificationKey,
        [notificationKey]: value,
      }
    );

    console.log("editNotifications response:", response.data);

    if (
      response.data?.message?.includes("successfully") ||
      response.status === 200
    ) {
      return {
        _id: userId,
        message: response.data?.message || "Notification updated successfully",
        notifications: response.data?.notifications || undefined,
        ...response.data,
      };
    }

    if (
      !response.data?._id &&
      !response.data?.message?.includes("successfully")
    ) {
      throw new Error(
        response.data?.message || "Failed to update notifications"
      );
    }

    return response.data;
  }

  async updateLanguage(
    userId: string,
    language: string
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(`/auth/language/update/${userId}`, {
      language,
    });

    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to update language");
    }

    return response.data;
  }

  async editPrivacySettings(
    userId: string,
    privacySettings: UserPrivacySettings
  ): Promise<ProfileUpdateResponse> {
    const response = await apiClient.post(`/privacy/update?user_id=${userId}`, {
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

  async exportUserData(userId: string): Promise<Blob> {
    const response = await apiClient.get(
      `/auth/export-profile-data/${userId}`,
      {
        responseType: "blob",
        timeout: 60000,
      }
    );
    return response.data;
  }
}

export const profileService = new ProfileService();
