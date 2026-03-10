'use client'

import { useState } from 'react'
import { APP_TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates'
import type { AppTemplate, TemplateCategory } from '@/types'

interface Props {
  onUseTemplate: (template: AppTemplate) => void
}

export default function TemplateGallery({ onUseTemplate }: Props) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All')

  const filtered = APP_TEMPLATES.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory
    return matchSearch && matchCat
  })

  const categories: Array<TemplateCategory | 'All'> = ['All', ...TEMPLATE_CATEGORIES]

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Template Gallery</h1>
        <p className="mt-1 text-sm text-slate-400">
          Pre-configured apps for popular services — one click to get started
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <input
          className="input max-w-md"
          placeholder="🔍 Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {CATEGORY_ICONS[cat as TemplateCategory] ?? '🌐'} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="mb-4 text-xs text-slate-500">
        {filtered.length} template{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={() => onUseTemplate(template)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          No templates match your search.
        </div>
      )}
    </div>
  )
}

function TemplateCard({
  template,
  onUse,
}: {
  template: AppTemplate
  onUse: () => void
}) {
  const extras = []
  if (template.config.adBlocking) extras.push('🛡️ AdBlock')
  if (template.config.forceDarkMode) extras.push('🌙 Dark')
  if (template.config.tray) extras.push('📌 Tray')
  if (template.config.singleInstance) extras.push('☝️ Single')

  return (
    <div className="card flex flex-col overflow-hidden transition hover:border-white/15 hover:-translate-y-0.5">
      <div className="flex items-start gap-3 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.iconUrl}
          alt={template.name}
          className="h-12 w-12 rounded-xl object-contain bg-white/5 shrink-0"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              `https://icons.duckduckgo.com/ip3/${new URL(template.url).hostname}.ico`
          }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate">{template.name}</h3>
            <span
              className="badge shrink-0 text-xs"
              style={{
                background: CATEGORY_COLOURS[template.category]?.bg,
                color: CATEGORY_COLOURS[template.category]?.text,
              }}
            >
              {template.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{template.description}</p>
        </div>
      </div>

      {/* Config highlights */}
      {extras.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1">
          {extras.map((e) => (
            <span key={e} className="badge bg-surface-900 text-slate-500 text-xs">{e}</span>
          ))}
        </div>
      )}

      <div className="mt-auto border-t border-white/5 p-3 flex items-center justify-between">
        <span className="text-xs text-slate-500 truncate max-w-[160px]">
          {new URL(template.url).hostname}
        </span>
        <button className="btn-primary py-1 px-4 text-xs" onClick={onUse}>
          Use Template →
        </button>
      </div>
    </div>
  )
}

// ── Category helpers ──────────────────────────────────────────────────────────

const CATEGORY_ICONS: Partial<Record<TemplateCategory | 'All', string>> = {
  All:           '🌐',
  Productivity:  '📋',
  Communication: '💬',
  Development:   '🛠️',
  Entertainment: '🎬',
  Social:        '👥',
  Finance:       '💰',
  Design:        '🎨',
  News:          '📰',
  Education:     '📚',
}

const CATEGORY_COLOURS: Record<
  TemplateCategory,
  { bg: string; text: string }
> = {
  Productivity:  { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc' },
  Communication: { bg: 'rgba(34,197,94,0.15)',   text: '#86efac' },
  Development:   { bg: 'rgba(14,165,233,0.15)',  text: '#7dd3fc' },
  Entertainment: { bg: 'rgba(249,115,22,0.15)',  text: '#fdba74' },
  Social:        { bg: 'rgba(236,72,153,0.15)',  text: '#f9a8d4' },
  Finance:       { bg: 'rgba(234,179,8,0.15)',   text: '#fde047' },
  Design:        { bg: 'rgba(168,85,247,0.15)',  text: '#d8b4fe' },
  News:          { bg: 'rgba(239,68,68,0.15)',   text: '#fca5a5' },
  Education:     { bg: 'rgba(20,184,166,0.15)',  text: '#5eead4' },
}
