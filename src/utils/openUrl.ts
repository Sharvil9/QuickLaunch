type TabsApi = {
  create: (properties: { url: string; active: boolean }) => Promise<unknown>;
};

type ExtensionApi = { tabs?: TabsApi };

const extensionApis = globalThis as typeof globalThis & {
  browser?: ExtensionApi;
  chrome?: ExtensionApi;
};

/** Open a website in the background so the extension popup stays available. */
export function openUrlInBackground(url: string): void {
  const tabsApi = extensionApis.browser?.tabs ?? extensionApis.chrome?.tabs;

  const openInForeground = () => {
    // Keep the web preview usable outside an installed browser extension.
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!tabsApi) {
    openInForeground();
    return;
  }

  try {
    void tabsApi.create({ url, active: false }).catch(() => {
      // Fall back if the browser rejects background-tab creation.
      openInForeground();
    });
  } catch {
    // Fall back if the browser rejects background-tab creation.
    openInForeground();
  }
}
