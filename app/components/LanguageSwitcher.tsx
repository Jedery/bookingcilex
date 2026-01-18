'use client';

type Language = 'en' | 'it' | 'fr' | 'es';

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
        onChange={(e) => setLanguage(e.target.value as 'en' | 'it' | 'fr' | 'es')}
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
      >
        <option value="en">🇬🇧 English</option>
        <option value="it">🇮🇹 Italiano</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
}
