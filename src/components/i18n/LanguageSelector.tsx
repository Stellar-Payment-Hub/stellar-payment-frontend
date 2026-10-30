import React, { useState } from 'react';

export const LanguageSelector: React.FC = () => {
  const [lang, setLang] = useState('en');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'pt', label: 'Português' },
    { code: 'tl', label: 'Tagalog' },
  ];

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
      data-testid="language-selector"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
};
