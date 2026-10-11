import { useEffect } from 'react';
import { Timer } from './Timer';
import { readSetting, subscribeToSetting } from '../utils/storage';

export function TimerPanel() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (value: boolean | null | undefined) => {
      document.documentElement.classList.toggle('dark', typeof value === 'boolean' ? value : media.matches);
    };
    const unsubscribe = subscribeToSetting<boolean | null>('darkMode', applyTheme);
    const onSystemThemeChange = () => {
      void readSetting<boolean | null>('darkMode', null).then(applyTheme);
    };
    media.addEventListener('change', onSystemThemeChange);
    void readSetting<boolean | null>('darkMode', null).then(applyTheme);

    return () => {
      unsubscribe();
      media.removeEventListener('change', onSystemThemeChange);
    };
  }, []);

  return (
    <main className="app-timer-panel min-h-screen p-3 sm:p-4">
      <p className="app-eyebrow mb-3 px-1">Focus companion</p>
      <Timer variant="panel" />
      <p className="app-text-muted mt-4 px-1 text-xs leading-relaxed">
        Your timer stays in sync with QuickLaunch. Close the popup or switch tabs and the clock keeps moving.
      </p>
    </main>
  );
}
