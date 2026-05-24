import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import {en} from '@/shared/locales/en';
import {ko} from '@/shared/locales/ko';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['ko', 'en'],
        resources: {
            en: {translation: en},
            ko: {translation: ko},
        },
        interpolation: {
            escapeValue: false,
        },
        debug: true,
    });

i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
});
