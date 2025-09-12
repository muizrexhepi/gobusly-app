import { apiClient } from "@/src/services/api/client";
import type { AuthTokens, User } from "@/src/types/auth";
import { AuthRequest, AuthRequestConfig } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

interface GoogleAuthResult {
  success: boolean;
  tokens: AuthTokens;
  user: User;
}

class GoogleAuthService {
  private static instance: GoogleAuthService;

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  private getClientId(): string {
    if (Platform.OS === "ios") {
      return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";
    } else if (Platform.OS === "android") {
      return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "";
    }
    return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";
  }

  async signIn(): Promise<GoogleAuthResult> {
    try {
      const clientId = this.getClientId();

      if (!clientId) {
        throw new Error("Google OAuth client ID not configured");
      }

      // Configure the auth request
      const config: AuthRequestConfig = {
        clientId,
        scopes: ["openid", "profile", "email"],
        responseType: "id_token",
        redirectUri: "gobuslyapp://auth",
        extraParams: {},
      };

      const authRequest = new AuthRequest(config);

      // Get the authorization URL
      const authUrl = await authRequest.makeAuthUrlAsync({
        authorizationEndpoint: "https://accounts.google.com/oauth/authorize",
      });

      // Open the authentication session
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        authRequest.redirectUri
      );

      if (result.type === "success") {
        // Parse the URL to extract the ID token
        const url = new URL(result.url);
        const fragment = url.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const idToken = params.get("id_token");

        if (!idToken) {
          throw new Error("No ID token received from Google");
        }

        // Send the ID token to your backend
        const backendResponse = await apiClient.post("/auth/google", {
          token: idToken,
        });

        const { user, tokens } = backendResponse.data;

        return {
          success: true,
          tokens,
          user,
        };
      } else if (result.type === "cancel") {
        throw new Error("Authentication cancelled by user");
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error: any) {
      console.error("Google authentication failed:", error);
      throw error;
    }
  }
}

export const googleAuth = GoogleAuthService.getInstance();
