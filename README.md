# QuickLaunch

QuickLaunch is a personal browser extension for opening frequently used websites with fewer clicks. It brings AI tools, work apps, personal shortcuts, and time tools into one searchable popup.

## Features

- Search shortcuts by name, category, or service.
- Use **⌘K** on macOS or **Ctrl+K** on Windows/Linux to focus search, then press **Enter** to open the first result.
- Open favorite sites in background tabs and create launch groups for opening several sites together.
- Add personal links, browse categories, and drag shortcuts to arrange them.
- Keep shortcuts, recent links, and theme preferences between popup sessions.
- View four analog world clocks with 12-hour readouts, a monthly calendar, a stopwatch, and a countdown in the same scrollable popup.
- Keep a running timer visible in Chrome's side panel. Timer progress is saved when the popup closes.

## Build

QuickLaunch requires Node.js and npm. Chrome 116 or later is required for the timer side-panel integration.

```sh
git clone https://github.com/Sharvil9/QuickLaunch.git
cd QuickLaunch
npm ci
npm run build
```

The build creates the unpacked extension in `dist/`.

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked** and select the project's `dist` folder.
4. Pin QuickLaunch to the toolbar for quick access.

Start a stopwatch or countdown from the popup to open it in Chrome's side panel. Closing the popup does not stop the timer. If the side panel is closed, reopen it from the extension to see the saved timer again.

## Development

Run `npm run dev` for the Vite development preview. Before loading code changes into Chrome, run `npm run build`, then use **Reload** for QuickLaunch on `chrome://extensions`.

AI tools were used extensively during development of this project. QuickLaunch is distributed under the MIT License; see [LICENSE](LICENSE).
