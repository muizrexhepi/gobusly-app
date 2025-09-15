import { apiClient } from "./client";

export interface ProfileUpdateResponse {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

class ProfileService {
  // Edit name
  async editName(name: string, userId: string): Promise<ProfileUpdateResponse> {
    console.log("API call: editName", { name, userId });
    const response = await apiClient.post(`/auth/name/edit/${userId}`, {
      name,
    });
    console.log("API response editName:", response.data);
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to update name");
    }
    return response.data;
  }

  // Edit phone
  async editPhone(
    phone: string,
    userId: string
  ): Promise<ProfileUpdateResponse> {
    console.log("API call: editPhone", { phone, userId });
    const response = await apiClient.post(`/auth/phone/edit/${userId}`, {
      phone,
    });
    console.log("API response editPhone:", response.data);
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to update phone");
    }
    return response.data;
  }

  // Get profile
  async getProfile(userId: string): Promise<ProfileUpdateResponse> {
    console.log("API call: getProfile", { userId });
    const response = await apiClient.get(`/profile/${userId}`);
    console.log("API response getProfile:", response.data);
    if (!response.data?._id) {
      throw new Error(response.data?.message || "Failed to fetch profile");
    }
    return response.data;
  }
}

export const profileService = new ProfileService();
