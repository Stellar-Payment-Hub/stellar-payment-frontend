import React from 'react';
import { HighContrastToggle } from '../accessibility/HighContrastToggle';
import { FontSizeScaler } from '../accessibility/FontSizeScaler';
import { LanguageSelector } from '../i18n/LanguageSelector';

export const UserPreferencesCenter: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4" data-testid="user-preferences-center">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">Operator Preferences & Accessibility</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-700 dark:text-slate-300">Display Language</span>
          <LanguageSelector />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-700 dark:text-slate-300">Accessibility Scale</span>
          <FontSizeScaler />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-700 dark:text-slate-300">High Contrast Mode</span>
          <HighContrastToggle />
        </div>
      </div>
    </div>
  );
};
