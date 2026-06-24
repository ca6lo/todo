import { useEffect } from 'react';

/**
 * Custom hook to register global keyboard shortcuts.
 * Automatically ignores shortcuts when typing in inputs/textareas.
 * 
 * @param {Object} callbacks - Shortcut callback functions.
 * @param {Function} callbacks.onNewTask - Triggered on 'N' keypress.
 * @param {Function} callbacks.onToggleTheme - Triggered on 'D' keypress.
 * @param {Function} callbacks.onFocusSearch - Triggered on 'S' keypress.
 * @param {Function} callbacks.onEscape - Triggered on 'Escape' keypress.
 */
export const useKeyboard = (callbacks) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      const tagName = activeElement ? activeElement.tagName.toLowerCase() : '';
      
      // Determine if user is typing in a form control or editable div
      const isTyping = 
        tagName === 'input' || 
        tagName === 'textarea' || 
        tagName === 'select' || 
        (activeElement && activeElement.isContentEditable);

      // Escape key should work even if typing (to close modal/drawer)
      if (event.key === 'Escape') {
        if (callbacks.onEscape) {
          event.preventDefault();
          callbacks.onEscape();
        }
        return;
      }

      if (isTyping) return;

      switch (event.key.toLowerCase()) {
        case 'n':
          if (callbacks.onNewTask) {
            event.preventDefault();
            callbacks.onNewTask();
          }
          break;
        case 'd':
          if (callbacks.onToggleTheme) {
            event.preventDefault();
            callbacks.onToggleTheme();
          }
          break;
        case 's':
          if (callbacks.onFocusSearch) {
            event.preventDefault();
            callbacks.onFocusSearch();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callbacks]);
};
export default useKeyboard;
