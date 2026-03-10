'use client'

import { useEffect, useState } from 'react'
import type { UserSettings } from '@/types'
import { WINDOW_SIZE_PRESETS } from '@/lib/presets'

export default function SettingsPanel() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json() as Promise<{ settings: UserSettings }>)
      .then(({ settings: s }) => setSettings(s))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!settings) return
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  function set<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  if (loading || !settings) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        <span className="animate-spin text-2xl">⚙️</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Global defaults applied to new apps</p>
      </div>

      <div className="space-y-6">
        {/* Output */}
        <Section title="Output">
          <div>
            <label className="label">Default Output Directory</label>
            <input
              className="input font-mono text-xs"
              value={settings.defaultOutputDir}
              onChange={(e) => set('defaultOutputDir', e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Where built apps are saved. Each build creates a subdirectory here.
            </p>
          </div>
        </Section>

        {/* Platform */}
        <Section title="Default Platform">
          <div className="grid grid-cols-3 gap-3">
            {(['linux', 'mac', 'windows'] as const).map((p) => (
              <button
                key={p}
                onClick={() => set('defaultPlatform', p)}
                className={`rounded-xl border p-4 text-center transition ${
                  settings.defaultPlatform === p
                    ? 'border-brand-500 bg-brand-600/10 text-brand-300'
                    : 'border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="text-3xl mb-1">
                  {p === 'linux' ? '🐧' : p === 'mac' ? '🍎' : '🪟'}
                </div>
                <div className="text-sm font-medium capitalize">{p}</div>
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label className="label">Default Architecture</label>
            <div className="flex gap-3">
              {(['x64', 'arm64', 'armv7l'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => set('defaultArch', a)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-mono font-medium transition ${
                    settings.defaultArch === a
                      ? 'border-brand-500 bg-brand-600/10 text-brand-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Window */}
        <Section title="Default Window Size">
          <div className="flex flex-wrap gap-2 mb-3">
            {WINDOW_SIZE_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { set('defaultWidth', p.width); set('defaultHeight', p.height) }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  settings.defaultWidth === p.width && settings.defaultHeight === p.height
                    ? 'border-brand-500 bg-brand-600/10 text-brand-300'
                    : 'border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Width</label>
              <input
                className="input" type="number" min={400}
                value={settings.defaultWidth}
                onChange={(e) => set('defaultWidth', parseInt(e.target.value) || 1280)}
              />
            </div>
            <div>
              <label className="label">Height</label>
              <input
                className="input" type="number" min={300}
                value={settings.defaultHeight}
                onChange={(e) => set('defaultHeight', parseInt(e.target.value) || 800)}
              />
            </div>
          </div>
        </Section>

        {/* Proxy */}
        <Section title="Global Proxy">
          <div>
            <label className="label">Proxy Rules</label>
            <input
              className="input font-mono text-xs"
              placeholder="http://host:port  or  socks5://host:port"
              value={settings.proxyRules ?? ''}
              onChange={(e) => set('proxyRules', e.target.value || undefined)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Applied to all new apps unless overridden per-app.
            </p>
          </div>
        </Section>

        {/* nativefier binary */}
        <Section title="nativefier Path">
          <div>
            <label className="label">Custom nativefier binary path</label>
            <input
              className="input font-mono text-xs"
              placeholder="Leave blank to use npx nativefier"
              value={settings.nativefierPath ?? ''}
              onChange={(e) => set('nativefierPath', e.target.value || undefined)}
            />
          </div>
        </Section>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-400 animate-fade-in">
              ✅ Saved!
            </span>
          )}
          <button className="btn-primary px-8" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {children}
    </div>
  )
}
