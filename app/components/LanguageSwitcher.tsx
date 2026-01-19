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

      {/* Mobile: Solo bandiera */}
      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        style={{
          padding: '10px',
          background: 'rgba(26, 37, 64, 0.6)',
          border: '1px solid rgba(200, 150, 100, 0.2)',
          borderRadius: '8px',
          color: '#e8e8e8',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minWidth: '60px',
        }}
        className="language-switcher-mobile"
      >
        <option value="en">🇬🇧</option>
        <option value="it">🇮🇹</option>
        <option value="fr">🇫🇷</option>
        <option value="es">🇪🇸</option>
      </select>
    </div>
  );
}
