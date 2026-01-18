import { useState, useEffect } from 'react';
import en from './en.json';
import it from './it.json';
import fr from './fr.json';
import es from './es.json';

type Language = 'en' | 'it' | 'fr' | 'es';

const translations = { en, it, fr, es };

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { language, setLanguage, t };
}
