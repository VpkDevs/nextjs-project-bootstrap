/**
 * Async nativefier build runner.
 *
 * Wraps the nativefier CLI via child_process.spawn so we can:
 *  - stream logs in real-time
 *  - support cancellation
 *  - inject generated CSS / JS files for our extra features
 *  - track build state in-memory
 */

import { spawn } from 'child_process'
import path from 'path'
import os from 'os'
import fse from 'fs-extra'
import { v4 as uuid } from 'uuid'
import type { AppConfig, BuildJob } from '@/types'

// ─── In-memory build registry ────────────────────────────────────────────────
// (persists only for the lifetime of the Next.js server process)

const builds = new Map<string, BuildJob>()

export function getBuild(id: string): BuildJob | undefined {
  return builds.get(id)
}

export function listBuilds(): BuildJob[] {
  return Array.from(builds.values()).sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
}

// ─── Generated-file helpers ──────────────────────────────────────────────────

const DARK_MODE_CSS = `
/* ──────────────────────────────────────────
   Universal dark mode injected by Nativefier Studio
   ────────────────────────────────────────── */
:root {
  color-scheme: dark !important;
}
html, body {
  background: #1a1a1a !important;
  color: #e8e8e8 !important;
  filter: none !important;
}
img, video, canvas, svg { filter: none !important; }
input, textarea, select, button {
  background: #2a2a2a !important;
  color: #e8e8e8 !important;
  border-color: #444 !important;
}
a { color: #7aadff !important; }
`

const AD_BLOCK_JS = `
/* ──────────────────────────────────────────
   Request blocker injected by Nativefier Studio
   ────────────────────────────────────────── */
(function () {
  const BLOCK_LIST = [
    'doubleclick.net','googlesyndication.com','adservice.google.com',
    'googletagmanager.com','google-analytics.com','googletagservices.com',
    'adnxs.com','ads.yahoo.com','advertising.com','2mdn.net',
    'adsrvr.org','moatads.com','scorecardresearch.com','quantserve.com',
    'outbrain.com','taboola.com','adform.net','criteo.com','rubiconproject.com',
    'pubmatic.com','openx.net','amazon-adsystem.com','media.net',
    'spotxchange.com','lijit.com','serving-sys.com','yieldmanager.com',
    'addthis.com','sharethis.com','hotjar.com','mouseflow.com','fullstory.com',
  ];
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    if (BLOCK_LIST.some(d => String(url).includes(d))) return;
    return origOpen.apply(this, [method, url, ...args]);
  };
  const origFetch = window.fetch;
  window.fetch = function (input, ...args) {
    const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
    if (BLOCK_LIST.some(d => url.includes(d))) return Promise.resolve(new Response('', { status: 200 }));
    return origFetch.apply(this, [input, ...args]);
  };
})();
`

const AUTO_REFRESH_JS = `
/* Auto-refresh on network reconnect – injected by Nativefier Studio */
(function () {
  let wasOffline = false;
  window.addEventListener('offline', () => { wasOffline = true; });
  window.addEventListener('online', () => {
    if (wasOffline) { wasOffline = false; setTimeout(() => location.reload(), 1500); }
  });
})();
`

const RESTORE_SCROLLBARS_CSS = `
/* Restore hidden scrollbars – injected by Nativefier Studio */
::-webkit-scrollbar { width: 8px !important; height: 8px !important; display: block !important; }
::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.5) !important; border-radius: 4px; }
::-webkit-scrollbar-track { background: transparent !important; }
* { scrollbar-width: thin !important; }
`

// ─── Main build function ──────────────────────────────────────────────────────

export async function startBuild(config: AppConfig): Promise<BuildJob> {
  const jobId = uuid()
  const job: BuildJob = {
    id: jobId,
    appId: config.id,
    appName: config.name,
    status: 'pending',
    startedAt: new Date().toISOString(),
    logs: [],
  }
  builds.set(jobId, job)

  // Run async – don't await here so the API can return the job ID immediately
  runBuild(job, config).catch((err) => {
    job.status = 'failed'
    job.errorMessage = String(err)
    job.finishedAt = new Date().toISOString()
  })

  return job
}

