# Nativefier Studio

> Wrap any website into a beautiful desktop app — with dark mode, ad blocking, custom CSS/JS injection, and 34 pre-built templates.

Nativefier Studio is a full-stack Next.js GUI that wraps [nativefier](https://github.com/nativefier/nativefier) and extends it with features that make it a genuine alternative to building from scratch with Electron or Tauri.

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Features

### 🏗️ Beyond nativefier

| Feature | How |
|---|---|
| 🌙 Force dark mode | Universal CSS injected via `--inject` |
| 🛡️ Ad & tracker blocking | JS blocks requests to 30+ ad/analytics domains |
| 🔄 Auto-refresh on reconnect | Reloads app when network comes back |
| ↕️ Restore hidden scrollbars | CSS injection to unhide scrollbars |
| 💉 Custom CSS editor | With Dark Mode, Focus Mode, Scrollbar presets |
| 💉 Custom JS editor | Injected at app startup, full DOM access |
| 🔍 Icon auto-detection | Tries apple-touch-icon → og:image → Clearbit → DuckDuckGo |
| 📤 Config export | Export any app config as JSON |

### 🎨 Template Gallery (34 templates, 9 categories)

Pre-configured apps for Notion, Slack, Discord, WhatsApp, Gmail, ChatGPT, YouTube, GitHub, Figma, and many more.

### 📐 6-Step App Creator

Basic → Platform → Window → Advanced → Injection → Build

All nativefier options exposed through a clean UI: platform/arch, window size, tray settings, single instance, user-agent presets, proxy, basic auth, and more.

### 📚 App Library

Browse, search, tag, rebuild, and export all saved app configurations. Live build log streaming shows nativefier output in real time.

## API Routes

| Route | Purpose |
|---|---|
| `GET /api/apps` | List all saved apps |
| `POST /api/apps` | Create a new app record |
| `PATCH /api/apps/[id]` | Update an app |
| `DELETE /api/apps/[id]` | Delete an app |
| `POST /api/build` | Start a build |
| `GET /api/build/[id]` | Poll build status & logs |
| `GET /api/icon?url=` | Fetch icons for a URL |
| `GET/PUT /api/settings` | Global settings |

## Data Storage

App configs are stored in `data/apps.json` (file-based JSON, excluded from git). Builds run via `npx nativefier` and output to the configured directory (default: `~/Desktop`).

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** with custom dark-mode design tokens
- **nativefier** — underlying build engine
- **cheerio** — HTML parsing for icon detection
- **fs-extra** — file operations for inject file generation

## Security Notes

nativefier's internal Electron packaging toolchain contains known vulnerabilities in `@babel/traverse` and `form-data`. These are scoped to its own build process and are not reachable from this application's request handlers. See the PR description for full details.
