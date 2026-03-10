'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AppConfig, AppTemplate, BuildJob, IconResult } from '@/types'
import { WINDOW_SIZE_PRESETS, USER_AGENT_PRESETS, DARK_MODE_CSS_PRESET, FOCUS_MODE_CSS_PRESET, MINIMAL_SCROLLBAR_CSS_PRESET, BLANK_JS_PRESET } from '@/lib/presets'
import BuildProgress from '@/components/BuildProgress'

type Step = 'basic' | 'platform' | 'window' | 'advanced' | 'injection' | 'build'

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'basic',     label: 'Basic',     icon: '🌐' },
  { id: 'platform',  label: 'Platform',  icon: '💻' },
  { id: 'window',    label: 'Window',    icon: '🪟' },
  { id: 'advanced',  label: 'Advanced',  icon: '⚙️'  },
  { id: 'injection', label: 'Injection', icon: '💉' },
  { id: 'build',     label: 'Build',     icon: '🔨' },
]

interface Props {
  template?: AppTemplate | null
  onCreated?: () => void
}

export default function AppCreator({ template, onCreated }: Props) {
  const [step, setStep] = useState<Step>('basic')
  const [config, setConfig] = useState<Partial<AppConfig>>(() =>
    template
      ? {
          name: template.name,
          url: template.url,
          platform: 'linux',
          arch: 'x64',
          width: 1280,
          height: 800,
          templateId: template.id,
          iconUrl: template.iconUrl,
          ...template.config,
        }
      : { platform: 'linux', arch: 'x64', width: 1280, height: 800 }
  )
  const [icons, setIcons] = useState<IconResult[]>([])
  const [isFetchingIcons, setIsFetchingIcons] = useState(false)
  const [buildJob, setBuildJob] = useState<BuildJob | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set<K extends keyof AppConfig>(key: K, value: AppConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  function toggle(key: keyof AppConfig) {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const fetchIcons = useCallback(async (url: string) => {
    if (!url) return
    setIsFetchingIcons(true)
    try {
      const res = await fetch(`/api/icon?url=${encodeURIComponent(url)}`)
      if (res.ok) {
        const data = await res.json() as { icons: IconResult[] }
        setIcons(data.icons)
        if (data.icons.length > 0 && !config.iconUrl) {
          set('iconUrl', data.icons[0].url)
        }
      }
    } finally {
      setIsFetchingIcons(false)
    }
  }, [config.iconUrl])

  useEffect(() => {
    if (template?.iconUrl) {
      setIcons([{ url: template.iconUrl, source: 'clearbit' }])
    }
  }, [template])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!config.url) errs.url = 'URL is required'
    else {
      try { new URL(config.url) } catch { errs.url = 'Must be a valid URL' }
    }
    if (!config.name?.trim()) errs.name = 'App name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleBuild() {
    if (!validate()) { setStep('basic'); return }
    setIsSaving(true)
    try {
      // Save the app first
      const saveRes = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!saveRes.ok) throw new Error('Failed to save app')
      const { app } = await saveRes.json() as { app: { config: AppConfig } }

      // Kick off build
      const buildRes = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.config.id }),
      })
      if (!buildRes.ok) throw new Error('Failed to start build')
      const { build } = await buildRes.json() as { build: BuildJob }
      setBuildJob(build)
      setStep('build')
      onCreated?.()
    } catch (err) {
      alert(`Error: ${String(err)}`)
    } finally {
      setIsSaving(false)
    }
  }

  const currentStepIdx = STEPS.findIndex((s) => s.id === step)

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {template ? `Create from template: ${template.name}` : 'Create New App'}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Wrap any website into a desktop app with full customisation
        </p>
      </div>

      {/* Step indicators */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { if (i < currentStepIdx || step === 'build') setStep(s.id) }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition
              ${step === s.id
                ? 'text-brand-300 bg-brand-600/20'
                : i < currentStepIdx
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-default'
              }`}
          >
            <span>{s.icon}</span>
            {s.label}
            {i < STEPS.length - 1 && (
              <span className="ml-3 text-slate-700">›</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Basic ─────────────────────────────────────────────────────────── */}
      {step === 'basic' && (
        <div className="card p-6 space-y-5 animate-slide-in">
          <h2 className="text-lg font-semibold text-white">Basic Information</h2>

          <div>
            <label className="label">Website URL *</label>
            <div className="flex gap-2">
              <input
                className={`input flex-1 ${errors.url ? 'border-red-500' : ''}`}
                type="url"
                placeholder="https://example.com"
                value={config.url ?? ''}
                onChange={(e) => {
                  set('url', e.target.value)
                  setErrors((p) => ({ ...p, url: '' }))
                }}
                onBlur={() => config.url && fetchIcons(config.url)}
              />
              <button
                className="btn-secondary shrink-0"
                onClick={() => config.url && fetchIcons(config.url)}
                disabled={isFetchingIcons}
              >
                {isFetchingIcons ? '⏳' : '🔍'} Icons
              </button>
            </div>
            {errors.url && <p className="mt-1 text-xs text-red-400">{errors.url}</p>}
          </div>

          <div>
            <label className="label">App Name *</label>
            <input
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="My App"
              value={config.name ?? ''}
              onChange={(e) => {
                set('name', e.target.value)
                setErrors((p) => ({ ...p, name: '' }))
              }}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Icon picker */}
          {icons.length > 0 && (
            <div>
              <label className="label">App Icon</label>
              <div className="flex flex-wrap gap-3">
                {icons.slice(0, 6).map((icon) => (
                  <button
                    key={icon.url}
                    onClick={() => set('iconUrl', icon.url)}
                    className={`rounded-xl border-2 p-1 transition ${
                      config.iconUrl === icon.url
                        ? 'border-brand-500'
                        : 'border-transparent hover:border-white/20'
                    }`}
                    title={icon.source}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={icon.url}
                      alt={icon.source}
                      className="h-12 w-12 rounded-lg object-contain bg-white/5"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <label className="label">Or paste icon URL / local path</label>
                <input
                  className="input"
                  placeholder="https://… or /path/to/icon.png"
                  value={config.iconUrl ?? ''}
                  onChange={(e) => set('iconUrl', e.target.value)}
                />
              </div>
            </div>
          )}

          {icons.length === 0 && (
            <div>
              <label className="label">Icon URL or local path</label>
              <input
                className="input"
                placeholder="https://… or /path/to/icon.png"
                value={config.iconUrl ?? ''}
                onChange={(e) => set('iconUrl', e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="label">Internal URLs (regex, optional)</label>
            <input
              className="input font-mono text-xs"
              placeholder="https?://.*\.myapp\.com.*"
              value={config.internalUrls ?? ''}
              onChange={(e) => set('internalUrls', e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              URLs matching this pattern open inside the app; all others open in the browser.
            </p>
          </div>

          <div>
            <label className="label">Tags (comma separated)</label>
            <input
              className="input"
              placeholder="work, productivity"
              value={(config.tags ?? []).join(', ')}
              onChange={(e) =>
                set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
              }
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              className="input h-20 resize-none"
              placeholder="Optional notes about this app…"
              value={config.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button className="btn-primary" onClick={() => { if (validate()) setStep('platform') }}>
              Next: Platform →
            </button>
          </div>
        </div>
      )}

      {/* ── Platform ─────────────────────────────────────────────────────── */}
      {step === 'platform' && (
        <div className="card p-6 space-y-5 animate-slide-in">
          <h2 className="text-lg font-semibold text-white">Build Target</h2>

          <div>
            <label className="label">Platform</label>
            <div className="grid grid-cols-3 gap-3">
              {(['linux', 'mac', 'windows'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => set('platform', p)}
                  className={`rounded-xl border p-4 text-center transition ${
                    config.platform === p
                      ? 'border-brand-500 bg-brand-600/10 text-brand-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <div className="text-3xl mb-1">
                    {p === 'linux' ? '🐧' : p === 'mac' ? '🍎' : '🪟'}
                  </div>
                  <div className="text-sm font-medium capitalize">{p}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Architecture</label>
            <div className="flex gap-3">
              {(['x64', 'arm64', 'armv7l'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => set('arch', a)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-mono font-medium transition ${
                    config.arch === a
                      ? 'border-brand-500 bg-brand-600/10 text-brand-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Output Directory</label>
            <input
              className="input font-mono text-xs"
              placeholder="~/Desktop"
              value={config.out ?? ''}
              onChange={(e) => set('out', e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">Leave blank to use the default (~/Desktop)</p>
          </div>

          <div className="flex justify-between pt-2">
            <button className="btn-secondary" onClick={() => setStep('basic')}>← Back</button>
            <button className="btn-primary" onClick={() => setStep('window')}>Next: Window →</button>
          </div>
        </div>
      )}

      {/* ── Window ────────────────────────────────────────────────────────── */}
      {step === 'window' && (
        <div className="card p-6 space-y-5 animate-slide-in">
          <h2 className="text-lg font-semibold text-white">Window Settings</h2>

          <div>
            <label className="label">Size Presets</label>
            <div className="flex flex-wrap gap-2">
              {WINDOW_SIZE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { set('width', p.width); set('height', p.height) }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    config.width === p.width && config.height === p.height
                      ? 'border-brand-500 bg-brand-600/10 text-brand-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Width</label>
              <input className="input" type="number" min={400} value={config.width ?? 1280}
                onChange={(e) => set('width', parseInt(e.target.value) || 1280)} />
            </div>
            <div>
              <label className="label">Height</label>
              <input className="input" type="number" min={300} value={config.height ?? 800}
                onChange={(e) => set('height', parseInt(e.target.value) || 800)} />
            </div>
            <div>
              <label className="label">Min Width</label>
              <input className="input" type="number" min={200} value={config.minWidth ?? ''}
                placeholder="none"
                onChange={(e) => set('minWidth', parseInt(e.target.value) || undefined)} />
            </div>
            <div>
              <label className="label">Min Height</label>
              <input className="input" type="number" min={200} value={config.minHeight ?? ''}
                placeholder="none"
                onChange={(e) => set('minHeight', parseInt(e.target.value) || undefined)} />
            </div>
          </div>

          <div>
            <label className="label">Background Colour</label>
            <div className="flex gap-2 items-center">
              <input
                className="input w-28"
                placeholder="#1a1a1a"
                value={config.backgroundColor ?? ''}
                onChange={(e) => set('backgroundColor', e.target.value)}
              />
              {config.backgroundColor && (
                <div
                  className="h-8 w-8 rounded-lg border border-white/10"
                  style={{ background: config.backgroundColor }}
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="label">Window Behaviour</label>
            {[
              { key: 'fullscreen',       label: 'Start fullscreen' },
              { key: 'maximize',         label: 'Start maximised' },
              { key: 'alwaysOnTop',      label: 'Always on top' },
              { key: 'hideWindowFrame',  label: 'Hide window frame (frameless)' },
              { key: 'tabbedWindow',     label: 'Tabbed window (macOS)' },
            ].map(({ key, label }) => (
              <ToggleRow
                key={key}
                label={label}
                checked={!!config[key as keyof AppConfig]}
                onChange={() => toggle(key as keyof AppConfig)}
              />
            ))}
          </div>

          <div>
            <label className="label">Title Bar Style (macOS)</label>
            <select
              className="input"
              value={config.titleBarStyle ?? 'default'}
              onChange={(e) => set('titleBarStyle', e.target.value as AppConfig['titleBarStyle'])}
            >
              <option value="default">Default</option>
              <option value="hidden">Hidden</option>
              <option value="hiddenInset">Hidden Inset</option>
              <option value="customButtonsOnHover">Custom Buttons on Hover</option>
            </select>
          </div>

          <div>
            <label className="label">System Tray</label>
            <select
              className="input"
              value={config.tray ?? 'false'}
              onChange={(e) => set('tray', e.target.value as AppConfig['tray'])}
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
              <option value="start-in-tray">Start in tray</option>
            </select>
          </div>

          <div className="flex justify-between pt-2">
            <button className="btn-secondary" onClick={() => setStep('platform')}>← Back</button>
            <button className="btn-primary" onClick={() => setStep('advanced')}>Next: Advanced →</button>
          </div>
        </div>
      )}

      {/* ── Advanced ─────────────────────────────────────────────────────── */}
      {step === 'advanced' && (
        <div className="card p-6 space-y-5 animate-slide-in">
          <h2 className="text-lg font-semibold text-white">Advanced Settings</h2>

          <div>
            <label className="label">User Agent</label>
            <select
              className="input mb-2"
              value=""
              onChange={(e) => { if (e.target.value) set('userAgent', e.target.value) }}
            >
              <option value="">— Pick a preset —</option>
              {USER_AGENT_PRESETS.map((p) => (
                <option key={p.label} value={p.value}>{p.label}</option>
              ))}
            </select>
            <input
              className="input font-mono text-xs"
              placeholder="Custom user agent string…"
              value={config.userAgent ?? ''}
              onChange={(e) => set('userAgent', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Default Zoom (%)</label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={25} max={300} step={5}
                value={Math.round((config.zoom ?? 1) * 100)}
                onChange={(e) => set('zoom', parseInt(e.target.value) / 100)}
                className="flex-1 accent-brand-500"
              />
              <span className="w-12 text-center text-sm font-mono text-slate-300">
                {Math.round((config.zoom ?? 1) * 100)}%
              </span>
            </div>
          </div>

          <div>
            <label className="label">Proxy Rules</label>
            <input
              className="input font-mono text-xs"
              placeholder="http://host:port or socks5://host:port"
              value={config.proxyRules ?? ''}
              onChange={(e) => set('proxyRules', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Basic Auth Username</label>
              <input className="input" value={config.basicAuthUsername ?? ''}
                onChange={(e) => set('basicAuthUsername', e.target.value)} />
            </div>
            <div>
              <label className="label">Basic Auth Password</label>
              <input className="input" type="password" value={config.basicAuthPassword ?? ''}
                onChange={(e) => set('basicAuthPassword', e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="label">Security & Behaviour</label>
            {[
              { key: 'singleInstance',      label: 'Single instance only' },
              { key: 'clearCache',          label: 'Clear cache on launch' },
              { key: 'disableDevTools',     label: 'Disable developer tools' },
              { key: 'disableContextMenu',  label: 'Disable right-click menu' },
              { key: 'blockExternalUrls',   label: 'Block all external URLs' },
              { key: 'notificationBadge',   label: 'Show notification badge on icon' },
              { key: 'ignoreCertificate',   label: 'Ignore certificate errors (⚠️ insecure)' },
              { key: 'insecure',            label: 'Allow insecure content (⚠️ insecure)' },
            ].map(({ key, label }) => (
              <ToggleRow
                key={key}
                label={label}
                checked={!!config[key as keyof AppConfig]}
                onChange={() => toggle(key as keyof AppConfig)}
              />
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button className="btn-secondary" onClick={() => setStep('window')}>← Back</button>
            <button className="btn-primary" onClick={() => setStep('injection')}>Next: Injection →</button>
          </div>
        </div>
      )}

      {/* ── Injection ────────────────────────────────────────────────────── */}
      {step === 'injection' && (
        <div className="card p-6 space-y-5 animate-slide-in">
          <h2 className="text-lg font-semibold text-white">Injection & Extras</h2>
          <p className="text-sm text-slate-400">
            These features are unique to Nativefier Studio — they work by injecting code at startup.
          </p>

          <div className="space-y-3">
            <label className="label">Built-in Enhancements</label>
            {[
              { key: 'forceDarkMode',          label: '🌙 Force dark mode', desc: 'Inject a universal dark-mode stylesheet' },
              { key: 'adBlocking',             label: '🛡️ Ad & tracker blocking', desc: 'Block requests to known ad/analytics domains' },
              { key: 'autoRefreshOnDisconnect',label: '🔄 Auto-refresh on reconnect', desc: 'Reload when internet comes back' },
              { key: 'showScrollbars',         label: '↕️ Restore hidden scrollbars', desc: 'Re-show scrollbars sites hide with CSS' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start gap-3 rounded-lg border border-white/10 bg-surface-900 p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
                <Toggle
                  checked={!!config[key as keyof AppConfig]}
                  onChange={() => toggle(key as keyof AppConfig)}
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Custom CSS</label>
              <div className="flex gap-1">
                {[
                  { label: 'Dark Mode', value: DARK_MODE_CSS_PRESET },
                  { label: 'Focus', value: FOCUS_MODE_CSS_PRESET },
                  { label: 'Scrollbars', value: MINIMAL_SCROLLBAR_CSS_PRESET },
                ].map(({ label, value }) => (
                  <button
                    key={label}
                    className="btn-ghost py-0.5 px-2 text-xs"
                    onClick={() => set('customCss', (config.customCss ?? '') + '\n' + value)}
                  >
                    + {label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="input h-40 resize-y font-mono text-xs"
              placeholder="/* Your custom CSS here… */"
              value={config.customCss ?? ''}
              onChange={(e) => set('customCss', e.target.value)}
              spellCheck={false}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Custom JavaScript</label>
              <button
                className="btn-ghost py-0.5 px-2 text-xs"
                onClick={() => set('customJs', BLANK_JS_PRESET)}
              >
                + Starter template
              </button>
            </div>
            <textarea
              className="input h-40 resize-y font-mono text-xs"
              placeholder="// Custom JS injected at startup…"
              value={config.customJs ?? ''}
              onChange={(e) => set('customJs', e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex justify-between pt-2">
            <button className="btn-secondary" onClick={() => setStep('advanced')}>← Back</button>
            <button className="btn-primary" onClick={() => setStep('build')}>Next: Build →</button>
          </div>
        </div>
      )}

      {/* ── Build ────────────────────────────────────────────────────────── */}
      {step === 'build' && (
        <div className="space-y-4 animate-slide-in">
          {!buildJob ? (
            <div className="card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Ready to Build</h2>

              {/* Summary */}
              <div className="rounded-lg border border-white/10 bg-surface-900 p-4 space-y-2 text-sm">
                <Row label="Name" value={config.name ?? '–'} />
                <Row label="URL" value={config.url ?? '–'} />
                <Row label="Platform" value={`${config.platform} / ${config.arch}`} />
                <Row label="Size" value={`${config.width}×${config.height}`} />
                {config.forceDarkMode && <Row label="Dark mode" value="✓ enabled" />}
                {config.adBlocking && <Row label="Ad blocking" value="✓ enabled" />}
                {config.customCss && <Row label="Custom CSS" value={`${config.customCss.length} chars`} />}
                {config.customJs && <Row label="Custom JS" value={`${config.customJs.length} chars`} />}
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300">
                ⚠️ nativefier will download Electron and build the app. This may take 2–5 minutes.
              </div>

              <div className="flex justify-between pt-2">
                <button className="btn-secondary" onClick={() => setStep('injection')}>← Back</button>
                <button
                  className="btn-primary text-base px-8 py-3"
                  onClick={handleBuild}
                  disabled={isSaving}
                >
                  {isSaving ? '⏳ Starting…' : '🔨 Build App'}
                </button>
              </div>
            </div>
          ) : (
            <BuildProgress job={buildJob} onPollUpdate={setBuildJob} />
          )}
        </div>
      )}
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`toggle shrink-0 ${checked ? 'bg-brand-600' : 'bg-slate-700'}`}
    >
      <span
        className={`toggle-thumb ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  )
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500 w-28 shrink-0">{label}</span>
      <span className="text-slate-200 font-mono truncate">{value}</span>
    </div>
  )
}
