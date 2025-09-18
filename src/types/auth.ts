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
  privacySettings?: UserPrivacySettings;
  expoPushToken?: string;
  language?: string;
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
  sms?: {
    booking_confirmations: boolean;
    departure_reminders: boolean;
    promotions: boolean;
    account_updates: boolean;
  };
}

export interface UserPrivacySettings {
  share_contact_with_operators: boolean;
  location_based_recommendations: boolean;
  travel_history_analytics: boolean; // Use your booking history for personalized recommendations
  marketing_communications: boolean; // Receive promotional offers from GoBusly and partner operators
  data_analytics: boolean; // Help improve our service with anonymous usage data
  emergency_contact_sharing: boolean; // Share emergency contact with operators for safety
}

export interface ProfileUpdateResponse {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  notifications?: UserNotificationsDTO;
  privacySettings?: UserPrivacySettings;
  message?: string;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}
