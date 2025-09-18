import "react-i18next";
import en from "../i18n/locales/en.json";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
  }
}

export type TranslationKey = keyof typeof en;
export type CommonKeys = keyof typeof en.common;
export type AuthKeys = keyof typeof en.auth;
export type SettingsKeys = keyof typeof en.settings;
export type LanguageKeys = keyof typeof en.languages;
