import { apiClient } from "@/src/services/api/client";
import type { AuthTokens, User } from "@/src/types/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

interface AppleAuthResult {
  success: boolean;
  tokens: AuthTokens;
  user: User;
}

class AppleAuthService {
  private static instance: AppleAuthService;

  public static getInstance(): AppleAuthService {
    if (!AppleAuthService.instance) {
      AppleAuthService.instance = new AppleAuthService();
    }
    return AppleAuthService.instance;
  }

  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== "ios") return false;

    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }

  async signIn(): Promise<AppleAuthResult> {
    if (!(await this.isAvailable())) {
      throw new Error("Apple Sign-In is not available on this device");
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const backendResponse = await apiClient.post("/auth/apple-login", {
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
        user: credential.user,
        email: credential.email,
        fullName: credential.fullName
          ? {
              givenName: credential.fullName.givenName,
              familyName: credential.fullName.familyName,
            }
          : null,
      });

      const { user, tokens } = backendResponse.data.data;

      return {
        success: true,
        tokens,
        user,
      };
    } catch (error: any) {
      console.error("Apple authentication failed:", error);

      if (error.code === "ERR_REQUEST_CANCELED") {
        throw new Error("Authentication cancelled");
      } else if (error.code === "ERR_INVALID_RESPONSE") {
        throw new Error("Invalid Apple Sign-In response");
      } else {
        throw new Error(error.message || "Apple authentication failed");
      }
    }
  }

  async getCredentialState(
    userID: string
  ): Promise<AppleAuthentication.AppleAuthenticationCredentialState> {
    if (!(await this.isAvailable())) {
      return AppleAuthentication.AppleAuthenticationCredentialState.NOT_FOUND;
    }

    try {
      return await AppleAuthentication.getCredentialStateAsync(userID);
    } catch {
      return AppleAuthentication.AppleAuthenticationCredentialState.NOT_FOUND;
    }
  }
}

export const appleAuth = AppleAuthService.getInstance();
