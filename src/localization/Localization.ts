import * as i18next from "i18next";
import * as React from "react";
import { initReactI18next, useTranslation } from "react-i18next";

import uiEnglish from "../localization/en/ui.json";
import messagesEnglish from "../localization/en/messages.json";
import settingsEnglish from "../localization/en/settings.json";
import uiFinnish from "../localization/fi/ui.json";
import messagesFinnish from "../localization/fi/messages.json";
import settingsFinnish from "../localization/fi/settings.json";

const localizationResources = {
    en: {
        ui: uiEnglish,
        messages: messagesEnglish,
        settings: settingsEnglish,
    },
    fi: {
        ui: uiFinnish,
        messages: messagesFinnish,
        settings: settingsFinnish,
    },
};

export type Locales = keyof typeof localizationResources;
export type LocalizationResources = keyof (typeof localizationResources)[Locales];
export type LocalizationNames = keyof typeof uiEnglish | keyof typeof messagesEnglish | keyof typeof settingsEnglish;
const resourceArray = Object.keys(localizationResources["en"]);

const defaultLanguage: Locales = "en";
const fallbackLng: Locales = "en";

void i18next.use(initReactI18next).init({
    resources: localizationResources,
    lng: defaultLanguage,
    fallbackLng: fallbackLng,
});

/**
 * A localization function returned by the {@link useLocalize} hook.
 * @param {string} entryName The name of the localization key.
 * @param {string?} defaultValue A default value if a localization key is not found.
 * @param {object?} params The interpolation parameters for the localization function. E.g. `{ interpolationName: interpolationValue }`.
 * @param {boolean?} escapeValue A value indicating whether the special characters should be escaped with interpolation. The default value is `true`.
 */
export type LocalizeFunction = (entryName: LocalizationNames, defaultValue?: string, params?: unknown, escapeValue?: boolean) => string;

export const useTranslate = () => {
    const { t, i18n } = useTranslation(resourceArray);

    const translate: LocalizeFunction = React.useMemo(() => {
        return (name: LocalizationNames, fallbackValue?: string, params?: unknown, escapeValue?: boolean): string => {
            const options = { interpolation: { escapeValue: escapeValue === undefined ? true : escapeValue } };
            const paramsNew = { ...(params as object), ...options };
            return t(name, { ns: resourceArray, defaultValue: fallbackValue ?? name, ...paramsNew });
        };
    }, [t]);

    const setLocale = React.useCallback(
        async (locale: Locales) => {
            await i18n.changeLanguage(locale);
        },
        [i18n]
    );

    return { translate, i18n, setLocale };
};

// A type for a single locale with an English name.
export type LocaleCodeName = {
    code: Locales;
    name: string;
};

// Create an array of the supported locales with their English names.
export const currentLocales: LocaleCodeName[] = [
    { code: "fi", name: "Finnish" },
    { code: "en", name: "English" },
];

export * as i18next from "i18next";