async function runBuild(job: BuildJob, config: AppConfig): Promise<void> {
  job.status = 'running'
  job.logs.push(`[studio] Build started at ${job.startedAt}`)
  job.logs.push(`[studio] Building "${config.name}" from ${config.url}`)

  // ── Generate inject files in a temp directory ─────────────────────────────
  const tmpDir = path.join(os.tmpdir(), `nativefier-studio-${job.id}`)
  await fse.ensureDir(tmpDir)

  const injectPaths: string[] = [...(config.injectFiles ?? [])]

  if (config.forceDarkMode) {
    const p = path.join(tmpDir, 'dark-mode.css')
    await fse.writeFile(p, DARK_MODE_CSS)
    injectPaths.push(p)
    job.logs.push('[studio] Injecting dark-mode CSS')
  }

  if (config.adBlocking) {
    const p = path.join(tmpDir, 'ad-block.js')
    await fse.writeFile(p, AD_BLOCK_JS)
    injectPaths.push(p)
    job.logs.push('[studio] Injecting ad-blocking script')
  }

  if (config.autoRefreshOnDisconnect) {
    const p = path.join(tmpDir, 'auto-refresh.js')
    await fse.writeFile(p, AUTO_REFRESH_JS)
    injectPaths.push(p)
    job.logs.push('[studio] Injecting auto-refresh script')
  }

  if (config.showScrollbars) {
    const p = path.join(tmpDir, 'scrollbars.css')
    await fse.writeFile(p, RESTORE_SCROLLBARS_CSS)
    injectPaths.push(p)
    job.logs.push('[studio] Injecting scrollbar-restore CSS')
  }

  if (config.customCss) {
    const p = path.join(tmpDir, 'custom.css')
    await fse.writeFile(p, config.customCss)
    injectPaths.push(p)
    job.logs.push('[studio] Injecting custom CSS')
  }

  if (config.customJs) {
    const p = path.join(tmpDir, 'custom.js')
    await fse.writeFile(p, config.customJs)
    injectPaths.push(p)
    job.logs.push('[studio] Injecting custom JS')
  }

  // ── Resolve output directory ───────────────────────────────────────────────
  const outDir = config.out
    ? path.resolve(config.out)
    : path.join(os.homedir(), 'Desktop')
  await fse.ensureDir(outDir)

  // ── Build nativefier CLI args ──────────────────────────────────────────────
  const args: string[] = [config.url]

  args.push('--name', config.name)
  args.push('--platform', config.platform)
  args.push('--arch', config.arch)
  args.push('--out', outDir)

  if (config.icon) args.push('--icon', config.icon)

  // Window
  if (config.width) args.push('--width', String(config.width))
  if (config.height) args.push('--height', String(config.height))
  if (config.minWidth) args.push('--min-width', String(config.minWidth))
  if (config.minHeight) args.push('--min-height', String(config.minHeight))
  if (config.maxWidth) args.push('--max-width', String(config.maxWidth))
  if (config.maxHeight) args.push('--max-height', String(config.maxHeight))
  if (config.fullscreen) args.push('--full-screen')
  if (config.maximize) args.push('--maximize')
  if (config.hideWindowFrame) args.push('--hide-window-frame')
  if (config.alwaysOnTop) args.push('--always-on-top')
  if (config.titleBarStyle) args.push('--title-bar-style', config.titleBarStyle)
  if (config.backgroundColor) args.push('--background-color', config.backgroundColor)
  if (config.tabbedWindow) args.push('--tabbed-window')

  // Navigation
  if (config.internalUrls) args.push('--internal-urls', config.internalUrls)
  if (config.blockExternalUrls) args.push('--block-external-urls')

  // Session
  if (config.singleInstance) args.push('--single-instance')
  if (config.clearCache) args.push('--clear-cache')
  if (config.userAgent) args.push('--user-agent', config.userAgent)
  if (config.basicAuthUsername) args.push('--basic-auth-username', config.basicAuthUsername)
  if (config.basicAuthPassword) args.push('--basic-auth-password', config.basicAuthPassword)

  // Tray
  if (config.tray) args.push('--tray', config.tray)

  // Proxy
  if (config.proxyRules) args.push('--proxy-rules', config.proxyRules)

  // Security
  if (config.disableDevTools) args.push('--disable-dev-tools')
  if (config.disableContextMenu) args.push('--disable-context-menu')
  if (config.allowUnprotectedContent) args.push('--allow-unprotected-content')
  if (config.ignoreCertificate) args.push('--ignore-certificate')
  if (config.insecure) args.push('--insecure')
  if (config.notificationBadge) args.push('--notification-badge')

  // Zoom
  if (config.zoom != null) args.push('--zoom', String(config.zoom))

  // Inject files
  for (const p of injectPaths) {
    args.push('--inject', p)
  }

  job.logs.push(`[studio] Running: npx nativefier ${args.join(' ')}`)

  // ── Spawn nativefier ──────────────────────────────────────────────────────
  await new Promise<void>((resolve, reject) => {
    const child = spawn('npx', ['nativefier', ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '0' },
    })

    child.stdout.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(Boolean)
      lines.forEach((l) => job.logs.push(l))
    })

    child.stderr.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(Boolean)
      lines.forEach((l) => job.logs.push(`[stderr] ${l}`))
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`nativefier exited with code ${code}`))
      }
    })

    child.on('error', (err) => reject(err))
  })

  // ── Locate the output app ─────────────────────────────────────────────────
  const entries = await fse.readdir(outDir)
  const appEntry = entries.find((e) => e.toLowerCase().includes(config.name.toLowerCase()))
  job.outputPath = appEntry ? path.join(outDir, appEntry) : outDir

  job.logs.push(`[studio] Build finished → ${job.outputPath}`)
  job.status = 'success'
  job.finishedAt = new Date().toISOString()

  // Cleanup temp dir
  await fse.remove(tmpDir).catch(() => {})
}
