/**
 * Common presets for user-agents, window sizes, and colour themes.
 */

export interface Preset<T> {
  label: string
  value: T
}

export const USER_AGENT_PRESETS: Preset<string>[] = [
  {
    label: 'Chrome (Desktop, macOS)',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  },
  {
    label: 'Chrome (Desktop, Windows)',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  },
  {
    label: 'Chrome (Mobile, Android)',
    value:
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.101 Mobile Safari/537.36',
  },
  {
    label: 'Safari (Desktop, macOS)',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  },
  {
    label: 'Safari (Mobile, iPhone)',
    value:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  },
  {
    label: 'Firefox (Desktop)',
    value:
      'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  },
  {
    label: 'WhatsApp Web (required for WhatsApp)',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  },
]

export interface WindowSizePreset {
  label: string
  width: number
  height: number
}

export const WINDOW_SIZE_PRESETS: WindowSizePreset[] = [
  { label: '1024 × 768 (XGA)', width: 1024, height: 768 },
  { label: '1280 × 800', width: 1280, height: 800 },
  { label: '1280 × 960', width: 1280, height: 960 },
  { label: '1366 × 768 (HD)', width: 1366, height: 768 },
  { label: '1440 × 900', width: 1440, height: 900 },
  { label: '1600 × 1000', width: 1600, height: 1000 },
  { label: '1920 × 1080 (Full HD)', width: 1920, height: 1080 },
  { label: '2560 × 1440 (QHD)', width: 2560, height: 1440 },
]

export const BACKGROUND_COLOR_PRESETS: Preset<string>[] = [
  { label: 'White', value: '#ffffff' },
  { label: 'Off-white', value: '#fafafa' },
  { label: 'Dark grey', value: '#1a1a1a' },
  { label: 'Slate', value: '#1e293b' },
  { label: 'Transparent (default)', value: '' },
]

export const DARK_MODE_CSS_PRESET = `/* Force dark mode on any website */
:root { color-scheme: dark !important; }
html, body {
  background: #1a1a1a !important;
  color: #e8e8e8 !important;
}
input, textarea, select, button {
  background: #2a2a2a !important;
  color: #e8e8e8 !important;
  border-color: #444 !important;
}
a { color: #7aadff !important; }
`

export const FOCUS_MODE_CSS_PRESET = `/* Focus mode – remove distracting UI elements */
[data-testid="sideNav"], aside, nav, .sidebar,
.ad, .ads, .advertisement, [class*="banner"],
[id*="sidebar"], [class*="sidebar"], footer { display: none !important; }
body { max-width: 900px; margin: 0 auto; padding: 0 24px; }
`

export const MINIMAL_SCROLLBAR_CSS_PRESET = `/* Minimal scrollbars */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.4); border-radius: 3px; }
::-webkit-scrollbar-track { background: transparent; }
`

export const BLANK_JS_PRESET = `// Custom JavaScript injected at app startup
// This script runs in the renderer process (Electron / Chromium)
// document, window and all DOM APIs are available.

(function () {
  console.log('[NativefierStudio] Custom JS loaded');
  // Your code here…
})();
`
