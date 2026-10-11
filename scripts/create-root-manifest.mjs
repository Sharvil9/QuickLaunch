import { readFile, writeFile } from 'node:fs/promises';

const manifestUrl = new URL('../public/manifest.json', import.meta.url);
const rootManifestUrl = new URL('../manifest.json', import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
const rootPath = (value) => value.startsWith('dist/') ? value : `dist/${value}`;

if (manifest.action?.default_popup) {
  manifest.action.default_popup = rootPath(manifest.action.default_popup);
}
if (manifest.side_panel?.default_path) {
  manifest.side_panel.default_path = rootPath(manifest.side_panel.default_path);
}
if (manifest.icons) {
  manifest.icons = Object.fromEntries(
    Object.entries(manifest.icons).map(([size, path]) => [size, rootPath(path)])
  );
}
if (manifest.action?.default_icon) {
  manifest.action.default_icon = typeof manifest.action.default_icon === 'string'
    ? rootPath(manifest.action.default_icon)
    : Object.fromEntries(
      Object.entries(manifest.action.default_icon).map(([size, path]) => [size, rootPath(path)])
    );
}

await writeFile(rootManifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
