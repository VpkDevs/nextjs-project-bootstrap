'use client'

import { useEffect, useState } from 'react'
import type { AppRecord } from '@/types'

interface Props {
  onEditApp: (id: string) => void
}

export default function AppLibrary({ onEditApp }: Props) {
  const [apps, setApps] = useState<AppRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [exporting, setExporting] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/apps')
      if (res.ok) {
        const data = await res.json() as { apps: AppRecord[] }
        setApps(data.apps)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this app configuration?')) return
    await fetch(`/api/apps/${id}`, { method: 'DELETE' })
    setApps((prev) => prev.filter((a) => a.config.id !== id))
  }

  async function handleRebuild(id: string) {
    const res = await fetch('/api/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId: id }),
    })
    if (res.ok) {
      alert('Build started! Check the build log for progress.')
    }
  }

  function handleExport(record: AppRecord) {
    setExporting(record.config.id)
    const blob = new Blob([JSON.stringify(record.config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${record.config.name.replace(/\s+/g, '-').toLowerCase()}-config.json`
    a.click()
    URL.revokeObjectURL(url)
    setExporting(null)
  }

  const allTags = [...new Set(apps.flatMap((a) => a.config.tags ?? []))]

  const filtered = apps.filter((a) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      a.config.name.toLowerCase().includes(q) ||
      a.config.url.toLowerCase().includes(q) ||
      (a.config.tags ?? []).some((t) => t.toLowerCase().includes(q))
    const matchTag = !selectedTag || (a.config.tags ?? []).includes(selectedTag)
    return matchSearch && matchTag
  })

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        <span className="animate-spin text-2xl">⚙️</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Apps</h1>
          <p className="mt-1 text-sm text-slate-400">
            {apps.length} app{apps.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <button className="btn-secondary" onClick={load}>🔄 Refresh</button>
      </div>

      {/* Filters */}
      {apps.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            className="input w-64"
            placeholder="🔍 Search apps…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {allTags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTag('')}
                className={`badge ${!selectedTag ? 'bg-brand-600/30 text-brand-300' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`badge ${selectedTag === tag ? 'bg-brand-600/30 text-brand-300' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {apps.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-24 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-white mb-2">No apps yet</h3>
          <p className="text-sm text-slate-500">
            Create your first app with the <strong className="text-slate-400">Create App</strong> tab.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((record) => (
          <AppCard
            key={record.config.id}
            record={record}
            onEdit={() => onEditApp(record.config.id)}
            onDelete={() => handleDelete(record.config.id)}
            onRebuild={() => handleRebuild(record.config.id)}
            onExport={() => handleExport(record)}
            isExporting={exporting === record.config.id}
          />
        ))}
      </div>
    </div>
  )
}

// ── App Card ─────────────────────────────────────────────────────────────────

interface CardProps {
  record: AppRecord
  onEdit: () => void
  onDelete: () => void
  onRebuild: () => void
  onExport: () => void
  isExporting: boolean
}

function AppCard({ record, onDelete, onRebuild, onExport, isExporting }: CardProps) {
  const { config, lastBuild } = record
  const platformIcon = config.platform === 'mac' ? '🍎' : config.platform === 'windows' ? '🪟' : '🐧'

  const buildStatusColour = lastBuild?.status === 'success'
    ? 'text-green-400'
    : lastBuild?.status === 'failed'
    ? 'text-red-400'
    : lastBuild?.status === 'running'
    ? 'text-blue-400'
    : 'text-slate-500'

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:border-white/15">
      {/* Top colour strip */}
      <div className="h-1 bg-gradient-to-r from-brand-600 to-brand-400" />

      <div className="flex flex-1 flex-col p-4 gap-3">
        {/* Icon + name */}
        <div className="flex items-center gap-3">
          {config.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.iconUrl}
              alt={config.name}
              className="h-10 w-10 rounded-xl object-contain bg-white/5 shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-brand-600/20 flex items-center justify-center text-xl shrink-0">
              🌐
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{config.name}</h3>
            <p className="text-xs text-slate-500 truncate">{config.url}</p>
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="badge bg-surface-900 text-slate-400">
            {platformIcon} {config.platform}/{config.arch}
          </span>
          {config.forceDarkMode && (
            <span className="badge bg-surface-900 text-blue-400">🌙 Dark</span>
          )}
          {config.adBlocking && (
            <span className="badge bg-surface-900 text-green-400">🛡️ AdBlock</span>
          )}
          {config.tray === 'true' && (
            <span className="badge bg-surface-900 text-yellow-400">📌 Tray</span>
          )}
        </div>

        {/* Tags */}
        {(config.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(config.tags ?? []).map((tag) => (
              <span key={tag} className="badge bg-brand-600/10 text-brand-400 text-xs">{tag}</span>
            ))}
          </div>
        )}

        {/* Build status */}
        {lastBuild && (
          <div className={`text-xs ${buildStatusColour} flex items-center gap-1`}>
            {lastBuild.status === 'success' ? '✅' : lastBuild.status === 'failed' ? '❌' : '⚙️'}
            Last build: {lastBuild.status}
            {lastBuild.finishedAt && (
              <span className="text-slate-600 ml-1">
                {new Date(lastBuild.finishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* Output path */}
        {lastBuild?.outputPath && lastBuild.status === 'success' && (
          <code className="text-xs text-slate-500 font-mono truncate" title={lastBuild.outputPath}>
            📁 {lastBuild.outputPath}
          </code>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 border-t border-white/5 flex flex-wrap gap-2">
          <button className="btn-primary py-1 px-3 text-xs" onClick={onRebuild}>
            🔨 Build
          </button>
          <button className="btn-secondary py-1 px-3 text-xs" onClick={onExport} disabled={isExporting}>
            📤 Export
          </button>
          <button className="btn-danger py-1 px-3 text-xs ml-auto" onClick={onDelete}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
