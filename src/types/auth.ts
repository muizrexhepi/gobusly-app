// User Authentication Types - Updated to match your current structure
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
  privacySettings?: UserPrivacySettings; // Added this field
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

// Notification Preferences
export interface UserNotifications {
  booking_confirmations: boolean;
  departure_reminders: boolean;
  promotions: boolean;
  account_updates: boolean;
  security_alerts: boolean;
}

// DTO for API responses - matches your backend structure
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

// Privacy Settings - Updated for bus booking platform
export interface UserPrivacySettings {
  share_contact_with_operators: boolean; // Allow operators to contact you directly for trip updates
  location_based_recommendations: boolean; // Use your location for better route suggestions
  travel_history_analytics: boolean; // Use your booking history for personalized recommendations
  marketing_communications: boolean; // Receive promotional offers from GoBusly and partner operators
  data_analytics: boolean; // Help improve our service with anonymous usage data
  emergency_contact_sharing: boolean; // Share emergency contact with operators for safety
}

// Profile Service Types
export interface ProfileUpdateResponse {
  _id: string; // Changed from 'id' to '_id' to match your structure
  name?: string;
  phone?: string;
  email?: string;
  notifications?: UserNotificationsDTO;
  privacySettings?: UserPrivacySettings; // Added this field
  message?: string;
}

// Auth Actions - Updated to match your structure
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
}

// API Error Response
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

// Profile Update Data
export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Emergency Contact
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}
