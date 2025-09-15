import { apiClient } from "./client";

export interface ProfileUpdateResponse {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  notifications?: UserNotificationsDTO;
  message?: string;
}

export interface UserNotificationsDTO {
  booking_confirmations: boolean;
  departure_reminders: boolean;
  promotions: boolean;
  account_updates: boolean;
  sms: {
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
    return response.data;
  }
}

export const profileService = new ProfileService();
