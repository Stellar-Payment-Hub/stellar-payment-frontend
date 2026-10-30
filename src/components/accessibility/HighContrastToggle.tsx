import React, { useState } from 'react';

export const HighContrastToggle: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);

  const toggle = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold"
      data-testid="high-contrast-toggle"
    >
      {highContrast ? 'Standard Contrast' : 'WCAG AAA High Contrast'}
    </button>
  );
};
