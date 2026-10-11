type PromiseStorageArea = {
  get: (key: string) => Promise<Record<string, unknown>>;
  set: (items: Record<string, unknown>) => Promise<void>;
};

type StorageChange = { newValue?: unknown };
type StorageChangedEvent = {
  addListener: (listener: (changes: Record<string, StorageChange>, areaName: string) => void) => void;
  removeListener: (listener: (changes: Record<string, StorageChange>, areaName: string) => void) => void;
};

type CallbackStorageArea = {
  get: (key: string, callback: (items: Record<string, unknown>) => void) => void;
  set: (items: Record<string, unknown>, callback: () => void) => void;
};

type ExtensionApis = {
  browser?: { storage?: { local?: PromiseStorageArea; onChanged?: StorageChangedEvent } };
  chrome?: {
    storage?: { local?: CallbackStorageArea; onChanged?: StorageChangedEvent };
    runtime?: { lastError?: { message?: string } };
  };
};

const extensionApis = globalThis as typeof globalThis & ExtensionApis;

export async function readSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const browserStorage = extensionApis.browser?.storage?.local;
    if (browserStorage) {
      const result = await browserStorage.get(key);
      if (result[key] !== undefined) return result[key] as T;
    }

    const chromeStorage = extensionApis.chrome?.storage?.local;
    if (chromeStorage) {
      const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
        chromeStorage.get(key, (items) => {
          const message = extensionApis.chrome?.runtime?.lastError?.message;
          if (message) reject(new Error(message));
          else resolve(items);
        });
      });
      if (result[key] !== undefined) return result[key] as T;
    }
  } catch {
    // Fall back to localStorage when extension storage is unavailable.
  }

  try {
    const storageKeys = key === 'links' ? [`quicklaunch:${key}`, 'quicklaunch-links'] : [`quicklaunch:${key}`];
    for (const storageKey of storageKeys) {
      const serialized = window.localStorage.getItem(storageKey);
      if (serialized !== null) return JSON.parse(serialized) as T;
    }
  } catch {
    // Keep the app usable when browser storage is unavailable or contains bad data.
  }

  return fallback;
}

export async function writeSetting<T>(key: string, value: T): Promise<void> {
  try {
    const browserStorage = extensionApis.browser?.storage?.local;
    if (browserStorage) {
      await browserStorage.set({ [key]: value });
      return;
    }

    const chromeStorage = extensionApis.chrome?.storage?.local;
    if (chromeStorage) {
      await new Promise<void>((resolve, reject) => {
        chromeStorage.set({ [key]: value }, () => {
          const message = extensionApis.chrome?.runtime?.lastError?.message;
          if (message) reject(new Error(message));
          else resolve();
        });
      });
      return;
    }
  } catch {
    // Fall back to localStorage in a normal web preview or if the extension API fails.
  }

  try {
    window.localStorage.setItem(`quicklaunch:${key}`, JSON.stringify(value));
  } catch {
    // Storage is optional; the current session remains usable without persistence.
  }
}

export function subscribeToSetting<T>(key: string, callback: (value: T | undefined) => void): () => void {
  const browserChanges = extensionApis.browser?.storage?.onChanged;
  const chromeChanges = extensionApis.chrome?.storage?.onChanged;
  const changes = browserChanges ?? chromeChanges;

  if (changes) {
    const listener = (updated: Record<string, StorageChange>, areaName: string) => {
      if (areaName !== 'local' || !(key in updated)) return;
      callback(updated[key].newValue as T | undefined);
    };
    changes.addListener(listener);
    return () => changes.removeListener(listener);
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key !== `quicklaunch:${key}` || event.newValue === null) return;
    try {
      callback(JSON.parse(event.newValue) as T);
    } catch {
      callback(undefined);
    }
  };
  window.addEventListener('storage', storageListener);
  return () => window.removeEventListener('storage', storageListener);
}
