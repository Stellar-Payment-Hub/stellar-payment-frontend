import React, { useEffect } from 'react';

export const KeyboardShortcutsManager: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch && onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <div className="text-[11px] text-slate-400 font-mono" data-testid="keyboard-shortcuts-manager">
      Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Ctrl+K</kbd> to search commands
    </div>
  );
};
