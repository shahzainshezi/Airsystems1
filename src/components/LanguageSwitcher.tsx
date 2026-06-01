"use client";

import { useState, useEffect } from "react";

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(languages[0]);

  useEffect(() => {
    // Check if a language is already selected via Google Translate cookie
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match) {
      const parts = match[2].split('/');
      const code = parts[parts.length - 1];
      const lang = languages.find(l => l.code === code);
      if (lang) {
        setCurrentLang(lang);
      }
    }
  }, []);

  const changeLanguage = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    
    // Set Google Translate cookie
    const domain = window.location.hostname;
    // Set for current domain
    document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${domain}`;
    // Set for localhost/root
    document.cookie = `googtrans=/en/${lang.code}; path=/;`;
    
    // Reload to apply translation
    window.location.reload();
  };

  return (
    <div className="dropdown lang-dropdown" style={{ marginLeft: 'auto', marginRight: '1rem' }}>
      <div 
        className="nav-link" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', padding: '0.5rem' }}
      >
        <span>{currentLang.flag}</span>
        <span className="lang-name-hide-mobile" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentLang.name}</span>
        <i className='bx bx-chevron-down'></i>
      </div>
      
      <div className="dropdown-content profile-dropdown" style={{ minWidth: '150px' }}>
        {languages.map((lang) => (
          <a 
            key={lang.code}
            href="#"
            onClick={(e) => { e.preventDefault(); changeLanguage(lang); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.8rem',
              background: currentLang.code === lang.code ? '#f1f5f9' : 'transparent',
              fontWeight: currentLang.code === lang.code ? '700' : '500',
              padding: '0.8rem 1.5rem',
              color: '#0f172a',
              textDecoration: 'none'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
            {lang.name}
          </a>
        ))}
      </div>
    </div>
  );
}
