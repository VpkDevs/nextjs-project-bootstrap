// ─── Core app configuration (maps to nativefier CLI options + our extras) ───

export type Platform = 'mac' | 'linux' | 'windows'
export type Arch = 'x64' | 'arm64' | 'armv7l'
export type TrayOption = 'true' | 'false' | 'start-in-tray'
export type TitleBarStyle =
  | 'default'
  | 'hidden'
  | 'hiddenInset'
  | 'customButtonsOnHover'

export interface AppConfig {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: string
  name: string
  url: string
  icon?: string          // file-system path or base64 data-url
  iconUrl?: string       // source URL we fetched the icon from

  // ── Build target ──────────────────────────────────────────────────────────
  platform: Platform
  arch: Arch
  out?: string           // output directory (defaults to ~/Desktop)

  // ── Window ────────────────────────────────────────────────────────────────
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  x?: number
  y?: number
  fullscreen?: boolean
  maximize?: boolean
  hideWindowFrame?: boolean
  alwaysOnTop?: boolean
  titleBarStyle?: TitleBarStyle
  backgroundColor?: string
  tabbedWindow?: boolean

  // ── Navigation ────────────────────────────────────────────────────────────
  internalUrls?: string     // regex for URLs to open inside the app
  blockExternalUrls?: boolean

  // ── Session & identity ────────────────────────────────────────────────────
  singleInstance?: boolean
  clearCache?: boolean
  userAgent?: string
  basicAuthUsername?: string
  basicAuthPassword?: string

  // ── Tray ──────────────────────────────────────────────────────────────────
  tray?: TrayOption
  trayIconPath?: string

  // ── Proxy ─────────────────────────────────────────────────────────────────
  proxyRules?: string

  // ── Security & permissions ─────────────────────────────────────────────────
  disableDevTools?: boolean
  disableContextMenu?: boolean
  allowUnprotectedContent?: boolean
  ignoreCertificate?: boolean
  insecure?: boolean
  notificationBadge?: boolean

  // ── Zoom ──────────────────────────────────────────────────────────────────
  zoom?: number             // default zoom factor, e.g. 1.0 = 100 %

  // ── Injection (nativefier --inject) ───────────────────────────────────────
  injectFiles?: string[]    // paths to .css / .js files to inject at startup

  // ── Extensions beyond nativefier ─────────────────────────────────────────
  // These are handled by generating inject files before calling nativefier
  forceDarkMode?: boolean   // inject a universal dark-mode stylesheet
  adBlocking?: boolean      // inject a request-blocker script
  customCss?: string        // raw CSS to inject
  customJs?: string         // raw JS to inject
  autoRefreshOnDisconnect?: boolean  // reload page when network reconnects
  showScrollbars?: boolean  // restore hidden scrollbars

  // ── Metadata ──────────────────────────────────────────────────────────────
  templateId?: string
  tags?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── Build job ───────────────────────────────────────────────────────────────

export type BuildStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled'

export interface BuildJob {
  id: string
  appId: string
  appName: string
  status: BuildStatus
  startedAt: string
  finishedAt?: string
  outputPath?: string
  logs: string[]
  errorMessage?: string
}

// ─── App record (config + optional last build) ───────────────────────────────

export interface AppRecord {
  config: AppConfig
  lastBuild?: Pick<BuildJob, 'id' | 'status' | 'finishedAt' | 'outputPath'>
}

// ─── Template ────────────────────────────────────────────────────────────────

export type TemplateCategory =
  | 'Productivity'
  | 'Communication'
  | 'Development'
  | 'Entertainment'
  | 'Social'
  | 'Finance'
  | 'Design'
  | 'News'
  | 'Education'

export interface AppTemplate {
  id: string
  name: string
  url: string
  description: string
  category: TemplateCategory
  iconUrl: string
  config: Partial<Omit<AppConfig, 'id' | 'name' | 'url' | 'createdAt' | 'updatedAt'>>
}

// ─── User settings ───────────────────────────────────────────────────────────

export interface UserSettings {
  defaultOutputDir: string
  defaultPlatform: Platform
  defaultArch: Arch
  defaultWidth: number
  defaultHeight: number
  theme: 'dark' | 'light' | 'system'
  proxyRules?: string
  nativefierPath?: string   // override path to nativefier binary
}

// ─── Icon fetch result ───────────────────────────────────────────────────────

export interface IconResult {
  url: string
  source: 'og' | 'apple-touch' | 'favicon' | 'clearbit' | 'duckduckgo'
  width?: number
  height?: number
}
