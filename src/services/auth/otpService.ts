import { apiClient } from "@/src/services/api/client";

interface OTPResult {
  success: boolean;
  user?: any;
  tokens?: any;
  error?: string;
}

class OTPService {
  async sendOTP(
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post("/auth/otp-login", { email });
      return {
        success: true,
        message: response.data.message || "OTP sent successfully",
      };
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      throw new Error(error.response?.data?.message || "Failed to send OTP");
    }
  }

  async verifyOTP(email: string, otp: string): Promise<OTPResult> {
    try {
      const response = await apiClient.post("/auth/verify-otp", { email, otp });
      console.log({ OTPLogin: response.data.data });

      const { user, tokens, expires_at } = response.data.data;

      return {
        success: true,
        user,
        tokens: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(expires_at).getTime(),
        },
      };
    } catch (error: any) {
      console.error("Verify OTP Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "OTP verification failed",
      };
    }
  }

  async resendOTP(
    email: string
  ): Promise<{ success: boolean; message?: string }> {
    return this.sendOTP(email);
  }
}

export const otpService = new OTPService();
