'use client';

type Language = 'en' | 'it' | 'fr' | 'es';

const FLAGS: Record<Language, string> = {
  en: '🇬🇧',
  it: '🇮🇹',
  fr: '🇫🇷',
  es: '🇪🇸',
};

const NAMES: Record<Language, string> = {
  en: 'English',
  it: 'Italiano',
  fr: 'Français',
  es: 'Español',
};

export default function LanguageSwitcher({ 
  language, 
  setLanguage 
}: { 
  language: Language; 
  setLanguage: (lang: Language) => void; 
}) {

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Desktop: Bandiera + Testo */}
      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        style={{
          padding: '10px 16px',
          background: 'rgba(26, 37, 64, 0.6)',
          border: '1px solid rgba(200, 150, 100, 0.2)',
          borderRadius: '8px',
          color: '#e8e8e8',
          fontSize: '13px',
          fontWeight: '300',
          letterSpacing: '1px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        className="language-switcher-full"
      >
        <option value="en">🇬🇧 English</option>
        <option value="it">🇮🇹 Italiano</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="es">🇪🇸 Español</option>
      </select>

      {/* Mobile: Solo bandiera più grande e stilata - ALLINEATO */}
      <button
        onClick={() => {
          const langs: Language[] = ['it', 'en', 'fr', 'es'];
          const currentIndex = langs.indexOf(language);
          const nextIndex = (currentIndex + 1) % langs.length;
          setLanguage(langs[nextIndex]);
        }}
        style={{
          padding: '0',
          background: 'linear-gradient(135deg, rgba(26, 26, 30, 0.6), rgba(15, 15, 18, 0.8))',
          border: '1px solid rgba(200, 150, 100, 0.2)',
          borderRadius: '12px',
          color: '#e8e8e8',
          fontSize: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          flexShrink: 0,
        }}
        className="language-switcher-mobile"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.4)';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(200, 150, 100, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(200, 150, 100, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        }}
      >
        {FLAGS[language]}
      </button>
    </div>
  );
}
