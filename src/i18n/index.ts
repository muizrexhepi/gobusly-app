import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import it from "./locales/it.json";
import mk from "./locales/mk.json";
import sq from "./locales/sq.json";

const LANGUAGE_STORAGE_KEY = "@user_language";

// Language resources
const resources = {
  en: { translation: en },
  de: { translation: de },
  it: { translation: it },
  sq: { translation: sq },
  mk: { translation: mk },
};

const supportedLanguages = Object.keys(resources);

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Check if user already selected a language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        callback(savedLanguage);
        return;
      }

      // Get device locale
      const locales = Localization.getLocales();
      const deviceLocale = locales[0]?.languageCode || "en";

      const languageCode = supportedLanguages.includes(deviceLocale)
        ? deviceLocale
        : "en";

      callback(languageCode);
    } catch (error) {
      console.error("Language detection failed:", error);
      callback("en");
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      if (supportedLanguages.includes(lng)) {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
      }
    } catch (error) {
      console.error("Failed to cache language:", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: __DEV__,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    pluralSeparator: "_",
    contextSeparator: "_",
  });

export default i18n;
