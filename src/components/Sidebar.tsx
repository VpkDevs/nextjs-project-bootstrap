'use client'

import type { ActiveView } from '@/app/page'

const NAV_ITEMS: { id: ActiveView; label: string; icon: string }[] = [
  { id: 'create',    label: 'Create App',  icon: '✨' },
  { id: 'library',   label: 'My Apps',     icon: '📚' },
  { id: 'templates', label: 'Templates',   icon: '🎨' },
  { id: 'settings',  label: 'Settings',    icon: '⚙️'  },
]

interface Props {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
}

export default function Sidebar({ activeView, onNavigate }: Props) {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-white/10 bg-surface-900 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg shadow-lg shadow-brand-900/50">
          🚀
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-none">Nativefier</p>
          <p className="text-xs text-brand-400 mt-0.5">Studio</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        <p className="section-title px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`
              w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
              ${activeView === id
                ? 'bg-brand-600/20 text-brand-300 shadow-inner'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }
            `}
          >
            <span className="text-base">{icon}</span>
            {label}
            {activeView === id && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-xs text-slate-600">Powered by nativefier</p>
        <p className="text-xs text-slate-700 mt-0.5">v1.0.0</p>
      </div>
    </aside>
  )
}
