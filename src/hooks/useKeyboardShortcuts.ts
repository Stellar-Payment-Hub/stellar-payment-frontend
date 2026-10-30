import { useEffect } from 'react';

interface ShortcutHandlers {
  onQuickSend?: () => void;
  onCloseModal?: () => void;
  onSwitchTab?: (tabIndex: number) => void;
}

export function useKeyboardShortcuts({
  onQuickSend,
  onCloseModal,
  onSwitchTab,
}: ShortcutHandlers) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (onQuickSend) onQuickSend();
      }

      // Escape key to dismiss modals
      if (e.key === 'Escape') {
        if (onCloseModal) onCloseModal();
      }

      // Alt+1 to Alt+5 tab switching
      if (e.altKey && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const tabIndex = parseInt(e.key, 10);
        if (onSwitchTab) onSwitchTab(tabIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onQuickSend, onCloseModal, onSwitchTab]);
}
