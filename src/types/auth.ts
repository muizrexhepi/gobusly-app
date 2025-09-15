export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  notifications: UserNotifications;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  otp?: string;
}

export interface OAuthProvider {
  google: "google";
  apple: "apple";
}

export interface UserNotifications {
  booking_confirmations: boolean;
  departure_reminders: boolean;
  promotions: boolean;
  account_updates: boolean;
  security_alerts: boolean;
}

export interface UserNotificationsDTO {
  booking_confirmations: boolean;
  departure_reminders: boolean;
  promotions: boolean;
  account_updates: boolean;
  security_alerts: boolean;
}
