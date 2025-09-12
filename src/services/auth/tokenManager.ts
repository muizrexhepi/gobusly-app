import type { AuthTokens } from "@/src/types/auth";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_tokens";

class TokenManager {
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error("Failed to save tokens:", error);
      throw new Error("Token storage failed");
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokensString = await SecureStore.getItemAsync(TOKEN_KEY);
      return tokensString ? JSON.parse(tokensString) : null;
    } catch (error) {
      console.error("Failed to get tokens:", error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  }

  async getAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();

    if (!tokens) return null;

    if (tokens.expiresAt <= Date.now()) {
      return null;
    }

    return tokens.accessToken;
  }
}

export const tokenManager = new TokenManager();
