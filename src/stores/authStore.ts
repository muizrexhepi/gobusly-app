import { apiClient } from "@/src/services/api/client";
import { tokenManager } from "@/src/services/auth/tokenManager";
import type { AuthState, AuthTokens, User } from "@/src/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthActions {
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithEmailOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;

  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
  refreshAccessToken: () => Promise<boolean>;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
  checkAppleAuthAvailability: () => Promise<boolean>;
}

interface AuthStore extends AuthState, AuthActions {
  error: string | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      // inject callbacks to apiClient to avoid require cycle
      apiClient.setAuthCallbacks(
        () => get().refreshAccessToken(),
        () => get().logout()
      );

      return {
        // state
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,

        // auth methods
        loginWithGoogle: async () => {
          set({ isLoading: true, error: null });
          try {
            const { googleAuth } = await import(
              "@/src/services/auth/googleAuth"
            );
            const result = await googleAuth.signIn();

            if (result.success) {
              set({
                tokens: result.tokens,
                user: result.user,
                isAuthenticated: true,
              });
              await tokenManager.saveTokens(result.tokens);
            }
          } catch (error: any) {
            console.error("Google login failed:", error);
            set({ error: error.message || "Google authentication failed" });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        loginWithApple: async () => {
          set({ isLoading: true, error: null });
          try {
            const { appleAuth } = await import("@/src/services/auth/appleAuth");
            const result = await appleAuth.signIn();

            if (result.success) {
              set({
                tokens: result.tokens,
                user: result.user,
                isAuthenticated: true,
              });
              await tokenManager.saveTokens(result.tokens);
            }
          } catch (error: any) {
            console.error("Apple login failed:", error);
            set({ error: error.message || "Apple authentication failed" });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        loginWithEmailOTP: async (email: string) => {
          set({ isLoading: true, error: null });
          try {
            const { otpService } = await import(
              "@/src/services/auth/otpService"
            );
            await otpService.sendOTP(email);
          } catch (error: any) {
            console.error("OTP send failed:", error);
            set({ error: error.message || "Failed to send OTP" });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        verifyOTP: async (email: string, otp: string) => {
          set({ isLoading: true, error: null });
          try {
            const { otpService } = await import(
              "@/src/services/auth/otpService"
            );
            const result = await otpService.verifyOTP(email, otp);

            if (result.success) {
              set({
                tokens: result.tokens,
                user: result.user,
                isAuthenticated: true,
              });
              await tokenManager.saveTokens(result.tokens);
            }
          } catch (error: any) {
            console.error("OTP verification failed:", error);
            set({ error: error.message || "OTP verification failed" });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          set({ isLoading: true, error: null });
          try {
            const tokens = get().tokens;
            if (tokens?.refreshToken) {
              try {
                await apiClient.post("/auth/logout", {
                  refreshToken: tokens.refreshToken,
                });
              } catch (err) {
                console.warn("Backend logout failed:", err);
              }
            }

            await tokenManager.clearTokens();
            set({
              tokens: null,
              user: null,
              isAuthenticated: false,
              error: null,
            });

            if (apiClient.clearCache) {
              await apiClient.clearCache();
            }
          } catch (error: any) {
            console.error("Logout failed:", error);
            set({ error: error.message || "Logout failed" });
          } finally {
            set({ isLoading: false });
          }
        },

        // token management
        setTokens: (tokens: AuthTokens) => {
          set({ tokens, isAuthenticated: true });
        },

        clearTokens: () => {
          set({ tokens: null, isAuthenticated: false });
        },

        refreshAccessToken: async (): Promise<boolean> => {
          const tokens = get().tokens;
          if (!tokens?.refreshToken) return false;

          try {
            const response = await apiClient.post(
              "/auth/generate-refresh-token",
              {
                refreshToken: tokens.refreshToken,
              }
            );
            console.log({ refresh: response.data });
            const newTokens: AuthTokens = response.data.data;
            set({ tokens: newTokens });
            await tokenManager.saveTokens(newTokens);
            return true;
          } catch (error) {
            console.error("Token refresh failed:", error);
            await get().logout();
            return false;
          }
        },

        // user management
        setUser: (user: User) => set({ user, isAuthenticated: true }),

        updateUser: (updates: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) set({ user: { ...currentUser, ...updates } });
        },

        clearUser: () => set({ user: null, isAuthenticated: false }),

        // state management
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        setError: (error: string | null) => set({ error }),

        initialize: async () => {
          set({ isLoading: true, error: null });
          try {
            const savedTokens = await tokenManager.getTokens();
            if (savedTokens) {
              if (savedTokens.expiresAt > Date.now()) {
                set({ tokens: savedTokens, isAuthenticated: true });
                if (!get().user) {
                  try {
                    const userResp = await apiClient.get("/auth/me");
                    set({ user: userResp.data });
                  } catch (userErr) {
                    console.warn("Failed to fetch user:", userErr);
                  }
                }
              }
              // else {
              //   const refreshed = await get().refreshAccessToken();
              //   if (!refreshed) await get().logout();
              // }
            }
          } catch (error: any) {
            console.error("Auth initialization failed:", error);
            set({ error: error.message || "Initialization failed" });
            await get().logout();
          } finally {
            set({ isLoading: false });
          }
        },

        checkAppleAuthAvailability: async (): Promise<boolean> => {
          try {
            const { appleAuth } = await import("@/src/services/auth/appleAuth");
            return await appleAuth.isAvailable();
          } catch {
            return false;
          }
        },
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
