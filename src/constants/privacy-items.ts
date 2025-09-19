// import { UserPrivacySettings } from "@/src/types/auth";
// import { Ionicons } from "@expo/vector-icons";

// export interface PrivacyItem {
//   key: keyof any;
//   labelKey: string;
//   descriptionKey: string;
//   icon: React.ComponentProps<typeof Ionicons>["name"];
//   isEssential?: boolean;
//   isRecommended?: boolean;
// }

// export interface PrivacySection {
//   titleKey: string;
//   descriptionKey: string;
//   items: PrivacyItem[];
//   isEssential?: boolean;
// }

// export const essentialPrivacyItems: PrivacyItem[] = [
//   {
//     key: "service_communications",
//     labelKey: "serviceCommunicationsLabel",
//     descriptionKey: "serviceCommunicationsDescription",
//     icon: "chatbubble-outline",
//     isEssential: true,
//   },
//   {
//     key: "booking_confirmations",
//     labelKey: "bookingConfirmationsLabel",
//     descriptionKey: "bookingConfirmationsDescription",
//     icon: "receipt-outline",
//     isEssential: true,
//   },
//   {
//     key: "trip_notifications",
//     labelKey: "tripNotificationsLabel",
//     descriptionKey: "tripNotificationsDescription",
//     icon: "bus-outline",
//     isEssential: true,
//   },
//   {
//     key: "security_alerts",
//     labelKey: "securityAlertsLabel",
//     descriptionKey: "securityAlertsDescription",
//     icon: "shield-checkmark-outline",
//     isEssential: true,
//   },
// ];

// // Functional settings - improve user experience, personalization, and performance
// export const functionalPrivacyItems: PrivacyItem[] = [
//   {
//     key: "location_services",
//     labelKey: "locationServicesLabel",
//     descriptionKey: "locationServicesDescription",
//     icon: "location-outline",
//     isRecommended: true,
//   },
//   {
//     key: "personalized_recommendations",
//     labelKey: "personalizedRecommendationsLabel",
//     descriptionKey: "personalizedRecommendationsDescription",
//     icon: "bulb-outline",
//     isRecommended: true,
//   },
//   {
//     key: "travel_history_analytics",
//     labelKey: "travelHistoryAnalyticsLabel",
//     descriptionKey: "travelHistoryAnalyticsDescription",
//     icon: "analytics-outline",
//     isRecommended: true,
//   },
//   {
//     key: "push_notifications",
//     labelKey: "pushNotificationsLabel",
//     descriptionKey: "pushNotificationsDescription",
//     icon: "notifications-outline",
//     isRecommended: true,
//   },
//   {
//     key: "offline_maps_caching",
//     labelKey: "offlineMapsCachingLabel",
//     descriptionKey: "offlineMapsCachingDescription",
//     icon: "map-outline",
//     isRecommended: false,
//   },
//   {
//     key: "crash_reporting",
//     labelKey: "crashReportingLabel",
//     descriptionKey: "crashReportingDescription",
//     icon: "bug-outline",
//     isRecommended: true,
//   },
// ];

// // Marketing & Communication settings
// export const marketingPrivacyItems: PrivacyItem[] = [
//   {
//     key: "promotional_emails",
//     labelKey: "promotionalEmailsLabel",
//     descriptionKey: "promotionalEmailsDescription",
//     icon: "mail-outline",
//     isRecommended: false,
//   },
//   {
//     key: "promotional_push_notifications",
//     labelKey: "promotionalPushLabel",
//     descriptionKey: "promotionalPushDescription",
//     icon: "megaphone-outline",
//     isRecommended: false,
//   },
//   {
//     key: "market_research",
//     labelKey: "marketResearchLabel",
//     descriptionKey: "marketResearchDescription",
//     icon: "bar-chart-outline",
//     isRecommended: false,
//   },
// ];

// // Data Sharing & Third Party settings
// export const dataPrivacyItems: PrivacyItem[] = [
//   {
//     key: "share_with_partners",
//     labelKey: "shareWithPartnersLabel",
//     descriptionKey: "shareWithPartnersDescription",
//     icon: "people-outline",
//     isRecommended: false,
//   },
//   {
//     key: "social_media_integration",
//     labelKey: "socialMediaIntegrationLabel",
//     descriptionKey: "socialMediaIntegrationDescription",
//     icon: "share-social-outline",
//     isRecommended: false,
//   },
//   {
//     key: "third_party_analytics",
//     labelKey: "thirdPartyAnalyticsLabel",
//     descriptionKey: "thirdPartyAnalyticsDescription",
//     icon: "stats-chart-outline",
//     isRecommended: false,
//   },
// ];

// export const privacySections: PrivacySection[] = [
//   {
//     titleKey: "essentialServicesTitle",
//     descriptionKey: "essentialServicesDescription",
//     items: essentialPrivacyItems,
//     isEssential: true,
//   },
//   {
//     titleKey: "functionalServicesTitle",
//     descriptionKey: "functionalServicesDescription",
//     items: functionalPrivacyItems,
//     isEssential: false,
//   },
//   {
//     titleKey: "marketingCommunicationTitle",
//     descriptionKey: "marketingCommunicationDescription",
//     items: marketingPrivacyItems,
//     isEssential: false,
//   },
//   {
//     titleKey: "dataSharingTitle",
//     descriptionKey: "dataSharingDescription",
//     items: dataPrivacyItems,
//     isEssential: false,
//   },
// ];

// // Default privacy settings - essential services enabled by default
// export const defaultPrivacySettings: UserPrivacySettings = {
//   // Essential - always enabled
//   service_communications: true,
//   booking_confirmations: true,
//   trip_notifications: true,
//   security_alerts: true,

//   // Functional - recommended enabled by default
//   location_services: true,
//   personalized_recommendations: true,
//   travel_history_analytics: true,
//   push_notifications: true,
//   offline_maps_caching: false,
//   crash_reporting: true,

//   // Marketing - disabled by default
//   promotional_emails: false,
//   promotional_push_notifications: false,
//   market_research: false,

//   // Data sharing - disabled by default
//   share_with_partners: false,
//   social_media_integration: false,
//   third_party_analytics: false,
// };

// // Helper function to get all privacy items
// export const getAllPrivacyItems = (): PrivacyItem[] => {
//   return [
//     ...essentialPrivacyItems,
//     ...functionalPrivacyItems,
//     ...marketingPrivacyItems,
//     ...dataPrivacyItems,
//   ];
// };

// // Helper function to check if a setting is essential
// export const isEssentialSetting = (key: keyof UserPrivacySettings): boolean => {
//   return essentialPrivacyItems.some(item => item.key === key);
// };

// // Helper function to get privacy item by key
// export const getPrivacyItemByKey = (key: keyof UserPrivacySettings): PrivacyItem | undefined => {
//   return getAllPrivacyItems().find(item => item.key === key);
// };
