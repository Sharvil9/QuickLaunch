type TimerPanelApi = {
  open: (options: { windowId: number }) => Promise<void>;
};

type ChromeTabsApi = {
  query: (
    queryInfo: { active: boolean; lastFocusedWindow: boolean },
    callback: (tabs: Array<{ windowId?: number }>) => void,
  ) => void;
};

type ChromeExtensionApi = {
  sidePanel?: TimerPanelApi;
  tabs?: ChromeTabsApi;
};

const chromeApi = globalThis as typeof globalThis & { chrome?: ChromeExtensionApi };

export function openPersistentTimerPanel() {
  const sidePanel = chromeApi.chrome?.sidePanel;
  const tabs = chromeApi.chrome?.tabs;
  if (!sidePanel || !tabs) return;

  try {
    tabs.query({ active: true, lastFocusedWindow: true }, (activeTabs) => {
      const windowId = activeTabs[0]?.windowId;
      if (windowId === undefined) return;
      void sidePanel.open({ windowId }).catch(() => {
        // Chrome requires a recent user gesture and Chrome 116 or later.
        // The timer itself remains saved if the panel cannot be opened.
      });
    });
  } catch {
    // Keep the popup usable in browsers without the Chrome Side Panel API.
  }
}

export function supportsPersistentTimerPanel() {
  return Boolean(chromeApi.chrome?.sidePanel?.open && chromeApi.chrome?.tabs?.query);
}
