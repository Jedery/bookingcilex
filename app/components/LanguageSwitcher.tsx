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
          padding: '8px 12px',
          backgroundColor: '#1a2540',
          border: '1px solid #2a3a52',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer'
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
