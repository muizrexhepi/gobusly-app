import { useAuthStore } from "@/src/stores/authStore";
import { useCallback, useEffect } from "react";

export const useAuth = () => {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    loginWithGoogle,
    loginWithApple,
    loginWithEmailOTP,
    verifyOTP,
    logout,
    initialize,
    setError,
    checkAppleAuthAvailability,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      await loginWithGoogle();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [loginWithGoogle]);

  const handleAppleLogin = useCallback(async () => {
    try {
      await loginWithApple();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [loginWithApple]);

  const handleEmailLogin = useCallback(
    async (email: string) => {
      try {
        await loginWithEmailOTP(email);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [loginWithEmailOTP]
  );

  const handleOTPVerification = useCallback(
    async (email: string, otp: string) => {
      try {
        await verifyOTP(email, otp);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [verifyOTP]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [logout]);

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    error,

    // Actions
    loginWithGoogle: handleGoogleLogin,
    loginWithApple: handleAppleLogin,
    loginWithEmail: handleEmailLogin,
    verifyOTP: handleOTPVerification,
    logout: handleLogout,

    // Utilities
    clearError: () => setError(null),
    checkAppleAuthAvailability,
    initialize,
  };
};
