'use client';

import React, { useState, useEffect } from 'react';

const colors = {
  navy: '#0B1F3A',
  white: '#FFFFFF',
  gray: '#6B7280',
  grayLight: '#E5E7EB',
  gold: '#C9A24A',
};

interface LanguageToggleProps {
  position?: 'fixed' | 'relative';
  style?: 'button' | 'dropdown';
}

export default function LanguageToggle({ position = 'fixed', style = 'button' }: LanguageToggleProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'ar' | 'fr'>('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('masar-lang');
    if (savedLang && ['en', 'ar', 'fr'].includes(savedLang)) {
      setCurrentLang(savedLang as 'en' | 'ar' | 'fr');
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode as 'en' | 'ar' | 'fr');
    localStorage.setItem('masar-lang', langCode);
    
    const lang = languages.find(l => l.code === langCode);
    if (lang) {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = langCode;
    }
    
    setIsOpen(false);
    
    // Reload page to apply translations
    window.location.reload();
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  if (style === 'dropdown') {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: colors.white,
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.label}</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </button>

        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: colors.white,
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            zIndex: 1000,
            minWidth: '150px'
          }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '12px 16px',
                  background: currentLang === lang.code ? colors.grayLight : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: colors.navy,
                  fontWeight: currentLang === lang.code ? 600 : 400,
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                <span>{lang.label}</span>
                {currentLang === lang.code && (
                  <span style={{ marginLeft: 'auto', color: colors.gold }}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Button style (fixed position)
  return (
    <button
      onClick={() => {
        const nextIndex = (languages.findIndex(l => l.code === currentLang) + 1) % languages.length;
        handleLanguageChange(languages[nextIndex].code);
      }}
      style={{
        position: position === 'fixed' ? 'fixed' : 'relative',
        bottom: position === 'fixed' ? '90px' : undefined,
        right: position === 'fixed' ? '24px' : undefined,
        zIndex: position === 'fixed' ? 90 : undefined,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: colors.white,
        border: `1px solid ${colors.grayLight}`,
        boxShadow: position === 'fixed' ? '0 4px 16px rgba(0,0,0,0.1)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      title={`Switch language (currently: ${currentLanguage.label})`}
    >
      <span style={{ fontSize: '16px' }}>{currentLanguage.flag}</span>
      <span style={{ fontSize: '8px', fontWeight: 700, color: colors.navy, marginTop: '2px' }}>
        {currentLang.toUpperCase()}
      </span>
    </button>
  );
}
