'use client';

import { useState, useEffect, useCallback } from 'react';

// Translation files
import en from '../../public/locales/en.json';
import ar from '../../public/locales/ar.json';
import fr from '../../public/locales/fr.json';

const translations: Record<string, any> = { en, ar, fr };

export type Language = 'en' | 'ar' | 'fr';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('masar-lang') as Language;
    if (savedLang && ['en', 'ar', 'fr'].includes(savedLang)) {
      setLanguage(savedLang);
      setIsRTL(savedLang === 'ar');
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations['en'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }

    return value;
  }, [language]);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setIsRTL(newLang === 'ar');
    localStorage.setItem('masar-lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    window.location.reload();
  }, []);

  return {
    t,
    language,
    isRTL,
    changeLanguage,
  };
}

export default useTranslation;
