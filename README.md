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

## Install from the GitHub ZIP

1. On GitHub, choose **Code → Download ZIP**, then unzip the download.
2. Open `chrome://extensions` in Chrome and turn on **Developer mode**.
3. Choose **Load unpacked** and select the extracted `QuickLaunch-main` folder itself.
4. Pin QuickLaunch to the toolbar for quick access.

Chrome needs an extracted folder with `manifest.json` at its root, so it cannot load the ZIP file directly. The repository ZIP includes a prebuilt extension and a root manifest, so no Node.js setup or manual build is needed for installation. You can also select the `dist` folder if you want to load only the compiled extension.

Chrome 116 or later is required for the timer side-panel integration. Start a stopwatch or countdown from the popup to open it in Chrome's side panel. Closing the popup does not stop the timer. If the side panel is closed, reopen it from the extension to see the saved timer again.

## Build from source

QuickLaunch requires Node.js and npm.

```sh
npm ci
npm run build
```

The build refreshes both the standalone extension in `dist/` and the root manifest used when loading the entire repository folder. After rebuilding, use **Reload** for QuickLaunch on `chrome://extensions`.

Run `npm run dev` for the Vite development preview.

AI tools were used extensively during development of this project. QuickLaunch is distributed under the MIT License; see [LICENSE](LICENSE).
